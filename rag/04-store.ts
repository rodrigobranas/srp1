// ETAPA 4 — STORAGE
// Grava os documentos e os chunks com seus embeddings no banco vetorial (PostgreSQL com pgvector, do compose.yaml)
// e cria um índice vetorial para cada fonte.
//
// Entrada: data/01-documentos.jsonl e data/01-prontuarios.jsonl  (o registro completo de cada documento)
//          data/03-documentos.jsonl e data/03-prontuarios.jsonl  (os chunks com os embeddings)
// Saída:   tabelas rag.fonte, rag.documento e rag.chunk do banco rag (a estrutura está em database/create.sql)
//
// Rodar: bun 04-store.ts   (ou bun run store). Usa o DATABASE_URL do .env.

import { SQL } from "bun";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;

type Chunk = { id: string; documentoId: string; indice: number; conteudo: string; tokens: number; metadados: object; modelo: string; embedding: number[] };
type Documento = { idOrigem: string; titulo: string; conteudo: string; metadados: object };

// Cada fonte: de onde vêm os documentos e os chunks, e como um registro da etapa 1 vira uma linha de rag.documento.
const SOURCES = [
  {
    id: "documentos",
    documents: "data/01-documentos.jsonl",
    chunks: "data/03-documentos.jsonl",
    // O texto completo é o markdown; o resto do registro (tipo, arquivo, fonte bibliográfica, sha256...) vai nos metadados.
    toDocument: ({ id, titulo, texto, ...metadados }: any, _chunks: Chunk[]): Documento => ({
      idOrigem: id,
      titulo,
      conteudo: texto,
      metadados
    })
  },
  {
    id: "prontuarios",
    documents: "data/01-prontuarios.jsonl",
    chunks: "data/03-prontuarios.jsonl",
    // O prontuário estruturado (paciente, atendimentos, desfecho) vai nos metadados: dá para ler a prescrição ou os
    // exames de um atendimento sem interpretar texto. O texto completo é o do chunk (um prontuário por chunk).
    toDocument: ({ id, ...metadados }: any, chunks: Chunk[]): Documento => ({
      idOrigem: id,
      titulo: `Prontuário de ${metadados.paciente.nome}`,
      conteudo: chunks.map((chunk) => chunk.conteudo).join("\n\n"),
      metadados
    })
  }
];

function readJsonl(file: string): any[] {
  return readFileSync(join(ROOT, file), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

// -----------------------------------------------------------------------------
// 1. Conectar e garantir a estrutura
// -----------------------------------------------------------------------------
// O banco vem do .env (DATABASE_URL): o pgvector local do compose.yaml ou um banco remoto.
const database = new SQL(process.env.DATABASE_URL!);
const start = Date.now();

// O create.sql roda sozinho só quando o volume do banco é criado. Rodá-lo de novo aqui cria o que faltar
// num volume mais antigo e não muda nada no que já existe.
await database.unsafe(readFileSync(join(ROOT, "database/create.sql"), "utf8"));

// -----------------------------------------------------------------------------
// 2. Gravar cada fonte numa transação
// -----------------------------------------------------------------------------
// Cada execução substitui todos os dados de uma fonte, e só os dela: por isso um delete com where, e não um truncate.
// Numa transação, ou a fonte entra inteira ou nada muda (e a gravação fica bem mais rápida).
for (const source of SOURCES) {
  const records = readJsonl(source.documents);
  const chunks: Chunk[] = readJsonl(source.chunks);
  const chunksByDocument = Map.groupBy(chunks, (chunk) => chunk.documentoId);
  const indexName = `chunk_${source.id}_embedding_idx`;

  await database.begin(async (transaction) => {
    // O índice vetorial é recriado depois da carga: construir de uma vez é muito mais rápido do que atualizar a cada linha.
    await transaction.unsafe(`drop index if exists rag.${indexName}`);
    // Apagar o documento apaga os chunks dele (on delete cascade)
    await transaction`delete from rag.documento where id_fonte = ${source.id}`;

    const documentIds = new Map<string, number>();
    for (const record of records) {
      const document = source.toDocument(record, chunksByDocument.get(record.id) ?? []);
      // O metadados vai como objeto: o Bun o envia como jsonb. Um JSON.stringify aqui gravaria um texto dentro do jsonb.
      const [row] = await transaction`
        insert into rag.documento (id_fonte, id_origem, titulo, conteudo, metadados)
        values (${source.id}, ${document.idOrigem}, ${document.titulo}, ${document.conteudo}, ${document.metadados})
        returning id_documento`;
      documentIds.set(document.idOrigem, row.id_documento);
    }

    for (const chunk of chunks) {
      const documentId = documentIds.get(chunk.documentoId);
      if (!documentId) throw new Error(`Chunk ${chunk.id}: o documento ${chunk.documentoId} não está em ${source.documents}`);
      // O pgvector recebe o vetor como texto no formato [0.1,0.2,...], que é exatamente o JSON de um array.
      await transaction`
        insert into rag.chunk (id_documento, id_fonte, indice, conteudo, tokens, metadados, modelo, embedding)
        values (${documentId}, ${source.id}, ${chunk.indice}, ${chunk.conteudo}, ${chunk.tokens}, ${chunk.metadados},
                ${chunk.modelo}, ${JSON.stringify(chunk.embedding)})`;
    }

    // HNSW é um índice aproximado: em vez de comparar a pergunta com todos os vetores, navega por um grafo de vizinhos.
    // Troca um pouco de precisão por muita velocidade. É parcial (where id_fonte = ...): a busca numa fonte usa o índice
    // dela, e recarregar uma fonte não mexe no índice da outra.
    await transaction.unsafe(
      `create index ${indexName} on rag.chunk using hnsw (embedding vector_cosine_ops) where id_fonte = '${source.id}'`
    );
  });

  console.log(`${source.id}: ${records.length} documentos e ${chunks.length} chunks gravados, índice rag.${indexName} criado`);
}

// -----------------------------------------------------------------------------
// 3. Resumo
// -----------------------------------------------------------------------------
// O resumo vem do banco, e não dos arquivos: é o que a busca vai encontrar.
const summary = await database`
  select f.id_fonte as fonte,
         count(distinct d.id_documento)::int as documentos,
         count(c.id_chunk)::int as chunks,
         round(avg(c.tokens))::int as tokens_por_chunk,
         min(c.modelo) as modelo
  from rag.fonte f
  left join rag.documento d on d.id_fonte = f.id_fonte
  left join rag.chunk c on c.id_documento = d.id_documento
  group by f.id_fonte
  order by f.id_fonte`;

console.log(`\nConcluído em ${((Date.now() - start) / 1000).toFixed(1)}s`);
console.table([...summary]);

await database.close();
