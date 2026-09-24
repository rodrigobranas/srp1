# Regras de testes

Estas regras se aplicam ao frontend e ao backend. Os testes validam o
comportamento de negócio de cada responsabilidade e devem acompanhar a alteração
que introduz ou modifica o código de produção.

## 1. Crie testes para todos os arquivos e componentes

**SEMPRE CRIE TESTES PARA TODOS OS ARQUIVOS E COMPONENTES.** Todo arquivo que
adicione comportamento deve ter testes correspondentes: componentes, views,
hooks, services, routes, gateways, repositórios e funções utilitárias. Teste a
responsabilidade pública do arquivo, em vez de seus detalhes internos.

Arquivos exclusivamente declarativos, como tipos e interfaces TypeScript, devem
ser validados pelo typecheck e pelos testes dos módulos que usam seus contratos.

Organize os testes junto ao arquivo testado ou em `tests/`, mantendo uma relação
clara entre implementação e teste:

```text
frontend/src/
├── components/
│   ├── UserList.tsx
│   └── UserList.test.tsx
└── services/
    ├── users/get-users.ts
    └── users/get-users.test.ts
```

Exemplo de teste de responsabilidade de um componente:

```tsx
describe('UserList', () => {
  it('shows the name of each available user', () => {
    // Given
    const users = [{ id: 'user-1', name: 'Ada Lovelace' }]
    // When
    render(<UserList users={users} />)
    // Then
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
  })
})
```

## 2. Mantenha cobertura mínima de 80%

Cada projeto deve manter pelo menos 80% de cobertura para linhas, funções,
branches e statements. Configure o comando de cobertura para falhar quando
qualquer uma dessas métricas ficar abaixo do limite.

Exemplo de limiares de cobertura em uma configuração de testes:

```ts
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

Não use cobertura como único indicador de qualidade. Inclua casos de sucesso,
erro e regras de negócio relevantes, mesmo quando a cobertura já estiver acima
do mínimo.

## 3. Mantenha testes independentes

Cada teste deve preparar seus próprios dados, mocks e estado. Um teste não pode
depender da ordem de execução, do resultado de outro teste, de dados locais
persistidos ou de serviços em execução.

Evite compartilhar estado mutável entre testes:

```ts
const users: User[] = []

it('adds a user', () => {
  users.push({ id: 'user-1', name: 'Ada Lovelace' })
  expect(users).toHaveLength(1)
})
```

Prefira criar os dados dentro de cada teste:

```ts
it('adds a user', () => {
  // Given
  const users: User[] = []
  // When
  users.push({ id: 'user-1', name: 'Ada Lovelace' })
  // Then
  expect(users).toHaveLength(1)
})
```

Restaure mocks, spies, relógios e variáveis de ambiente após cada teste quando
forem utilizados.

## 4. Use testes de unidade e integração

Crie testes de unidade para componentes, hooks, funções, services e regras de
negócio isoladas. Crie testes de integração para verificar a colaboração entre
módulos, por exemplo uma rota HTTP, seu service e sua serialização de resposta.

Por enquanto, não crie testes E2E.

Exemplo de teste unitário para uma regra de negócio:

```ts
describe('calculateOrderTotal', () => {
  it('adds the price of every order item', () => {
    // Given
    const items = [{ price: 20 }, { price: 30 }]
    // When
    const total = calculateOrderTotal(items)
    // Then
    expect(total).toBe(50)
  })
})
```

Exemplo de teste de integração de uma rota, mantendo a infraestrutura externa
isolada:

```ts
describe('GET /health', () => {
  it('returns the API health status', async () => {
    // Given
    const healthPath = '/health'
    // When
    const response = await request(app).get(healthPath)
    // Then
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('healthy')
  })
})
```

## 5. Use mocks e stubs para fatores externos

Use mocks ou stubs para APIs externas, banco de dados, relógio, sistema de
arquivos, ambiente e serviços de terceiros. O teste deve controlar a resposta
da dependência e verificar somente o contrato que importa para a regra testada.

Exemplo de mock para uma chamada HTTP externa:

```ts
it('returns users received from the external API', async () => {
  // Given
  const httpClient = { get: vi.fn().mockResolvedValue([{ id: 'user-1', name: 'Ada Lovelace' }]) }
  const gateway = createUsersGateway(httpClient)
  // When
  const users = await gateway.getUsers()
  // Then
  expect(httpClient.get).toHaveBeenCalledWith('/users')
  expect(users).toEqual([{ id: 'user-1', name: 'Ada Lovelace' }])
})
```

Exemplo de stub para tornar o relógio previsível:

```ts
it('creates an expiration date seven days ahead', () => {
  // Given
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  // When
  const expirationDate = createExpirationDate()
  // Then
  expect(expirationDate.toISOString()).toBe('2026-01-08T00:00:00.000Z')
})
```

Não use uma API real ou banco de dados real em testes unitários. Em testes de
integração, use uma instância isolada e descartável quando for necessário testar
o adaptador de dados.

## 6. Estruture os testes em given/when/then

Organize todo teste em três etapas: **given** prepara o cenário, **when**
executa a ação e **then** verifica o resultado. Use comentários em inglês para
marcar as etapas quando isso melhorar a leitura.

Exemplo:

```ts
it('rejects an order when payment is not approved', async () => {
  // Given
  const paymentGateway = { charge: vi.fn().mockResolvedValue({ approved: false }) }
  const service = createCheckoutService(paymentGateway)
  // When
  const result = await service.checkout({ orderId: 'order-1' })
  // Then
  expect(result.status).toBe('rejected')
})
```

## 7. Dê objetivos de negócio claros aos testes

O nome de cada teste deve descrever uma regra, resultado ou cenário de negócio
que o sistema protege. Evite nomes que descrevem apenas a implementação.

Evite:

```ts
it('calls the method', () => {
  const save = vi.fn()
  save()
  expect(save).toHaveBeenCalled()
})
```

Prefira:

```ts
it('saves a paid order after payment approval', async () => {
  // Given
  const saveOrder = vi.fn()
  const checkoutService = createCheckoutService({ saveOrder })
  // When
  await checkoutService.complete({ paymentApproved: true })
  // Then
  expect(saveOrder).toHaveBeenCalled()
})
```

Antes de criar um teste, responda: qual comportamento de negócio será protegido
e qual decisão uma falha nesse teste ajudará a identificar?
