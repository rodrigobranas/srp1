# Guia do repositório

Este repositório contém dois projetos independentes:

- `frontend/`: a interface web. É responsável por páginas, componentes visuais,
  estado e chamadas à API.
- `backend/`: a API HTTP. É responsável por regras de negócio, endpoints,
  validação e acesso a integrações ou dados do servidor.

Todo código novo deve ser criado dentro de `frontend/` ou `backend/`, de acordo
com essa responsabilidade. Não crie código de aplicação, dependências ou
artefatos de build na raiz do repositório.

Siga os padrões descritos nos documentos abaixo em toda criação ou alteração de
código:

- [Padrões de código](.agents/rules/code-standards.md)
- [Estrutura de pastas](.agents/rules/folder-structure.md)
- [Skill de React](.agents/skills/react/SKILL.md): carregue-a sempre que criar, alterar, revisar ou interagir com componentes React, hooks customizados ou telas em `frontend/`.
- [Skill de PR](.agents/skills/pr/SKILL.md): carregue-a sempre que preparar ou abrir uma pull request.
- [Regras de testes](.agents/rules/tests.md)

## Frontend

### Tecnologia e estrutura

- React 19 com TypeScript
- Vite 7 como servidor de desenvolvimento e ferramenta de build
- Tailwind CSS 3, PostCSS e Autoprefixer para estilos
- ESLint 9 com regras para TypeScript e React
- Componentes utilitários baseados em `class-variance-authority`, `clsx`,
  `tailwind-merge`, `lucide-react` e configuração shadcn/ui

O código-fonte fica em `frontend/src/`. O alias `@/` aponta para essa pasta.

### Comandos

Execute os comandos a partir de `frontend/`:

| Objetivo | Comando |
| --- | --- |
| Instalar todas as dependências conforme o lockfile | `npm ci` |
| Instalar dependências respeitando atualizações permitidas | `npm install` |
| Adicionar uma dependência de produção | `npm install <pacote>` |
| Adicionar uma dependência de desenvolvimento | `npm install -D <pacote>` |
| Iniciar em desenvolvimento | `npm run dev` |
| Validar o código com ESLint | `npm run lint` |
| Verificar os tipos TypeScript | `npm run typecheck` |
| Gerar build de produção em `dist/` | `npm run build` |
| Servir localmente o build gerado | `npm run preview` |

Não há framework, arquivos ou script de testes automatizados configurados no
frontend neste momento. Use `npm run lint` e `npm run typecheck` como as
verificações disponíveis.

### Porta e integração

O Vite inicia, por padrão, em `http://localhost:5173`.

O frontend consulta exclusivamente a API local do projeto `backend/`: busca
localidades com `GET /weather/locations`, consulta a previsão com
`POST /weather` e usa `VITE_API_BASE_URL` para definir a origem (padrão
`http://localhost:3000`). A tela não faz polling de `/health`; esse endpoint
continua disponível para verificar o processo da API.

## Backend

### Tecnologia e estrutura

- Node.js 22.13 ou superior com TypeScript 5
- Express 5 para a API HTTP
- `tsx` e Nodemon para desenvolvimento com recarga automática
- `cors` para permitir chamadas do frontend
- `dotenv` para carregar variáveis de ambiente
- Vitest com cobertura V8 para testes; Supertest para testes HTTP

O código-fonte fica em `backend/src/`. O build TypeScript é emitido em
`backend/dist/` como CommonJS, tendo `src/index.ts` como ponto de entrada. O
build usa `tsconfig.build.json`, que exclui os arquivos `*.test.ts` e
`src/tests/`.

### Comandos

Execute os comandos a partir de `backend/`:

| Objetivo | Comando |
| --- | --- |
| Instalar todas as dependências conforme o lockfile | `npm ci` |
| Instalar dependências respeitando atualizações permitidas | `npm install` |
| Adicionar uma dependência de produção | `npm install <pacote>` |
| Adicionar uma dependência de desenvolvimento | `npm install -D <pacote>` |
| Iniciar em desenvolvimento, com recarga automática | `npm run dev` |
| Validar o código com ESLint | `npm run lint` |
| Compilar TypeScript para `dist/` | `npm run build` |
| Executar o build compilado | `npm start` |
| Verificar os tipos TypeScript, incluindo testes | `npm run typecheck` |
| Executar os testes uma vez | `npm test` |
| Executar os testes em modo observação | `npm run test:watch` |
| Executar os testes com cobertura mínima de 80% | `npm run test:coverage` |

Os testes ficam junto ao arquivo testado, com o sufixo `*.test.ts`; fixtures e
utilitários de teste compartilhados ficam em `backend/src/tests/`. A
configuração está em `backend/vitest.config.mts`, e o comando de cobertura
falha quando linhas, funções, branches ou statements ficam abaixo de 80%.

### Porta, variáveis e endpoints

A API inicia em `http://localhost:3000` por padrão. Defina `PORT` no ambiente
ou em um arquivo `.env` dentro de `backend/` para usar outra porta.

O endpoint disponível é:

| Método | Caminho | Finalidade |
| --- | --- | --- |
| `GET` | `/health` | Retorna o estado da API e um timestamp. |
| `GET` | `/weather/locations?query=<cidade>` | Busca até dez localidades para desambiguação. |
| `POST` | `/weather` | Retorna condições atuais e sete dias de previsão para latitude e longitude. |

## Dependências e serviços externos

Os projetos possuem somente as dependências npm declaradas em seus respectivos
`package.json`. Consulte esses arquivos e os respectivos `package-lock.json`
antes de alterar versões ou adicionar pacotes.

O backend consulta a Geocoding API e a Weather Forecast API da Open-Meteo; não
é necessária chave de API e as chamadas externas têm timeout de quatro
segundos. A atribuição meteorológica à Open-Meteo e a atribuição de
geocodificação ao GeoNames são exibidas no frontend. A origem do backend pode
ser configurada no frontend com `VITE_API_BASE_URL`; a porta da API permanece
configurável com `PORT` no backend.

Não há banco de dados, ORM, fila, cache ou serviço de autenticação configurado.
As consultas meteorológicas são transitórias e não são persistidas.
