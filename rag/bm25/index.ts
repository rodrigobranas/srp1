// Indexação: lê os arquivos de docs (incluindo subpastas), divide em trechos por título (chunker.ts) e monta o índice invertido em index.json.
// Uso: bun index.ts
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { splitIntoSections } from "./chunker";
import { tokenize } from "./tokenizer";
import type { Chunk, Posting, Section } from "./types";

const DOCS_DIR = join(import.meta.dir, "..", "docs");
const INDEX_FILE = join(import.meta.dir, "index.json");

async function readSections(): Promise<Section[]> {
  // Recursivo: os arquivos ficam em subpastas (artigos, livros) e o caminho relativo vira o file do trecho.
  const files = (await readdir(DOCS_DIR, { recursive: true })).filter((file) => file.endsWith(".md")).sort();
  const sections = await Promise.all(files.map(async (file) => {
    return splitIntoSections(file, await Bun.file(join(DOCS_DIR, file)).text());
  }));
  return sections.flat();
}

function countTerms(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  return counts;
}

// O título do artigo e o da seção entram no texto indexado, para que o trecho carregue o seu contexto.
function buildIndex(sections: Section[]) {
  const postings = new Map<string, Posting[]>();
  const chunks = sections.map((section, id): Chunk => {
    const tokens = tokenize(`${section.title} ${section.heading} ${section.text}`);
    for (const [term, tf] of countTerms(tokens)) {
      if (!postings.has(term)) postings.set(term, []);
      postings.get(term)?.push({ chunk: id, tf });
    }
    return { id, ...section, length: tokens.length };
  });
  const averageLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0) / chunks.length;
  return { totalChunks: chunks.length, averageLength, chunks, postings: Object.fromEntries(postings) };
}

const index = buildIndex(await readSections());
await Bun.write(INDEX_FILE, JSON.stringify(index, null, 2));
console.log(`${index.totalChunks} trechos e ${Object.keys(index.postings).length} termos indexados em ${INDEX_FILE}`);
