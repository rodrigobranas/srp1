// ETAPA 2 — CHUNKING
// Quebra os registros da ingestão em chunks: o pedaço de texto que vira um embedding e é o que a busca devolve.
// Cada fonte tem a sua estratégia, porque os textos têm formas diferentes:
//
//   - Documentos (artigos e livros): divisão RECURSIVA. Um livro tem ~55 mil palavras e trata de dezenas de assuntos;
//     num chunk só, o vetor seria a "média" de tudo (e nem caberia no modelo). O texto é cortado pelo maior separador
//     possível (seção, subseção, parágrafo, linha, frase, palavra); o pedaço que ainda passa do tamanho do chunk é
//     cortado de novo pelo separador seguinte, e os pedaços pequenos vizinhos são reagrupados até esse tamanho, com uma
//     sobreposição entre um chunk e o seguinte. Assim o corte respeita a estrutura do texto sempre que possível.
//
//   - Prontuários: divisão pela ESTRUTURA, um prontuário por chunk. O prontuário conta a história de um paciente
//     (antecedentes, atendimentos, desfecho), e a pergunta costuma ser sobre o caso: partido, um chunk teria o
//     diagnóstico e outro o desfecho, sem ligação entre eles. O JSON vira um texto organizado, que é o que se embeda.
//
// Entrada: data/01-documentos.jsonl e data/01-prontuarios.jsonl
// Saída:   data/02-documentos.jsonl e data/02-prontuarios.jsonl (um chunk por linha)
//
// Rodar: bun 02-chunking.ts         (ou bun run chunk)
//        bun 02-chunking.ts <id>    para ver os chunks de um documento ou prontuário,
//                                   por exemplo artigos/09-crise-hipertensiva ou 42

import { countTokens } from "gpt-tokenizer/encoding/cl100k_base";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;
// O tamanho é medido em tokens, a unidade do modelo de embedding (cl100k_base é o tokenizador do text-embedding-3-small).
// ~500 tokens (~300 palavras) costuma ser um trecho com um assunto só: pequeno o bastante para o vetor ser específico
// e grande o bastante para o trecho fazer sentido sozinho.
const CHUNK_TOKENS = 500;
// A sobreposição repete o fim de um chunk no começo do seguinte: uma ideia cortada na fronteira aparece inteira em um deles.
const OVERLAP_TOKENS = 75;
// O text-embedding-3-small aceita até 8.191 tokens por texto e recusa o que passar disso; 8.000 deixa uma margem.
// Um prontuário acima disso é erro, e não um caso para cortar às cegas.
const MAX_TOKENS = 8000;
const DOCUMENTS_INPUT = "data/01-documentos.jsonl";
const RECORDS_INPUT = "data/01-prontuarios.jsonl";
const DOCUMENTS_OUTPUT = "data/02-documentos.jsonl";
const RECORDS_OUTPUT = "data/02-prontuarios.jsonl";

