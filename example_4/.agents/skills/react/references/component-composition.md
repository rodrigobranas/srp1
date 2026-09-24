# Composição e responsabilidades

## Limite componentes a 30 linhas

Um componente React deve ter, no máximo, 30 linhas. Quando ultrapassar esse limite, extraia partes visuais para componentes e a lógica para hooks ou services.

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

## Extraia lógica para hooks ou services

Extraia para um hook a lógica que usa estado, ciclo de vida ou outras APIs do React. Extraia para um service a comunicação com APIs, transformação de dados e outras tarefas que não dependam do React. Componentes devem coordenar esses elementos e renderizar a interface.

Exemplo de service em `services/users/get-users.ts`:

```ts
export async function getUsers(): Promise<User[]> {
  const response = await fetch('http://localhost:3000/users')
  if (!response.ok) throw new Error('Unable to load users')
  return response.json()
}
```

Exemplo de hook em `hooks/use-users.ts`:

```tsx
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
