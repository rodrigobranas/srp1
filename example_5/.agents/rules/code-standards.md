# Padrões de código

Estas regras se aplicam a todo código criado ou alterado nos projetos
`frontend/` e `backend/`.

## 1. Escreva código em inglês

Use inglês para nomes de arquivos, classes, interfaces, tipos, funções,
variáveis, parâmetros, constantes, propriedades, comentários e mensagens
técnicas.

Evite:

```ts
const nomeDoUsuario = 'Ana'
function calcularTotal(valor: number) {
  return valor * 1.1
}
```

Prefira:

```ts
const userName = 'Ana'
function calculateTotal(amount: number) {
  return amount * 1.1
}
```

## 2. Limite os arquivos a 80 linhas

Arquivos que contenham classes, interfaces, componentes, tipos ou lógica devem
ter no máximo 80 linhas. Extraia responsabilidades para arquivos menores antes
de ultrapassar esse limite.

Evite concentrar validação, transformação e persistência em uma única classe:

```ts
class CreateOrderService {
  // validateInput(), calculateTotal(), saveOrder(), notifyCustomer()
  // and other responsibilities in one long file
}
```

Prefira separar cada responsabilidade:

```ts
// order-validator.ts
export function validateOrderInput(input: CreateOrderInput) {
  // validation
}

// order-total-calculator.ts
export function calculateOrderTotal(items: OrderItem[]) {
  // calculation
}
```

## 3. Limite métodos e funções a 30 linhas

Métodos e funções devem ter, no máximo, 30 linhas. Extraia trechos que tratem
de uma responsabilidade específica para funções nomeadas.

Evite uma função que execute todas as etapas de criação de um pedido:

```ts
function createOrder(input: CreateOrderInput) {
  // validates input
  // loads products
  // calculates values
  // saves the order
  // sends notifications
  // ... more than 30 lines
}
```

Prefira coordenar funções menores:

```ts
function createOrder(input: CreateOrderInput) {
  validateOrderInput(input)
  const items = loadOrderItems(input.items)
  const total = calculateOrderTotal(items)
  const order = saveOrder({ customerId: input.customerId, items, total })
  sendOrderConfirmation(order)
  return order
}
```

## 4. Use no máximo três parâmetros

Funções e métodos não devem receber mais de três parâmetros. Quando houver mais
dados relacionados, use um objeto de parâmetros com um tipo explícito.

Evite:

```ts
function createUser(name: string, email: string, age: number, city: string) {
  return { name, email, age, city }
}
```

Prefira:

```ts
interface CreateUserInput {
  name: string
  email: string
  age: number
  city: string
}

function createUser(input: CreateUserInput) {
  return input
}
```

## 5. Não aninhe mais de três blocos condicionais

Evite mais de três níveis de aninhamento com `if` e `else`. Aumente a clareza
extraindo validações ou retornando assim que uma condição impedir a execução.

Evite:

```ts
if (user) {
  if (user.isActive) {
    if (user.subscription) {
      if (user.subscription.isPaid) {
        grantAccess(user)
      }
    }
  }
}
```

Prefira cláusulas-guarda:

```ts
if (!user || !user.isActive) return
if (!user.subscription || !user.subscription.isPaid) return
grantAccess(user)
```

## 6. Use early returns e evite `else` desnecessário

Valide condições de saída no início da função. Depois que um ramo retorna,
lança uma exceção ou encerra a execução, não use `else` para envolver o fluxo
restante.

Evite:

```ts
function getDiscount(user: User) {
  if (user.isPremium) {
    return 0.2
  } else {
    return 0
  }
}
```

Prefira:

```ts
function getDiscount(user: User) {
  if (!user.isPremium) return 0
  return 0.2
}
```

## 7. Declare variáveis perto de onde são usadas

Declare uma variável imediatamente antes ou próximo do trecho que precisa dela.
Isso reduz o escopo visual e evita manter valores sem uso por muitas linhas.

Evite:

```ts
function sendWelcomeEmail(user: User) {
  const subject = 'Welcome'
  validateUser(user)
  saveUserAccess(user)
  return mailer.send({ to: user.email, subject })
}
```

Prefira:

```ts
function sendWelcomeEmail(user: User) {
  validateUser(user)
  saveUserAccess(user)
  const subject = 'Welcome'
  return mailer.send({ to: user.email, subject })
}
```

## 8. Não use linhas em branco dentro de funções e métodos

Não separe trechos de uma função ou método com linhas em branco. Se for preciso
uma separação visual para tornar responsabilidades mais claras, extraia esse
trecho para uma nova função ou método.

Evite:

```ts
function registerUser(input: CreateUserInput) {
  validateUserInput(input)

  const user = createUser(input)
  saveUser(user)

  sendWelcomeEmail(user)
  return user
}
```

Prefira funções pequenas e sem linhas em branco internas:

```ts
function registerUser(input: CreateUserInput) {
  const user = createAndSaveUser(input)
  sendWelcomeEmail(user)
  return user
}

function createAndSaveUser(input: CreateUserInput) {
  validateUserInput(input)
  const user = createUser(input)
  saveUser(user)
  return user
}
```
