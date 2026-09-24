# Estrutura de pastas

Organize o código por responsabilidade. Crie uma pasta somente quando houver
arquivos que pertençam àquela responsabilidade e mantenha cada arquivo na pasta
correspondente.

## Frontend (`frontend/src`)

O frontend usa React e Vite. Use a seguinte estrutura como padrão:

```text
frontend/
├── public/
└── src/
    ├── assets/
    ├── components/
    ├── contexts/
    ├── hooks/
    ├── lib/
    ├── services/
    ├── types/
    └── views/
```

### `public/`

Contém arquivos estáticos que o Vite serve diretamente na raiz do site. Use-o
para arquivos que não precisam ser importados pelo código, como `favicon.ico`,
`robots.txt` e manifestos. Para imagens usadas por componentes, prefira
`src/assets/`.

Exemplos:

```text
public/
├── favicon.ico
└── robots.txt
```

```html
<link rel="icon" href="/favicon.ico" />
```

### `views/`

Contém telas e a composição de componentes de uma rota. Uma view coordena a
interface da página, mas não concentra componentes reutilizáveis ou regras de
acesso a dados.

Exemplos:

```text
views/
├── HomeView.tsx
├── UserListView.tsx
└── UserDetailsView.tsx
```

```tsx
export function UserListView() {
  return <UserList />
}
```

### `components/`

Contém componentes independentes e componentes que fazem parte de uma tela.
Organize componentes específicos em subpastas com o nome da view ou do domínio;
componentes compartilhados ficam diretamente em `components/` ou em uma
subpasta semântica.

Exemplos:

```text
components/
├── ui/
│   └── Button.tsx
├── users/
│   └── UserList.tsx
└── Header.tsx
```

```tsx
interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  return <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>
}
```

### `types/`

Contém tipos, interfaces e enums compartilhados pelo frontend. Tipos que são
exclusivos de um componente pequeno podem permanecer próximos dele; quando
forem usados por mais de um arquivo, mova-os para esta pasta.

Exemplos:

```text
types/
├── user.ts
└── api.ts
```

```ts
export interface User {
  id: string
  name: string
  email: string
}
```

### `assets/`

Contém arquivos estáticos importados pelo código, como imagens, ícones, fontes
e ilustrações.

Exemplos:

```text
assets/
├── images/
│   └── logo.svg
└── fonts/
    └── Inter.woff2
```

```tsx
import logo from '@/assets/images/logo.svg'

export function BrandLogo() {
  return <img src={logo} alt="Application logo" />
}
```

### `services/`

Contém código reutilizável ou específico de um componente que não seja de
renderização: clientes HTTP, acesso à API, transformação de dados e regras de
integração da interface. Agrupe serviços por domínio quando necessário.

Exemplos:

```text
services/
├── http-client.ts
└── users/
    └── get-users.ts
```

```ts
export async function getUsers(): Promise<User[]> {
  const response = await fetch('http://localhost:3000/users')
  return response.json()
}
```

### `hooks/`

Use esta pasta para hooks customizados reutilizáveis. Ela é relevante em React
para encapsular estado e efeitos compartilhados entre componentes.

Exemplos:

```text
hooks/
└── useUsers.ts
```

```ts
export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers })
}
```

### `contexts/`

Use esta pasta quando houver estado global fornecido por React Context, como a
sessão autenticada, tema ou idioma. Não a use para estado local de uma tela.

Exemplos:

```text
contexts/
└── AuthContext.tsx
```

```tsx
export const AuthContext = createContext<AuthContextValue | null>(null)
```

### `lib/`

Use esta pasta para utilitários puros, configurações e adaptadores pequenos que
não pertencem a uma tela, componente ou serviço. O projeto já possui
`src/lib/utils.ts` nesta categoria.

Exemplos:

```text
lib/
├── utils.ts
└── format-date.ts
```

```ts
export function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-US').format(value)
}
```

Ao configurar uma ferramenta de testes, crie `tests/` para testes transversais
ou mantenha testes unitários junto ao arquivo testado, com o sufixo
`*.test.ts(x)`. A pasta não deve ser criada enquanto não houver testes.

## Backend (`backend/src`)

O backend usa Node.js, Express e TypeScript. Use a seguinte estrutura:

```text
src/
├── data/
├── gateway/
├── routes/
├── services/
└── types/
```

### `routes/`

Contém as rotas HTTP e os manipuladores de `Request` e `Response` do Express.
Uma rota deve validar o formato da requisição, delegar a regra de negócio a um
serviço e converter o resultado em uma resposta HTTP. Não coloque regra de
negócio, queries ou chamadas externas na rota.

Exemplos:

```text
routes/
└── users-routes.ts
```

```ts
router.get('/users/:id', async (request, response) => {
  const user = await getUserById(request.params.id)
  return response.json(user)
})
```

### `services/`

Contém regras de negócio e orquestração entre `data/` e `gateway/`. Serviços não
devem depender diretamente de `Request` ou `Response`.

Exemplos:

```text
services/
└── get-user-by-id.ts
```

```ts
export async function getUserById(id: string) {
  const user = await userRepository.findById(id)
  if (!user) throw new Error('User not found')
  return user
}
```

### `data/`

Contém a conexão com banco de dados, repositórios, queries, migrations e
adaptadores de persistência. Esta pasta centraliza a comunicação com fontes de
dados internas.

Exemplos:

```text
data/
├── database-client.ts
└── user-repository.ts
```

```ts
export async function findById(id: string) {
  return database.user.findUnique({ where: { id } })
}
```

### `gateway/`

Contém clientes e adaptadores para APIs, serviços e sistemas externos. Isole
nessa pasta detalhes como URLs, autenticação e conversão de respostas externas.

Exemplos:

```text
gateway/
└── payment-gateway.ts
```

```ts
export async function chargePayment(input: ChargePaymentInput) {
  return paymentClient.post('/charges', input)
}
```

### `types/`

Contém tipos, interfaces, enums e contratos compartilhados pelo backend, como
entradas e saídas de serviços. Mantenha contratos HTTP específicos junto à rota
quando não forem reutilizados.

Exemplos:

```text
types/
└── user.ts
```

```ts
export interface CreateUserInput {
  name: string
  email: string
}
```

Não há banco de dados ou gateway externo configurado neste momento. Crie
`data/` e `gateway/` quando essas integrações forem adicionadas, mantendo a
estrutura definida neste documento.
