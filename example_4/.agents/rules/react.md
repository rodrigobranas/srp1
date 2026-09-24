# Regras para React

Estas regras se aplicam ao código React criado ou alterado em `frontend/`.
Todos os exemplos usam TypeScript e nomes em inglês.

## 1. Use Tailwind CSS para estilizar componentes

Use classes utilitárias do Tailwind diretamente no JSX. Não crie arquivos CSS
por componente, estilos inline ou bibliotecas de estilização adicionais sem uma
necessidade técnica documentada.

Evite:

```tsx
export function SubmitButton() {
  return <button style={{ backgroundColor: 'blue', color: 'white' }}>Save</button>
}
```

Prefira:

```tsx
export function SubmitButton() {
  return <button className="rounded bg-blue-600 px-4 py-2 text-white">Save</button>
}
```

## 2. Limite componentes a 30 linhas

Um componente React deve ter, no máximo, 30 linhas. Quando ultrapassar esse
limite, extraia partes visuais para componentes e a lógica para hooks ou
services.

Evite concentrar a página inteira em um único componente:

```tsx
export function UserDetailsView() {
  // Loads data, handles form state, renders a header, a form and an activity list.
  // The component grows past 30 lines.
  return <main />
}
```

Prefira componentes focados:

```tsx
interface UserHeaderProps {
  name: string
}

export function UserHeader({ name }: UserHeaderProps) {
  return <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
}
```

```tsx
export function UserDetailsView() {
  const { user, isLoading } = useUserDetails()
  if (isLoading) return <LoadingState />
  if (!user) return <EmptyState />
  return <main className="space-y-6"><UserHeader name={user.name} /><UserForm user={user} /></main>
}
```

## 3. Não espalhe props em elementos

Evite usar o spread operator para encaminhar props diretamente a elementos ou
componentes, como `<button {...props}>`. Declare as props aceitas de forma
explícita para tornar a API do componente clara e impedir o repasse acidental
de atributos ou handlers.

Evite:

```tsx
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} />
}
```

Prefira:

```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button className="rounded px-3 py-2" disabled={disabled} onClick={onClick}>{label}</button>
}
```

## 4. Use `useEffect` somente para sincronizar efeitos externos

Não use `useEffect` para derivar valores de props ou estado, tratar cliques,
buscar dados de modo ad hoc ou controlar fluxo de renderização. Esses casos
devem ser resolvidos durante a renderização, por handlers, hooks dedicados ou
services. Use `useEffect` para sincronizar com algo fora do React, como título
da página, subscrições, timers ou APIs do navegador.

Evite estado derivado por efeito:

```tsx
export function UserName({ user }: { user: User }) {
  const [name, setName] = useState('')
  useEffect(() => setName(`${user.firstName} ${user.lastName}`), [user])
  return <span>{name}</span>
}
```

Prefira calcular durante a renderização:

```tsx
export function UserName({ user }: { user: User }) {
  const name = `${user.firstName} ${user.lastName}`
  return <span>{name}</span>
}
```

Use `useEffect` quando houver uma sincronização externa real:

```tsx
export function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title
  }, [title])
  return null
}
```

## 5. Use `useMemo` para cálculos pesados

Use `useMemo` para evitar recalcular valores caros quando as dependências não
mudaram, como filtros, ordenações ou agregações sobre coleções grandes.
`useMemo` não impede uma renderização; ele memoriza o resultado do cálculo.
Não o use para cálculos simples sem evidência de custo relevante.

Evite recalcular uma lista custosa a cada renderização:

```tsx
export function OrderList({ orders, searchTerm }: OrderListProps) {
  const visibleOrders = filterAndSortOrders(orders, searchTerm)
  return <OrdersTable orders={visibleOrders} />
}
```

Prefira memorizar o cálculo:

```tsx
export function OrderList({ orders, searchTerm }: OrderListProps) {
  const visibleOrders = useMemo(() => filterAndSortOrders(orders, searchTerm), [orders, searchTerm])
  return <OrdersTable orders={visibleOrders} />
}
```

## 6. Extraia lógica para hooks ou services

Extraia para um hook a lógica que usa estado, ciclo de vida ou outras APIs do
React. Extraia para um service a comunicação com APIs, transformação de dados e
outras tarefas que não dependam do React. Componentes devem coordenar esses
elementos e renderizar a interface.

Exemplo de service em `services/users/get-users.ts`:

```ts
export async function getUsers(): Promise<User[]> {
  const response = await fetch('http://localhost:3000/users')
  if (!response.ok) throw new Error('Unable to load users')
  return response.json()
}
```

Exemplo de hook em `hooks/use-users.ts`:

```ts
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    getUsers().then(setUsers).finally(() => setIsLoading(false))
  }, [])
  return { users, isLoading }
}
```

Exemplo de componente que apenas coordena e renderiza:

```tsx
export function UsersView() {
  const { users, isLoading } = useUsers()
  if (isLoading) return <LoadingState />
  return <UserList users={users} />
}
```