// Os separadores da divisão recursiva, do maior para o menor. O fim de cada ocorrência é onde o texto é cortado:
// nos títulos, o corte fica antes do "##", para o título ficar com a sua seção; nos demais, depois do separador.
const SEPARATORS = [
  /\n(?=## )/g, // seção
  /\n(?=### )/g, // subseção
  /\n(?=#### )/g,
  /\n(?=#{5,6} )/g,
  /\n[ \t]*\n/g, // parágrafo (uma tabela inteira, sem linha em branco no meio, também é um parágrafo)
  /\n/g, // linha (numa tabela, uma linha da tabela)
  /[.!?]\s+/g, // frase
  /\s+/g // palavra
];
const HEADING = /^(#{2,6}) (.+)$/;

// -----------------------------------------------------------------------------
// O formato dos registros que esta etapa lê (da etapa 1) e produz
// -----------------------------------------------------------------------------
type Documento = { id: string; tipo: string; arquivo: string; titulo: string; fonte: { ano: number | null } | null; texto: string };

type Prontuario = {
  id: string;
  paciente: { nome: string; sexo: "F" | "M"; dataNascimento: string; cidade: string; uf: string; profissao: string; antecedentes: string; alergias: string };
  atendimentos: {
    data: string;
    tipo: string;
    medico: { nome: string; especialidade: string };
    queixaPrincipal: string;
    sinaisVitais: { pressaoSistolica: number | null; pressaoDiastolica: number | null; frequenciaCardiaca: number | null; pesoKg: number | null };
    evolucao: string;
    conduta: string;
    diagnosticos: { cid: string; descricao: string }[];
    exames: { nome: string; resultado: string }[];
    prescricoes: { medicamento: string; dose: string; posologia: string }[];
  }[];
  desfecho: { data: string; situacao: string; descricao: string } | null;
};

// Os dois arquivos de saída têm o mesmo formato de chunk; só os metadados mudam de uma fonte para a outra.
type Chunk<Metadados> = {
  id: string; // <documentoId>#<indice>
  documentoId: string; // o id do registro na etapa 1, para voltar à origem
  indice: number; // a posição do chunk dentro do documento
  conteudo: string; // o texto que vai para o embedding
  tokens: number;
  metadados: Metadados;
};

type MetadadosDocumento = {
  tipo: string;
  titulo: string;
  arquivo: string;
  secao: string; // o caminho de títulos onde o trecho começa
  inicio: number; // a posição do trecho no texto do documento (data/01-documentos.jsonl)
  fim: number;
};

// Campos para filtrar a busca (pacientes de uma cidade, com um CID, que foram a óbito...) sem depender do embedding.
type MetadadosProntuario = {
  paciente: string;
  sexo: string;
  dataNascimento: string;
  cidade: string;
  uf: string;
  cids: string[];
  atendimentos: number;
  primeiroAtendimento: string;
  ultimoAtendimento: string;
  desfecho: string | null;
};

function readJsonl<T>(file: string): T[] {
  const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
  return lines.filter(Boolean).map((line) => JSON.parse(line));
}

// -----------------------------------------------------------------------------
// 1. Documentos: divisão recursiva
// -----------------------------------------------------------------------------
// Um pedaço é um intervalo [start, end) do texto original. Como os separadores ficam dentro dos pedaços, juntar
// pedaços vizinhos devolve exatamente o trecho original: cada chunk sabe onde está no documento.
type Piece = { start: number; end: number; tokens: number };

function splitRecursive(text: string, start: number, end: number, level = 0): Piece[] {
  const chunks: Piece[] = [];
  let small: Piece[] = [];
  for (const piece of cut(text, start, end, level)) {
    // O último nível (corte por tamanho) não tem para onde descer: o pedaço fica como está.
    if (piece.tokens <= CHUNK_TOKENS || level === SEPARATORS.length) {
      small.push(piece);
      continue;
    }
    // Um pedaço grande demais: os pequenos acumulados até aqui viram chunks, e ele é dividido pelo próximo separador.
    chunks.push(...merge(small));
    small = [];
    chunks.push(...splitRecursive(text, piece.start, piece.end, level + 1));
  }
  chunks.push(...merge(small));
  return chunks;
}

// Corta o intervalo pelo separador do nível. Se o separador não aparece, sai um pedaço só, e o nível seguinte tenta.
// Depois da palavra, não há mais separador: uma "palavra" maior do que o chunk é cortada por tamanho.
function cut(text: string, start: number, end: number, level: number): Piece[] {
  const positions = [start];
  const separator = SEPARATORS[level];
  if (separator) {
    for (const match of text.slice(start, end).matchAll(separator)) {
      const position = start + match.index + match[0].length;
      if (position > start && position < end) positions.push(position);
    }
  } else {
    const step = Math.max(1, Math.floor(((end - start) * CHUNK_TOKENS) / countTokens(text.slice(start, end))));
    for (let position = start + step; position < end; position += step) positions.push(position);
  }
  positions.push(end);

  const pieces: Piece[] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    const pieceStart = positions[i]!;
    const pieceEnd = positions[i + 1]!;
    pieces.push({ start: pieceStart, end: pieceEnd, tokens: countTokens(text.slice(pieceStart, pieceEnd)) });
  }
  return pieces;
}

// Junta pedaços vizinhos até o tamanho do chunk. Ao fechar um chunk, o seguinte começa com os últimos pedaços dele
// que somam até OVERLAP_TOKENS: é a sobreposição. Somar os tokens das partes é uma aproximação (a junção pode variar
// um token ou outro), mas evita recontar o chunk inteiro a cada pedaço acrescentado.
function merge(pieces: Piece[]): Piece[] {
  const chunks: Piece[] = [];
  let current: Piece[] = [];
  let total = 0;
  for (const piece of pieces) {
    if (current.length > 0 && total + piece.tokens > CHUNK_TOKENS) {
      chunks.push(span(current, total));
      while (current.length > 0 && (total > OVERLAP_TOKENS || total + piece.tokens > CHUNK_TOKENS)) {
        total -= current.shift()!.tokens;
      }
    }
    current.push(piece);
    total += piece.tokens;
  }
  if (current.length > 0) chunks.push(span(current, total));
  return chunks;
}

function span(pieces: Piece[], tokens: number): Piece {
  return { start: pieces[0]!.start, end: pieces.at(-1)!.end, tokens };
}

// Um trecho do meio de um livro não diz de onde veio. O caminho de títulos em vigor onde ele começa
// ("Parte 1 › 7. Tratamento farmacológico › 7.2 Betabloqueadores") vai no cabeçalho do chunk e nos metadados.
type Heading = { position: number; level: number; title: string };

function findHeadings(text: string): Heading[] {
  const headings: Heading[] = [];
  for (const match of text.matchAll(/^(#{2,6}) (.+)$/gm)) {
    headings.push({ position: match.index, level: match[1]!.length, title: match[2]!.trim() });
  }
  return headings;
}

function sectionAt(headings: Heading[], position: number): string {
  const path: Heading[] = [];
  for (const heading of headings) {
    if (heading.position > position) break;
    while (path.length > 0 && path.at(-1)!.level >= heading.level) path.pop();
    path.push(heading);
  }
  return path.map((heading) => heading.title).join(" › ");
}

function chunkDocument(document: Documento): Chunk<MetadadosDocumento>[] {
  const text = document.texto;
  const headings = findHeadings(text);
  const label = document.tipo === "livro" ? "Livro" : "Artigo";
  const year = document.fonte?.ano ? ` (${document.fonte.ano})` : "";

  const chunks: Chunk<MetadadosDocumento>[] = [];
  for (const piece of splitRecursive(text, 0, text.length)) {
    // As bordas do trecho não levam espaços nem linhas em branco.
    let { start, end } = piece;
    while (start < end && /\s/.test(text[start]!)) start++;
    while (end > start && /\s/.test(text[end - 1]!)) end--;
    const passage = text.slice(start, end);

    // Um trecho só com títulos (o de uma parte, logo antes de uma subseção grande) não tem conteúdo:
    // os títulos já vão no cabeçalho dos chunks seguintes.
    if (passage.split("\n").every((line) => line.trim() === "" || HEADING.test(line))) continue;

    const section = sectionAt(headings, start);
    const header = `${label}: ${document.titulo}${year}` + (section ? `\nSeção: ${section}` : "");
    const conteudo = `${header}\n\n${passage}`;
    const indice = chunks.length;
    chunks.push({
      id: `${document.id}#${indice}`,
      documentoId: document.id,
      indice,
      conteudo,
      tokens: countTokens(conteudo),
      metadados: { tipo: document.tipo, titulo: document.titulo, arquivo: document.arquivo, secao: section, inicio: start, fim: end }
    });
  }
  return chunks;
}

// -----------------------------------------------------------------------------
// 2. Prontuários: um prontuário por chunk
// -----------------------------------------------------------------------------
// O JSON vira texto em markdown: os nomes dos campos, as chaves e as aspas não têm significado para o embedding,
// e o texto organizado é o que o modelo de linguagem vai ler na hora de responder.
const SEX: Record<string, string> = { F: "feminino", M: "masculino" };
const VISIT_TYPE: Record<string, string> = {
  consulta: "Consulta",
  retorno: "Retorno",
  teleconsulta: "Teleconsulta",
  pronto_socorro: "Pronto-socorro",
  internacao: "Internação"
};
const OUTCOME: Record<string, string> = {
  controlado: "controlado",
  melhorou: "melhorou",
  estavel: "estável",
  piorou: "piorou",
  obito: "óbito",
  abandonou: "abandonou o acompanhamento",
  transferido: "transferido"
};

// "2023-03-06" vira "06/03/2023" e "2023-03-06T18:20" vira "06/03/2023 18:20"
function formatDate(value: string): string {
  const [date, time] = value.split("T");
  const [year, month, day] = date!.split("-");
  return `${day}/${month}/${year}` + (time ? ` ${time}` : "");
}

function formatVitals(vitals: Prontuario["atendimentos"][number]["sinaisVitais"]): string {
  const parts: string[] = [];
  if (vitals.pressaoSistolica !== null && vitals.pressaoDiastolica !== null) {
    parts.push(`PA ${vitals.pressaoSistolica}x${vitals.pressaoDiastolica} mmHg`);
  }
  if (vitals.frequenciaCardiaca !== null) parts.push(`FC ${vitals.frequenciaCardiaca} bpm`);
  if (vitals.pesoKg !== null) parts.push(`peso ${vitals.pesoKg.toLocaleString("pt-BR")} kg`);
  return parts.join(", ");
}

function renderRecord(record: Prontuario): string {
  const { paciente, atendimentos, desfecho } = record;
  const lines = [
    `# Prontuário de ${paciente.nome} (paciente ${record.id})`,
    "",
    `Sexo: ${SEX[paciente.sexo]} | Nascimento: ${formatDate(paciente.dataNascimento)} | Cidade: ${paciente.cidade}/${paciente.uf} | Profissão: ${paciente.profissao}`,
    `Antecedentes: ${paciente.antecedentes}`,
    `Alergias: ${paciente.alergias}`
  ];

  atendimentos.forEach((visit, i) => {
    lines.push("", `## Atendimento ${i + 1} de ${atendimentos.length}: ${VISIT_TYPE[visit.tipo] ?? visit.tipo} em ${formatDate(visit.data)}`);
    lines.push(`Médico: ${visit.medico.nome} (${visit.medico.especialidade})`);
    lines.push(`Queixa principal: ${visit.queixaPrincipal}`);
    const vitals = formatVitals(visit.sinaisVitais);
    if (vitals) lines.push(`Sinais vitais: ${vitals}`);
    lines.push(`Evolução: ${visit.evolucao}`);
    lines.push(`Conduta: ${visit.conduta}`);
    if (visit.diagnosticos.length > 0) {
      lines.push(`Diagnósticos: ${visit.diagnosticos.map(({ cid, descricao }) => `${descricao} (CID ${cid})`).join("; ")}`);
    }
    if (visit.exames.length > 0) {
      lines.push("Exames:", ...visit.exames.map(({ nome, resultado }) => `- ${nome}: ${resultado}`));
    }
    if (visit.prescricoes.length > 0) {
      lines.push("Prescrição:", ...visit.prescricoes.map(({ medicamento, dose, posologia }) => `- ${medicamento} ${dose}, ${posologia}`));
    }
  });

  if (desfecho) {
    lines.push("", `## Desfecho em ${formatDate(desfecho.data)}: ${OUTCOME[desfecho.situacao] ?? desfecho.situacao}`, desfecho.descricao);
  }
  return lines.join("\n");
}

function chunkRecord(record: Prontuario): Chunk<MetadadosProntuario> {
  const conteudo = renderRecord(record);
  const tokens = countTokens(conteudo);
  if (tokens > MAX_TOKENS) {
    throw new Error(`Prontuário ${record.id}: ${tokens} tokens, acima do limite de ${MAX_TOKENS} do modelo de embedding.`);
  }
  const { paciente, atendimentos, desfecho } = record;
  const cids = new Set(atendimentos.flatMap((visit) => visit.diagnosticos.map((diagnosis) => diagnosis.cid)));
  return {
    id: `${record.id}#0`,
    documentoId: record.id,
    indice: 0,
    conteudo,
    tokens,
    metadados: {
      paciente: paciente.nome,
      sexo: paciente.sexo,
      dataNascimento: paciente.dataNascimento,
      cidade: paciente.cidade,
      uf: paciente.uf,
      cids: [...cids],
      atendimentos: atendimentos.length,
      primeiroAtendimento: atendimentos[0]?.data.slice(0, 10) ?? "",
      ultimoAtendimento: atendimentos.at(-1)?.data.slice(0, 10) ?? "",
      desfecho: desfecho?.situacao ?? null
    }
  };
}

// -----------------------------------------------------------------------------
// 3. Gerar os chunks e gravar
// -----------------------------------------------------------------------------
const documents = readJsonl<Documento>(DOCUMENTS_INPUT);
const records = readJsonl<Prontuario>(RECORDS_INPUT);

const documentChunks = documents.flatMap(chunkDocument);
const recordChunks = records.map(chunkRecord);

const toJsonl = (chunks: object[]) => chunks.map((chunk) => JSON.stringify(chunk)).join("\n") + "\n";
await Bun.write(join(ROOT, DOCUMENTS_OUTPUT), toJsonl(documentChunks));
await Bun.write(join(ROOT, RECORDS_OUTPUT), toJsonl(recordChunks));

// -----------------------------------------------------------------------------
// 4. Estatísticas
// -----------------------------------------------------------------------------
const format = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

function describe(chunks: Chunk<unknown>[]): string {
  const tokens = chunks.map((chunk) => chunk.tokens).sort((a, b) => a - b);
  const total = tokens.reduce((sum, value) => sum + value, 0);
  return `${format(chunks.length)} chunks | tokens: mediana ${format(tokens[Math.floor(tokens.length / 2)]!)}, maior ${format(tokens.at(-1)!)}, total ${format(total)}`;
}

console.log(`Documentos:   ${format(documents.length)} → ${describe(documentChunks)}`);
for (const type of ["artigo", "livro"]) {
  const chunks = documentChunks.filter((chunk) => chunk.metadados.tipo === type);
  console.log(`  ${type}s:${" ".repeat(10 - type.length)}${describe(chunks)}`);
}
console.log(`Prontuários:  ${format(records.length)} → ${describe(recordChunks)}`);

// Para ver como um documento ou prontuário foi quebrado: bun 02-chunking.ts artigos/09-crise-hipertensiva
const exampleId = process.argv[2];
if (exampleId) {
  for (const chunk of [...documentChunks, ...recordChunks]) {
    if (chunk.documentoId !== exampleId) continue;
    console.log(`\n--- chunk ${chunk.id} (${chunk.tokens} tokens) ---\n${chunk.conteudo}`);
  }
}

console.log(`\nGravado em ${DOCUMENTS_OUTPUT} e ${RECORDS_OUTPUT}`);
