# LLM Wiki em Open Knowledge Format

Este diretório combina o padrão LLM Wiki descrito por Andrej Karpathy com a
especificação Open Knowledge Format (OKF) v0.2:

- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md

## Ideia central

Mantenha uma wiki persistente em Markdown entre o usuário e suas fontes. Em vez
de reconstruir o conhecimento a partir dos documentos brutos a cada pergunta,
leia as fontes, extraia o que importa e integre esse conteúdo à wiki existente.

A wiki deve acumular valor: novas fontes e novas perguntas podem atualizar
páginas, conexões, comparações e sínteses já existentes.

O usuário seleciona fontes, explora o conteúdo e faz perguntas. O agente mantém
a wiki: resume, organiza, cria relações, atualiza páginas e cuida da
consistência.

## Escopo: conhecimento de produto de software

Esta wiki organiza o conhecimento sobre produtos de software: para quem o
produto existe, quais capacidades oferece, quais conceitos e dados manipula,
quais regras governam seu comportamento e quais limites precisa respeitar. Use
as fontes para construir um modelo conectado do produto, em vez de manter
apenas resumos de documentos.

Um PRD (Product Requirements Document, ou documento de requisitos do produto)
é uma fonte importante sobre a intenção e os requisitos do produto. Ele não
comprova, por si só, que uma funcionalidade já foi implementada ou que o
software em produção se comporta daquela forma. Mantenha clara a diferença
entre o que o PRD especifica, o que outra fonte confirma sobre a implementação
e o que ainda precisa ser validado.

Ao organizar afirmações sobre o produto:

- Preserve o significado e, quando existirem, os identificadores dos
  requisitos, entidades e regras da fonte.
- Diferencie o que está explicitamente especificado do que foi inferido pelo
  agente. Identifique inferências e perguntas em aberto; não as registre como
  decisões ou requisitos confirmados.
- Não resolva silenciosamente ambiguidades, lacunas ou conflitos entre PRDs,
  versões ou outras fontes. Registre as evidências e o contexto de cada versão;
  peça esclarecimento quando a resolução mudar o entendimento do produto.
- Relacione capacidades, entidades, regras, restrições, papéis e fluxos para
  mostrar como cada parte do produto afeta as demais.
- Não invente detalhes de implementação, telas, APIs ou comportamento que as
  fontes não sustentem.

## Arquitetura

### `raw/`

Coleção curada de documentos-fonte do produto, como PRDs, pesquisas,
especificações, decisões de produto e técnicas, documentação de APIs, notas de
versão, imagens e arquivos de dados.

- É a fonte de verdade.
- O agente pode ler seus arquivos, mas nunca deve modificá-los.
- Não faz parte do bundle OKF e, por isso, seus arquivos não precisam seguir o
  formato de documentos de conceito.

### `wiki/`

Bundle de conhecimento OKF v0.2 e diretório de arquivos Markdown gerados e
mantidos pelo agente. Pode conter resumos, páginas de entidades, páginas de
conceitos, comparações, panoramas e sínteses.

- O agente cria e atualiza as páginas.
- O agente mantém referências cruzadas e consistência entre elas.
- O usuário e qualquer consumidor compatível com OKF consultam o resultado.
- A raiz do bundle é `wiki/`; links iniciados por `/` são relativos a ela.

### `wiki/output/`

Área exclusiva para artefatos gerados como resultado de consultas ou operações
da wiki. Use-a para imagens, landing pages, HTML, CSS, JavaScript, gráficos,
apresentações, canvases, PDFs, planilhas, exports e outros arquivos que não
sejam documentos de conceito indexados pelo OKF.

- Todo artefato gerado deve ficar dentro de uma pasta própria de operação em
  `wiki/output/`, com o formato `YYYY-MM-DD-<slug>/`. O prefixo deve ser a data
  ISO 8601 da operação (`YYYY-MM-DD`) e `<slug>` deve ser descritivo em
  `kebab-case`, por exemplo `wiki/output/2026-08-03-landing-page-nexoerp/`.
- Nunca crie artefatos diretamente na raiz de `wiki/output/`; a única exceção
  é o eventual `wiki/output/index.md`. Arquivos auxiliares que pertencem ao
  mesmo resultado, como HTML e CSS, devem permanecer juntos na mesma pasta.
- Não misture resultados de operações distintas na mesma pasta. Se uma nova
  operação produzir uma variação, use uma nova pasta com a data da operação e
  um slug adequado.
