import { tokenize } from "./tokenizer";
import type { Index, Posting, SearchResult } from "./types";

// k1 controla a saturação: a partir de certo ponto, repetir o termo no trecho quase não aumenta o score.
// b controla a normalização pelo tamanho: 0 ignora o tamanho do trecho, 1 penaliza totalmente trechos longos.
const K1 = 1.2;
const B = 0.75;

// IDF: termos raros (aparecem em poucos trechos) pesam mais do que termos comuns.
function idf(index: Index, df: number): number {
  return Math.log(1 + (index.totalChunks - df + 0.5) / (df + 0.5));
}

// TF saturado e normalizado pelo tamanho do trecho em relação à média.
function tf(index: Index, posting: Posting): number {
  const length = index.chunks[posting.chunk]?.length ?? index.averageLength;
  const normalization = K1 * (1 - B + B * (length / index.averageLength));
  return (posting.tf * (K1 + 1)) / (posting.tf + normalization);
}

// score(trecho, consulta) = soma, para cada termo da consulta, de IDF(termo) * TF(termo, trecho).
// Só os trechos que têm pelo menos um termo da consulta são pontuados, graças ao índice invertido.
export function search(index: Index, query: string, topK = 5): SearchResult[] {
  const scores = new Map<number, number>();
  for (const term of new Set(tokenize(query))) {
    const postings = index.postings.get(term) ?? [];
    const termIdf = idf(index, postings.length);
    for (const posting of postings) {
      scores.set(posting.chunk, (scores.get(posting.chunk) ?? 0) + termIdf * tf(index, posting));
    }
  }
  return [...scores]
    .sort(([, a], [, b]) => b - a)
    .slice(0, topK)
    .flatMap(([id, score]) => (index.chunks[id] ? [{ chunk: index.chunks[id], score }] : []));
}
