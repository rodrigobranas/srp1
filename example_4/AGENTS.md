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
- [Regras para React](.agents/rules/react.md)
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

O frontend faz uma chamada periódica para `GET http://localhost:3000/health`
para exibir o estado da API. Essa é a única API consumida atualmente; ela é
local e pertence ao projeto `backend/`.

## Backend

### Tecnologia e estrutura

- Node.js com TypeScript 5
- Express 5 para a API HTTP
- `tsx` e Nodemon para desenvolvimento com recarga automática
- `cors` para permitir chamadas do frontend
- `dotenv` para carregar variáveis de ambiente

O código-fonte fica em `backend/src/`. O build TypeScript é emitido em
`backend/dist/` como CommonJS, tendo `src/index.ts` como ponto de entrada.

### Comandos

Execute os comandos a partir de `backend/`:

| Objetivo | Comando |
| --- | --- |
| Instalar todas as dependências conforme o lockfile | `npm ci` |
| Instalar dependências respeitando atualizações permitidas | `npm install` |
| Adicionar uma dependência de produção | `npm install <pacote>` |
| Adicionar uma dependência de desenvolvimento | `npm install -D <pacote>` |
| Iniciar em desenvolvimento, com recarga automática | `npm run dev` |
| Compilar TypeScript para `dist/` | `npm run build` |
| Executar o build compilado | `npm start` |
| Executar o comando de testes atual | `npm test` |

Ainda não há testes automatizados configurados no backend. O script atual de
`npm test` termina com erro e informa que não há testes especificados; atualize
o script e adicione uma ferramenta de testes ao criar a primeira suíte.

### Porta, variáveis e endpoints

A API inicia em `http://localhost:3000` por padrão. Defina `PORT` no ambiente
ou em um arquivo `.env` dentro de `backend/` para usar outra porta.

O endpoint disponível é:

| Método | Caminho | Finalidade |
| --- | --- | --- |
| `GET` | `/health` | Retorna o estado da API e um timestamp. |

## Dependências e serviços externos

Os projetos possuem somente as dependências npm declaradas em seus respectivos
`package.json`. Consulte esses arquivos e os respectivos `package-lock.json`
antes de alterar versões ou adicionar pacotes.

Não há banco de dados, ORM, fila, cache, serviço de autenticação ou API externa
configurados no estado atual do repositório. A única comunicação entre projetos
é a chamada do frontend para o endpoint local de saúde do backend. Caso uma
integração externa ou banco de dados seja adicionado, documente aqui as
credenciais esperadas, variáveis de ambiente, porta e comandos de execução.