- Arquivos em `wiki/output/` não representam conceitos, não precisam de
  frontmatter YAML e não entram no `wiki/index.md` como páginas da wiki.
- Um `wiki/output/index.md` pode existir apenas como inventário operacional dos
  artefatos, sem frontmatter de conceito. Ele deve apontar para os arquivos nas
  pastas datadas, não para caminhos antigos ou arquivos soltos. Não é um índice
  OKF e não deve ser usado para transformar os arquivos listados em conceitos.
- Quando um artefato tiver valor durável, registre a operação em `wiki/log.md`
  e, se necessário, crie separadamente um documento de conceito que explique
  o conhecimento. O artefato continua em sua pasta datada dentro de
  `wiki/output/`.
- Não confunda `wiki/output/` com `raw/`: output contém derivados gerados pelo
  agente; raw contém fontes preservadas e nunca modificadas.

### `AGENTS.md`

Schema operacional usado pelo Codex. Define a estrutura, as convenções e os
fluxos seguidos pelo agente. Pode evoluir com o uso, em colaboração com o
usuário. Não faz parte do bundle OKF.

## Documentos de conceito OKF

Todo arquivo `.md` dentro de `wiki/`, exceto os nomes reservados `index.md` e
`log.md` e todo o conteúdo de `wiki/output/`, representa exatamente um
conceito. O caminho sem a extensão `.md` é o identificador estável desse
conceito. Prefira nomes de arquivo descritivos em `kebab-case` e não altere
caminhos sem atualizar os links de entrada.

O LINT considera como conjunto de conceitos os arquivos Markdown fora de
`wiki/output/`. O conteúdo de `wiki/output/`, inclusive seu eventual
`index.md`, fica fora da validação de frontmatter, órfãos, entradas de índice e
conformidade de documentos OKF.

Cada documento de conceito deve ser UTF-8 e começar com frontmatter YAML:

```markdown
---
type: Concept
title: Nome legível do conceito
description: Resumo do conceito em uma frase.
resource: https://example.com/recurso-canonico
tags: [tema, contexto]
generated:
  by: human:usuario
  at: 2026-07-23T12:00:00-03:00
sources:
  - id: fonte-principal
    resource: https://example.com/fonte
    title: Fonte principal
---

# Visão geral

Conteúdo estruturado e conectado a [outro conceito](/conceitos/outro.md),
conforme a [fonte principal][^fonte-principal].

[^fonte-principal]: Fonte principal

```

Regras do frontmatter:

- `type` é obrigatório, deve ser uma string curta, não vazia e autoexplicativa.
- `title`, `description`, `resource` e `tags` são recomendados quando seus
  valores forem conhecidos.
- `generated` é recomendado para registrar como o conteúdo atual foi produzido
  e quando ocorreu sua última alteração significativa.
- `verified`, `status` e `stale_after` são opcionais e devem ser usados quando
  houver confirmação, necessidade de ciclo de vida ou política de atualização.
- `sources` é recomendado quando o conceito deriva de fontes identificáveis.
- `description` deve conter uma única frase útil para índices e busca.
- `resource` identifica o recurso canônico descrito pela página; omita-o em
  conceitos abstratos sem recurso correspondente.
- `tags` deve ser uma lista YAML de strings curtas.
- `generated.by` deve seguir a convenção de atores: `<producer>/<version>` para
  agentes e ferramentas, `human:<id>` para pessoas e `process:<id>` para
  processos automatizados.
- `generated.at` e `verified[].at` devem usar data e hora ISO 8601.
- `verified` é uma lista de eventos de verificação, cada um com `by` e `at`.
  Um único evento também pode ser escrito como um mapeamento sem lista.
- `status` aceita `draft`, `stable` ou `deprecated`; quando ausente, o
  conceito é considerado `stable`.
- `stale_after` é uma data absoluta no formato `YYYY-MM-DD`; o conceito fica
  obsoleto quando a data atual for igual ou posterior a ela.
- Campos adicionais são permitidos quando o domínio justificar. Preserve
  campos desconhecidos ao editar uma página.
- Não invente metadados ausentes apenas para preencher o frontmatter.

Não existe uma taxonomia universal de tipos. Use poucos valores consistentes e
autoexplicativos, como `Source Summary`, `Entity`, `Concept`, `Comparison`,
`Synthesis`, `Playbook`, `Attested Computation` ou tipos específicos do domínio.
Para conhecimento de produto, tipos como `Product Capability`, `Product
Requirement`, `Business Rule`, `Domain Entity`, `Role`, `Constraint`,
`Workflow` e `Integration` podem ser usados quando ajudarem a distinguir os
conceitos. Prefira um tipo consistente já usado na wiki antes de criar outro.

