// Um trecho é a unidade de busca: uma seção (##) de um artigo da pasta docs.
export type Chunk = {
  id: number;
  file: string;
  title: string;
  heading: string;
  text: string;
  length: number;
};

export type Section = Omit<Chunk, "id" | "length">;

// Uma ocorrência de um termo num trecho: em qual trecho e quantas vezes (tf, term frequency).
export type Posting = {
  chunk: number;
  tf: number;
};

// O índice invertido: para cada termo, a lista de trechos onde ele aparece.
// O tamanho dessa lista é o df (document frequency) do termo, usado no cálculo do IDF.
export type Index = {
  totalChunks: number;
  averageLength: number;
  chunks: Chunk[];
  postings: Map<string, Posting[]>;
};

export type SearchResult = {
  chunk: Chunk;
  score: number;
};
