-- pgvector adiciona ao PostgreSQL o tipo "vector" e os operadores de distância:
--   <=>  distância de cosseno (a que usamos: compara a direção dos vetores)
--   <->  distância euclidiana (L2)
--   <#>  produto interno negativo
create extension if not exists vector;

-- A estrutura do banco vetorial. Roda sozinha na criação do volume e também no começo da etapa 4 (04-store.ts):
-- tudo aqui pode rodar de novo sem mudar nada do que já existe.
create schema if not exists rag;

-- Fonte: de onde vêm os documentos. Cada fonte tem a sua estratégia de chunking e o seu índice vetorial.
create table if not exists rag.fonte (
  id_fonte text primary key,
  descricao text not null
);

insert into rag.fonte (id_fonte, descricao) values
  ('documentos', 'Artigos e livros de referência (docs/artigos e docs/livros), divididos de forma recursiva'),
  ('prontuarios', 'Prontuários fictícios do banco prontuario, um prontuário por chunk')
on conflict (id_fonte) do update set descricao = excluded.descricao;

-- Documento: a unidade de origem, inteira. A partir de um chunk encontrado, dá para recuperar o documento completo.
--   id_origem   o id na etapa 1: o caminho do arquivo (artigos/09-crise-hipertensiva) ou o id_paciente (42)
--   conteudo    o texto completo: o markdown do artigo ou livro, o prontuário em texto
--   metadados   o resto do registro da etapa 1: no documento, tipo, arquivo, fonte bibliográfica e sha256;
--               no prontuário, o prontuário estruturado (paciente, atendimentos, desfecho)
create table if not exists rag.documento (
  id_documento serial primary key,
  id_fonte text not null references rag.fonte (id_fonte),
  id_origem text not null,
  titulo text not null,
  conteudo text not null,
  metadados jsonb not null default '{}',
  unique (id_fonte, id_origem),
  -- Alvo da chave estrangeira do chunk, que garante que o chunk tem a mesma fonte do seu documento
  unique (id_documento, id_fonte)
);

-- Chunk: o pedaço do documento que vira um embedding e é devolvido pela busca.
-- A fonte se repete aqui porque cada fonte tem o seu índice vetorial, um índice parcial (where id_fonte = ...),
-- e um índice só enxerga as colunas da própria tabela.
--   metadados   o que é do chunk: no documento, a seção e a posição do trecho; no prontuário, os campos para filtrar
--               a busca (sexo, cidade, CIDs, desfecho...)
--   modelo      o modelo que gerou o embedding: a pergunta precisa ser embedada com o mesmo
--   embedding   vector(1536) é a dimensão do openai/text-embedding-3-small; outro modelo exige outra dimensão
create table if not exists rag.chunk (
  id_chunk serial primary key,
  id_documento integer not null,
  id_fonte text not null,
  indice integer not null,
  conteudo text not null,
  tokens integer not null,
  metadados jsonb not null default '{}',
  modelo text not null,
  embedding vector(1536) not null,
  -- Também serve de índice para o on delete cascade: apagar um documento acha os chunks dele sem percorrer a tabela
  unique (id_documento, indice),
  foreign key (id_documento, id_fonte) references rag.documento (id_documento, id_fonte) on delete cascade
);

-- Os índices vetoriais (HNSW), um por fonte, são criados pela etapa 4 depois da carga, que é bem mais rápido:
-- rag.chunk_documentos_embedding_idx e rag.chunk_prontuarios_embedding_idx.

-- Quando a busca tiver filtro (por exemplo, prontuários com um CID): o HNSW traz um número fixo de candidatos
-- (hnsw.ef_search, 40 por padrão) e só depois aplica o WHERE, o que poderia devolver menos linhas que o LIMIT.
-- O iterative scan (pgvector 0.8+) continua percorrendo o índice até completar o LIMIT.
alter database rag set hnsw.iterative_scan = strict_order;