### Proveniência e confiança

Quando um conceito for derivado de material externo ou de outro conceito, use
`sources` no frontmatter:

~~~yaml
sources:
  - id: fonte-principal
    resource: https://example.com/fonte
    title: Fonte principal
    author: human:autor
    usage_count: 42
    last_modified: 2026-07-23
usage_window:
  from: 2026-07-01
  to: 2026-07-31
~~~

Cada entrada de `sources` deve ter `resource`. `id`, `title`, `author`,
`usage_count` e `last_modified` são opcionais. `usage_window` é irmão de
`sources` e contextualiza os valores de `usage_count`; uma fonte pode
sobrescrevê-lo localmente.

Para atribuir uma afirmação específica a uma fonte, use uma nota de rodapé
com o mesmo identificador de `sources[].id`:

```markdown
O processamento ocorre diariamente.[^fonte-principal]

[^fonte-principal]: Fonte principal
```

Não use uma lista genérica `# Citations` como convenção primária. Ela pode ser
interpretada como legado de OKF v0.1, mas novos documentos devem preferir
`sources` e notas de rodapé por afirmação.

## Corpo, links e citações

- Use Markdown estrutural: títulos, listas, tabelas e blocos de código.
- Prefira links absolutos relativos ao bundle, como
  `[Conceito](/conceitos/conceito.md)`. Links relativos também são válidos.
- Explique a relação no texto ao redor do link; o link, sozinho, não tipa a
  relação.
- Links quebrados são tolerados pelo OKF, mas devem ser reportados no `LINT` e
  corrigidos quando não representarem conhecimento ainda pendente.
- Afirmações vindas de material externo devem apontar para uma entrada em
  `sources`; quando a atribuição for por afirmação, use uma nota de rodapé
  cujo rótulo corresponda a `sources[].id`.
- Ao citar um arquivo local de `raw/`, use um link Markdown relativo ao arquivo.
  Ao citar uma fonte web, prefira a URL canônica.
- `# Schema`, `# Examples` e `# Computation` têm significado convencional no
  OKF e devem ser usados quando forem adequados ao conceito.

## Computações atestadas

Quando um conceito precisar declarar uma forma sancionada de calcular um valor,
use `type: Attested Computation`. O frontmatter pode incluir `runtime`,
`parameters`, `computation`, `executor` e `attester`; o corpo deve usar a seção
`# Computation` para registrar a definição executável. O OKF descreve a
computação e como verificá-la, mas não executa o código nem define seu pacote ou
ambiente de execução.

Exemplo mínimo:

~~~yaml
---
type: Attested Computation
title: Receita anual
runtime: bigquery
parameters:
  - name: year
    type: integer
    required: true
executor:
  resource: /skills/run-query.md
  receipt: [job_id, executed_sql, result]
attester:
  resource: /attesters/sql-equality.py
generated:
  by: human:usuario
  at: 2026-08-03T12:00:00-03:00
---

# Computation

```sql
SELECT SUM(amount) AS revenue
FROM finance.recognized_revenue
WHERE fiscal_year = @year
```
~~~

## Operações

### INGEST

Ao processar uma nova fonte adicionada a `raw/`:

#### PRDs e documentos de requisitos

Além do fluxo comum abaixo, ao ingerir um PRD:

1. Identifique o produto e, se a fonte informar, o nome do documento, versão,
   status, data e responsável. Não deduza que uma versão é a vigente apenas
   por ser a mais recente; use o status ou a orientação registrada nas fontes.
2. Extraia os conceitos de produto que a fonte define ou altera, considerando:
   capacidades e funcionalidades; requisitos e critérios de aceite; entidades
   e seus atributos ou relações; regras de negócio, condições e exceções;
   restrições de escopo, técnicas, operacionais, legais ou não funcionais;
   papéis, atores, responsabilidades e permissões; fluxos, estados e transições;
   integrações, eventos e dados relevantes.
3. Preserve IDs e termos do PRD. Agrupe requisitos por capacidade ou assunto
   quando forem partes de uma mesma funcionalidade; crie uma página própria
   para um requisito apenas quando ele tiver valor durável e puder ser
   descoberto ou relacionado independentemente.
4. Crie ou atualize um resumo do PRD quando ele tiver valor como registro da
   fonte. Atualize páginas de conceitos já existentes para integrar mudanças,
   sem perder o histórico de versões ou a proveniência de afirmações anteriores.
