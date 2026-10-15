// ETAPA 1 — INGESTÃO
// Reúne as fontes do RAG em arquivos JSONL (um registro JSON por linha), prontos para a etapa de chunking:
//   - os documentos de referência (artigos e livros em markdown), com a origem e os metadados de cada um;
//   - os prontuários do banco, cada paciente com todos os atendimentos, diagnósticos, exames, prescrições e o desfecho.
//
// Entrada: docs/artigos/*.md, docs/livros/*.md e o banco prontuario (SOURCE_DATABASE_* do .env)
// Saída:   data/01-documentos.jsonl   (um documento por linha)
//          data/01-prontuarios.jsonl  (um prontuário completo por linha)
//
// Rodar (na pasta rag, com o banco no ar: docker compose up -d): bun 01-ingest.ts
// O Bun já lê o .env da pasta atual e tem um cliente PostgreSQL embutido, então o script não tem dependências.

import { SQL } from "bun";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;
// Cada pasta de docs vira um tipo de documento; o tipo fica no metadado para filtrar ou pesar a busca depois.
const COLLECTIONS = [
  { folder: "artigos", type: "artigo" },
  { folder: "livros", type: "livro" }
] as const;
// Os prontuários são buscados em lotes de pacientes, para não carregar o banco inteiro na memória de uma vez.
const BATCH_SIZE = 100;
const DOCUMENTS_OUTPUT = "data/01-documentos.jsonl";
const RECORDS_OUTPUT = "data/01-prontuarios.jsonl";

// -----------------------------------------------------------------------------
// O formato dos registros que esta etapa produz
// -----------------------------------------------------------------------------
type Fonte = {
  referencia: string; // a citação completa, em texto puro
  ano: number | null;
  doi: string | null;
  url: string | null; // texto completo na origem
  licenca: string | null;
  observacoes: string | null; // o que foi alterado na conversão para markdown
};

type Documento = {
  id: string; // caminho dentro de docs, sem extensão: estável entre execuções e legível na citação
  tipo: (typeof COLLECTIONS)[number]["type"];
  arquivo: string;
  titulo: string;
  fonte: Fonte | null;
  sha256: string; // do arquivo original: se mudar, o documento precisa ser reprocessado
  caracteres: number;
  palavras: number;
  ingeridoEm: string;
  texto: string; // o markdown sem o título e sem o bloco de fonte, que já estão nos metadados
};

type Atendimento = {
  id: number;
  data: string;
  tipo: string;
  medico: { id: number; nome: string; especialidade: string };
  queixaPrincipal: string;
  sinaisVitais: {
    pressaoSistolica: number | null;
    pressaoDiastolica: number | null;
    frequenciaCardiaca: number | null;
    pesoKg: number | null;
  };
  evolucao: string;
  conduta: string;
  diagnosticos: { cid: string; descricao: string }[];
  exames: { nome: string; resultado: string }[];
  prescricoes: { medicamento: string; dose: string; posologia: string }[];
};

type Prontuario = {
  id: string; // id_paciente
  paciente: {
    nome: string;
    sexo: string;
    dataNascimento: string;
    cidade: string;
    uf: string;
    profissao: string;
    antecedentes: string;
    alergias: string;
  };
  atendimentos: Atendimento[]; // em ordem cronológica
  desfecho: { data: string; situacao: string; descricao: string } | null;
  ingeridoEm: string;
};

const ingestedAt = new Date().toISOString();
mkdirSync(join(ROOT, "data"), { recursive: true });

