// Busca: carrega o index.json gerado pelo index.ts e mostra os trechos mais relevantes para a consulta.
// Uso: bun search.ts "quais remédios tratam a pressão alta?"
import { join } from "node:path";
import { search } from "./bm25";
import type { Index, SearchResult } from "./types";

const INDEX_FILE = join(import.meta.dir, "index.json");

async function loadIndex(): Promise<Index> {
  const json = await Bun.file(INDEX_FILE).json();
  return { ...json, postings: new Map(Object.entries(json.postings)) };
}

function print(results: SearchResult[]): void {
  results.forEach(({ chunk, score }, position) => {
    console.log(`\n${position + 1}. [${score.toFixed(2)}] ${chunk.file} › ${chunk.heading}`);
    console.log(`   ${chunk.text.replace(/\s+/g, " ").slice(0, 200)}...`);
  });
}

const query = process.argv.slice(2).join(" ");
if (!query) {
  console.log('Uso: bun search.ts "sua pergunta"');
  process.exit(1);
}
if (!(await Bun.file(INDEX_FILE).exists())) {
  console.log("index.json não encontrado. Rode antes: bun index.ts");
  process.exit(1);
}
const results = search(await loadIndex(), query);
if (results.length === 0) console.log("Nenhum trecho encontrado.");
print(results);
