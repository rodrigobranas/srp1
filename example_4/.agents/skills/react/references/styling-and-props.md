# Estilos e props

## Use Tailwind CSS para estilizar componentes

Use classes utilitárias do Tailwind diretamente no JSX. Não crie arquivos CSS por componente, estilos inline ou bibliotecas de estilização adicionais sem uma necessidade técnica documentada.

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

## Não espalhe props em elementos

Evite usar o spread operator para encaminhar props diretamente a elementos ou componentes, como `<button {...props}>`. Declare as props aceitas de forma explícita para tornar a API do componente clara e impedir o repasse acidental de atributos ou handlers.

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