// -----------------------------------------------------------------------------
// 1. Documentos: artigos e livros em markdown
// -----------------------------------------------------------------------------
// Os livros abrem com um bloco de citação logo abaixo do título (> **Fonte:** ..., > **Licença:** ...).
// Esse cabeçalho vira metadado: sai do texto que vai para o embedding e fica no registro para citar a origem na resposta.
function parseMarkdown(markdown: string) {
  const header = markdown.match(/^# (.+)\n+((?:>.*(?:\n|$))*)/);
  if (!header) return { title: null, source: null, body: markdown.trim() };
  return {
    title: header[1]!.trim(),
    source: parseSourceBlock(header[2]!),
    body: markdown.slice(header[0].length).trim()
  };
}

// Cada parágrafo do bloco é um campo "**Rótulo:** valor". Da Fonte saem também o ano, o DOI e o link do texto completo.
function parseSourceBlock(block: string): Fonte | null {
  const fields = new Map<string, string>();
  for (const paragraph of block.replace(/^> ?/gm, "").split(/\n\s*\n/)) {
    const field = paragraph.trim().match(/^\*\*(.+?):\*\*\s*([\s\S]*)$/);
    if (field) fields.set(field[1]!, field[2]!.trim());
  }
  const source = fields.get("Fonte");
  if (!source) return null;
  const license = fields.get("Licença");
  const notes = fields.get("Sobre esta versão");
  return {
    referencia: stripMarkdown(source),
    ano: Number(source.match(/\b((?:19|20)\d{2});/)?.[1]) || null, // "2018;111(3):436-539" → 2018
    doi: source.match(/DOI:\s*\[([^\]]+)\]/)?.[1] ?? null,
    url: source.match(/Texto completo:\s*<([^>]+)>/)?.[1] ?? null,
    licenca: license ? stripMarkdown(license).replace(/\.$/, "") : null,
    observacoes: notes ? stripMarkdown(notes) : null
  };
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [texto](link) vira texto
    .replace(/<(https?:\/\/[^>]+)>/g, "$1") // <https://...> vira o endereço
    .replace(/\*+([^*]+)\*+/g, "$1") // *itálico* e **negrito** viram texto puro
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

console.log("Lendo os documentos...");

const documents: Documento[] = [];
for (const { folder, type } of COLLECTIONS) {
  const files = readdirSync(join(ROOT, "docs", folder)).filter((file) => file.endsWith(".md")).sort();
  for (const file of files) {
    const markdown = readFileSync(join(ROOT, "docs", folder, file), "utf8");
    const { title, source, body } = parseMarkdown(markdown);
    documents.push({
      id: `${folder}/${file.replace(/\.md$/, "")}`,
      tipo: type,
      arquivo: `docs/${folder}/${file}`,
      titulo: title ?? file,
      fonte: source,
      sha256: createHash("sha256").update(markdown).digest("hex"),
      caracteres: body.length,
      palavras: countWords(body),
      ingeridoEm: ingestedAt,
      texto: body
    });
  }
}

writeFileSync(join(ROOT, DOCUMENTS_OUTPUT), documents.map((document) => JSON.stringify(document)).join("\n") + "\n");

// -----------------------------------------------------------------------------
// 2. Prontuários: um registro por paciente, montado a partir das tabelas do banco
// -----------------------------------------------------------------------------
// Somente leitura: o próprio PostgreSQL recusa qualquer escrita nesta conexão.
const database = new SQL({
  hostname: process.env.SOURCE_DATABASE_HOST,
  port: Number(process.env.SOURCE_DATABASE_PORT),
  database: process.env.SOURCE_DATABASE_DB,
  username: process.env.SOURCE_DATABASE_USER,
  password: process.env.SOURCE_DATABASE_PW,
  connection: { default_transaction_read_only: "on" }
});

// Agrupa as linhas de uma tabela filha pelo id do pai (ex.: diagnósticos por id_atendimento).
function groupBy(rows: any[], column: string): Map<number, any[]> {
  const groups = new Map<number, any[]>();
  for (const row of rows) {
    const id = row[column];
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id)?.push(row);
  }
  return groups;
}

writeFileSync(join(ROOT, RECORDS_OUTPUT), "");

let lastPatientId = 0;
const totals = { pacientes: 0, atendimentos: 0, diagnosticos: 0, exames: 0, prescricoes: 0 };

console.log("Buscando os prontuários...");