5. Cite a fonte e, quando possível, a seção, página ou ID do requisito. Indique
   claramente requisitos explícitos, inferências, ambiguidades e conflitos.
   Registre perguntas em aberto sem convertê-las em comportamento definido.
6. Faça as relações explícitas no texto: por exemplo, qual regra governa uma
   entidade, qual papel executa uma etapa de um fluxo, qual capacidade atende
   um requisito ou qual restrição limita uma funcionalidade.
7. Verifique se requisitos importantes têm relações com os conceitos afetados
   e se mudanças ou requisitos conflitantes afetam páginas existentes. Atualize
   os índices e o log conforme o fluxo comum de ingestão.

Use tipos como `Source Summary`, `Product Requirement`, `Product Capability`,
`Business Rule`, `Domain Entity`, `Role`, `Constraint`, `Workflow` e
`Integration` conforme o conteúdo. A taxonomia deve permanecer pequena e
consistente; não crie uma página para cada frase do PRD.

#### Fluxo comum de ingestão

1. Leia a fonte sem modificá-la.
2. Discuta com o usuário os principais pontos extraídos.
3. Crie ou atualize os documentos de conceito afetados, incluindo um resumo da
   fonte quando ele tiver valor próprio.
4. Preencha o frontmatter OKF de todo documento criado e atualize
   `generated.at` apenas nas alterações significativas. Preserve `generated.by`
   quando a origem do conteúdo não mudar.
5. Adicione links entre os conceitos relacionados e citações às fontes.
6. Atualize `wiki/index.md` e os índices de subdiretórios afetados, se existirem.
7. Atualize outras páginas de entidades, conceitos e sínteses afetadas.
8. Se a operação produzir imagens, páginas HTML/CSS, gráficos ou qualquer
   outro artefato, salve-o em uma pasta nova no formato
   `wiki/output/YYYY-MM-DD-<slug>/`. Mantenha nessa pasta todos os arquivos
   auxiliares do resultado. Não crie esses arquivos diretamente em
   `wiki/output/`, em `wiki/`, em `wiki/conceitos/` ou na raiz do projeto.
9. Registre a operação em `wiki/log.md`.

Uma fonte pode afetar muitas páginas. O fluxo pode processar uma fonte por vez
com acompanhamento do usuário ou várias fontes em lote, conforme a preferência
registrada neste schema.

### QUERY

Ao receber uma pergunta sobre a wiki:

1. Leia `wiki/index.md` para localizar as páginas relevantes.
2. Navegue pelos índices de subdiretórios e links antes de fazer uma busca mais
   ampla.
3. Pesquise e leia os documentos de conceito relevantes.
4. Sintetize uma resposta com citações.
5. Produza o formato adequado à pergunta. Se o resultado for um artefato —
   como uma imagem, landing page, HTML/CSS, apresentação, gráfico ou canvas —
   salve-o em uma pasta nova no formato `wiki/output/YYYY-MM-DD-<slug>/`;
   não o trate como documento de conceito.
6. Quando uma resposta, comparação, análise ou conexão tiver valor durável,
   incorpore o conhecimento à wiki como um documento de conceito OKF e atualize
   o índice e o log. Se houver um artefato associado, mantenha-o em sua pasta
   datada dentro de `wiki/output/` e registre o caminho completo no log ou no
   documento de conceito quando isso ajudar na descoberta.

Consultas úteis também devem contribuir para o acúmulo de conhecimento, em vez
de permanecer apenas no histórico da conversa.

### LINT

Periodicamente, faça uma revisão de saúde e conformidade da wiki. Verifique:

- se todo documento de conceito fora de `wiki/output/` tem frontmatter YAML
  parseável e `type` não vazio;
- se `index.md` e `log.md` são usados somente com seus significados reservados;
- se `generated.at` e `verified[].at` são ISO 8601 e os metadados conhecidos
  estão consistentes;
- se `generated`, `verified`, `status`, `stale_after` e `sources` seguem suas
  convenções quando presentes;
- se atores usam os prefixos `human:`, `process:` ou `<producer>/<version>`;
- se notas de rodapé de atribuição resolvem para um `sources[].id`;
- contradições entre páginas;
- afirmações antigas superadas por fontes mais recentes;
- se requisitos de PRDs mantêm proveniência, identificadores e distinção entre
  especificações explícitas, inferências e questões em aberto;
- conflitos entre versões de PRDs e divergências entre intenção especificada
  e comportamento confirmado por outras fontes;
