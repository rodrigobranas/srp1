// ETAPA 3 — EMBEDDING
// Transforma o texto de cada chunk num vetor: uma lista de números que representa o significado do texto.
// Textos com significados parecidos geram vetores próximos, e é isso que permite buscar por significado.
//
// Entrada: data/02-documentos.jsonl e data/02-prontuarios.jsonl
// Saída:   data/03-documentos.jsonl e data/03-prontuarios.jsonl (os mesmos chunks, agora com o campo embedding)
//
// Rodar: bun 03-embedding.ts   (ou bun run embed). Usa a OPENROUTER_KEY do .env, que o Bun carrega sozinho.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;
// A busca precisa usar o mesmo modelo: vetores de modelos diferentes não são comparáveis.
// text-embedding-3-small: 1.536 dimensões, até 8.191 tokens por texto, US$ 0,02 por milhão de tokens.
const MODEL = "openai/text-embedding-3-small";
// Vários textos por requisição (lote) e alguns lotes ao mesmo tempo: bem mais rápido do que um chunk por vez.
// O lote também tem um limite de tokens: a OpenAI aceita no máximo 300 mil tokens somando os textos de uma requisição,
// e um lote de 100 prontuários chegaria perto de 180 mil. A contagem vem do campo tokens da etapa 2 (mesmo tokenizador).
const BATCH_SIZE = 100;
const BATCH_TOKENS = 100_000;
const CONCURRENCY = 4;
const ATTEMPTS = 3;
const SOURCES = [
  { name: "Documentos", input: "data/02-documentos.jsonl", output: "data/03-documentos.jsonl" },
  { name: "Prontuários", input: "data/02-prontuarios.jsonl", output: "data/03-prontuarios.jsonl" }
];

// Só estes campos são usados aqui; os demais (documentoId, metadados...) seguem para a saída sem alteração.
type Chunk = { id: string; conteudo: string; tokens: number };
type EmbeddingResponse = {
  data: { index: number; embedding: number[] }[];
  usage: { total_tokens: number; cost: number };
};

const apiKey = process.env.OPENROUTER_KEY;
if (!apiKey) throw new Error("OPENROUTER_KEY não encontrada: confira o .env na pasta rag");

// -----------------------------------------------------------------------------
// 1. Separar os chunks em lotes
// -----------------------------------------------------------------------------
function toBatches(chunks: Chunk[]): Chunk[][] {
  const batches: Chunk[][] = [];
  let tokens = 0;
  for (const chunk of chunks) {
    const batch = batches.at(-1);
    if (!batch || batch.length === BATCH_SIZE || tokens + chunk.tokens > BATCH_TOKENS) {
      batches.push([chunk]);
      tokens = chunk.tokens;
    } else {
      batch.push(chunk);
      tokens += chunk.tokens;
    }
  }
  return batches;
}

// -----------------------------------------------------------------------------
// 2. Gerar os embeddings de um lote
// -----------------------------------------------------------------------------
async function embed(texts: string[]): Promise<EmbeddingResponse> {
  // Erros passageiros (limite de requisições, instabilidade do provedor) acontecem: tenta algumas vezes.
  for (let attempt = 1; ; attempt++) {
    let problem: string;
    try {
      const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, input: texts })
      });
      const text = await response.text();
      // O OpenRouter pode responder 200 com um erro no corpo (quando o provedor falha):
      // a resposta só vale se trouxer um vetor para cada texto enviado.
      const body = response.ok ? JSON.parse(text) : null;
      if (body?.data?.length === texts.length) return body;
      problem = `OpenRouter respondeu ${response.status}: ${text.slice(0, 300)}`;
    } catch (error) {
      problem = `falha na requisição: ${(error as Error).message}`;
    }
    if (attempt === ATTEMPTS) throw new Error(problem);
    console.log(`\n  tentativa ${attempt} falhou (${problem}); tentando de novo...`);
    await Bun.sleep(attempt * 5000);
  }
}

// -----------------------------------------------------------------------------
// 3. Processar os lotes de uma fonte com alguns "trabalhadores" em paralelo
// -----------------------------------------------------------------------------
async function embedSource(source: (typeof SOURCES)[number]) {
  const chunks: Chunk[] = readFileSync(join(ROOT, source.input), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const batches = toBatches(chunks);

  // Cada lote guarda as suas linhas na própria posição: os lotes terminam fora de ordem,
  // mas o arquivo de saída fica na mesma ordem da entrada.
  const lines: string[] = new Array(batches.length);
  const summary = { chunks: chunks.length, tokens: 0, cost: 0, dimensions: 0, sample: [] as number[] };
  let next = 0;
  let done = 0;

  async function worker() {
    while (next < batches.length) {
      const position = next++;
      const batch = batches[position]!;
      const response = await embed(batch.map((chunk) => chunk.conteudo));

      // A resposta traz um vetor para cada texto enviado; o campo index diz a qual texto do lote ele pertence.
      const output: string[] = new Array(batch.length);
      for (const item of response.data) {
        output[item.index] = JSON.stringify({ ...batch[item.index], modelo: MODEL, embedding: item.embedding });
        if (summary.sample.length === 0) summary.sample = item.embedding;
      }
      lines[position] = output.join("\n") + "\n";

      done += batch.length;
      summary.tokens += response.usage.total_tokens;
      summary.cost += response.usage.cost;
      process.stdout.write(`\r  ${source.name}: ${done}/${chunks.length} chunks`);
    }
  }

  console.log(`${source.name}: ${chunks.length} chunks em ${batches.length} lotes`);
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await Bun.write(join(ROOT, source.output), lines.join(""));
  console.log();

  summary.dimensions = summary.sample.length;
  return summary;
}

console.log(`Gerando embeddings com ${MODEL}...\n`);
const summaries = [];
for (const source of SOURCES) {
  summaries.push({ source, ...(await embedSource(source)) });
}

// -----------------------------------------------------------------------------
// 4. Resumo
// -----------------------------------------------------------------------------
const format = (value: number) => value.toLocaleString("pt-BR");
console.log();
for (const { source, chunks, tokens, cost } of summaries) {
  console.log(`${source.name.padEnd(12)} ${format(chunks)} chunks | ${format(tokens)} tokens | US$ ${cost.toFixed(4)} → ${source.output}`);
}
const totalCost = summaries.reduce((sum, summary) => sum + summary.cost, 0);
const sample = summaries[0]!.sample.slice(0, 6).map((value) => value.toFixed(4));
console.log(`
Custo total:  US$ ${totalCost.toFixed(4)}
Dimensões:    ${summaries[0]!.dimensions} números por chunk

Um embedding começa assim:
  [${sample.join(", ")}, ...]`);
