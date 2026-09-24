# Effects e memoização

## Use `useEffect` somente para sincronizar efeitos externos

Não use `useEffect` para derivar valores de props ou estado, tratar cliques, buscar dados de modo ad hoc ou controlar fluxo de renderização. Esses casos devem ser resolvidos durante a renderização, por handlers, hooks dedicados ou services. Use `useEffect` para sincronizar com algo fora do React, como título da página, subscrições, timers ou APIs do navegador.

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

## Use `useMemo` para cálculos pesados

Use `useMemo` para evitar recalcular valores caros quando as dependências não mudaram, como filtros, ordenações ou agregações sobre coleções grandes. `useMemo` não impede uma renderização; ele memoriza o resultado do cálculo. Não o use para cálculos simples sem evidência de custo relevante.

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