while (true) {
  // Datas formatadas no próprio banco: o JSON guarda exatamente o que está gravado, sem conversão de fuso horário.
  const patients = await database`
    select id_paciente, nome, sexo, to_char(data_nascimento, 'YYYY-MM-DD') as data_nascimento,
           cidade, uf, profissao, antecedentes, alergias
    from paciente
    where id_paciente > ${lastPatientId}
    order by id_paciente
    limit ${BATCH_SIZE}`;
  if (patients.length === 0) break;
  const patientIds: number[] = patients.map((patient: any) => patient.id_paciente);

  // As tabelas filhas são buscadas uma vez por lote (e não uma vez por paciente ou por atendimento) e agrupadas
  // em memória: 6 consultas por lote em vez de milhares. O peso é numeric, que chegaria como texto; vira float8.
  const visits = await database`
    select a.id_atendimento, a.id_paciente, to_char(a.data_atendimento, 'YYYY-MM-DD"T"HH24:MI') as data_atendimento,
           a.tipo, a.queixa_principal, a.pressao_sistolica, a.pressao_diastolica, a.frequencia_cardiaca,
           a.peso_kg::float8 as peso_kg, a.evolucao, a.conduta,
           m.id_medico, m.nome as nome_medico, m.especialidade
    from atendimento a
    join medico m on m.id_medico = a.id_medico
    where a.id_paciente in ${database(patientIds)}
    order by a.id_paciente, a.data_atendimento, a.id_atendimento`;
  const diagnoses = await database`
    select d.id_atendimento, d.cid, d.descricao
    from diagnostico d
    join atendimento a on a.id_atendimento = d.id_atendimento
    where a.id_paciente in ${database(patientIds)}
    order by d.id_diagnostico`;
  const exams = await database`
    select e.id_atendimento, e.nome, e.resultado
    from exame e
    join atendimento a on a.id_atendimento = e.id_atendimento
    where a.id_paciente in ${database(patientIds)}
    order by e.id_exame`;
  const prescriptions = await database`
    select p.id_atendimento, p.medicamento, p.dose, p.posologia
    from prescricao p
    join atendimento a on a.id_atendimento = p.id_atendimento
    where a.id_paciente in ${database(patientIds)}
    order by p.id_prescricao`;
  const outcomes = await database`
    select id_paciente, to_char(data_desfecho, 'YYYY-MM-DD') as data_desfecho, situacao, descricao
    from desfecho
    where id_paciente in ${database(patientIds)}`;

  const visitsByPatient = groupBy(visits, "id_paciente");
  const diagnosesByVisit = groupBy(diagnoses, "id_atendimento");
  const examsByVisit = groupBy(exams, "id_atendimento");
  const prescriptionsByVisit = groupBy(prescriptions, "id_atendimento");
  const outcomeByPatient = new Map<number, any>(outcomes.map((outcome: any) => [outcome.id_paciente, outcome]));

  let output = "";
  for (const patient of patients) {
    const outcome = outcomeByPatient.get(patient.id_paciente);
    const record: Prontuario = {
      id: String(patient.id_paciente),
      paciente: {
        nome: patient.nome,
        sexo: patient.sexo,
        dataNascimento: patient.data_nascimento,
        cidade: patient.cidade,
        uf: patient.uf,
        profissao: patient.profissao,
        antecedentes: patient.antecedentes,
        alergias: patient.alergias
      },
      atendimentos: (visitsByPatient.get(patient.id_paciente) ?? []).map((visit): Atendimento => ({
        id: visit.id_atendimento,
        data: visit.data_atendimento,
        tipo: visit.tipo,
        medico: { id: visit.id_medico, nome: visit.nome_medico, especialidade: visit.especialidade },
        queixaPrincipal: visit.queixa_principal,
        sinaisVitais: {
          pressaoSistolica: visit.pressao_sistolica,
          pressaoDiastolica: visit.pressao_diastolica,
          frequenciaCardiaca: visit.frequencia_cardiaca,
          pesoKg: visit.peso_kg
        },
        evolucao: visit.evolucao,
        conduta: visit.conduta,
        diagnosticos: (diagnosesByVisit.get(visit.id_atendimento) ?? []).map(({ cid, descricao }) => ({ cid, descricao })),
        exames: (examsByVisit.get(visit.id_atendimento) ?? []).map(({ nome, resultado }) => ({ nome, resultado })),
        prescricoes: (prescriptionsByVisit.get(visit.id_atendimento) ?? []).map(({ medicamento, dose, posologia }) => ({
          medicamento,
          dose,
          posologia
        }))
      })),
      desfecho: outcome ? { data: outcome.data_desfecho, situacao: outcome.situacao, descricao: outcome.descricao } : null,
      ingeridoEm: ingestedAt
    };
    output += JSON.stringify(record) + "\n";
  }
  appendFileSync(join(ROOT, RECORDS_OUTPUT), output);

  totals.pacientes += patients.length;
  totals.atendimentos += visits.length;
  totals.diagnosticos += diagnoses.length;
  totals.exames += exams.length;
  totals.prescricoes += prescriptions.length;
  lastPatientId = patientIds.at(-1)!;
  process.stdout.write(`\r  ${totals.pacientes.toLocaleString("pt-BR")} prontuários`);
}

await database.close();

const format = (value: number) => value.toLocaleString("pt-BR");
const countByType = (type: string) => documents.filter((document) => document.tipo === type).length;
const documentChars = documents.reduce((sum, document) => sum + document.caracteres, 0);
console.log(`

Documentos:    ${format(documents.length)} (${countByType("artigo")} artigos, ${countByType("livro")} livros), ${format(documentChars)} caracteres
Prontuários:   ${format(totals.pacientes)} pacientes
Atendimentos:  ${format(totals.atendimentos)}
Diagnósticos:  ${format(totals.diagnosticos)}
Exames:        ${format(totals.exames)}
Prescrições:   ${format(totals.prescricoes)}

Gravado em ${DOCUMENTS_OUTPUT} e ${RECORDS_OUTPUT}`);