- capacidades, regras, entidades, restrições, papéis e fluxos importantes que
  foram mencionados, mas ainda não foram conectados às páginas relacionadas;
- páginas órfãs, sem links de entrada;
- links internos quebrados ou relações sem contexto;
- conceitos importantes mencionados, mas sem página própria;
- referências cruzadas e citações ausentes;
- entradas ausentes ou desatualizadas nos índices;
- se existem artefatos gerados fora de `wiki/output/` — por exemplo, imagens,
  HTML, CSS, JavaScript, gráficos, PDFs, apresentações, canvases, planilhas ou
  exports — e reportá-los como não conformes, movendo-os para uma pasta datada
  em `wiki/output/`;
- se existem artefatos diretamente na raiz de `wiki/output/` além do eventual
  `index.md`, ou pastas que não seguem `YYYY-MM-DD-<slug>/`;
- se arquivos dentro de `wiki/output/` estão sendo incorretamente tratados
  como conceitos, exigindo frontmatter ou entrada no `wiki/index.md`;
- se o inventário `wiki/output/index.md` aponta para os artefatos nas pastas
  datadas e se os links relativos entre um artefato e seus arquivos auxiliares
  dentro da mesma pasta resolvem, quando esses links existirem;
- lacunas que poderiam ser preenchidas por novas fontes ou pesquisa na web.

Reporte também perguntas que merecem investigação e fontes que seria útil
adicionar. Um link quebrado não torna o bundle inválido segundo o OKF, mas ainda
pode indicar um problema de manutenção.

## Índices e log

### `wiki/index.md`

Índice raiz do bundle e ponto de entrada para descoberta progressiva. É o único
`index.md` que pode ter frontmatter, exclusivamente para declarar
`okf_version: "0.2"`.

Organize as entradas por categorias que emergirem do conteúdo do produto — por
exemplo, capacidades, entidades, regras de negócio, restrições, papéis, fluxos
e integrações. Cada entrada deve usar um link relativo e, quando disponível,
a `description` do conceito:

```markdown
# Conceitos

- [Nome](conceitos/nome.md) - Resumo do conceito em uma frase.
```

Um `index.md` também pode existir em subdiretórios. Nesses casos, não use
frontmatter, liste conteúdos com links relativos e inclua os subdiretórios
relevantes. Atualize os índices a cada ingestão que afetar seu escopo. A
exceção é `wiki/output/index.md`, que é apenas um inventário de artefatos e não
deve ser incluído no `wiki/index.md` como conteúdo conceitual; seus links devem
apontar para as pastas `YYYY-MM-DD-<slug>/` correspondentes.

### `wiki/log.md`

Histórico de mudanças do bundle, agrupado por data e com as datas mais recentes
primeiro. Entradas antigas são imutáveis; novas entradas devem ser inseridas no
grupo da data correspondente, sem reescrever o histórico.

Use datas ISO 8601 e um tipo de operação em destaque:

```markdown
# Log de atualizações

## 2026-07-23

- **Ingestão**: Adicionado [nome do conceito](/conceitos/nome.md).
- **Consulta**: Incorporada uma comparação durável à wiki.
- **Lint**: Corrigidos links e metadados inconsistentes.
```

Registre consultas apenas quando produzirem uma alteração durável ou uma
decisão relevante para a manutenção da wiki.

## Conformidade e evolução

O bundle está conforme com OKF v0.2 quando:

1. cada `.md` não reservado fora de `wiki/output/` tem frontmatter YAML
   parseável;
2. cada frontmatter contém `type` não vazio;
3. cada `index.md` e `log.md` do bundle segue sua estrutura reservada;
4. artefatos gerados estão em pastas `wiki/output/YYYY-MM-DD-<slug>/`, com no
   máximo o inventário operacional `wiki/output/index.md` diretamente na raiz,
   e não são exigidos como conceitos ou entradas do índice OKF.

Famílias opcionais ausentes, tipos desconhecidos, campos adicionais, links
quebrados e índices ausentes em subdiretórios não invalidam o bundle. Um
conceito sem `verified` é consumível, mas deve ser tratado como não verificado;
um consumidor não deve rejeitá-lo por isso. Não acrescente complexidade antes
que ela seja necessária: o OKF padroniza o intercâmbio, não prescreve taxonomia,
banco, motor de busca, SDK ou plataforma.

Se a especificação-alvo mudar, atualize primeiro `okf_version` no índice raiz e
depois este schema operacional. Em escala moderada, os índices podem ser
suficientes; se a wiki crescer, uma ferramenta de busca local pode ser
adicionada.
