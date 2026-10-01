# Tarefa 2.0: Criar o botão acessível de alternância de unidade

## Visão geral

Criar um componente controlado de alternância que apresente a unidade ativa e acione uma callback para solicitar a troca. O componente ficará pronto para integração ao cabeçalho na tarefa seguinte.

## Dependências

- Tarefa 1.0 — fornece o tipo `TemperatureUnit` usado pelas props do controle.

<skills>
### Conformidade com skills

- `react` (`.agents/skills/react/SKILL.md`): aplicar composição de componentes, Tailwind, props explícitas e interação por handler.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Manter o componente em `frontend/src/components/weather/`, com até 30 linhas, props explícitas, botão nativo e estilos Tailwind. Criar teste do componente em Given/When/Then e manter a cobertura mínima de 80% configurada no frontend.
</rules>

<requirements>

- RF1: oferecer um botão que alterne entre Celsius e Fahrenheit.
- RF2: mostrar a unidade ativa e comunicar de forma acessível a unidade de destino.
</requirements>

## Subtarefas

- [ ] 2.1 Criar `TemperatureUnitToggle` em `frontend/src/components/weather/TemperatureUnitToggle.tsx`, recebendo `unit` e `onToggle` por props explícitas.
- [ ] 2.2 Usar o componente `Button` existente, com `type="button"`, `aria-pressed`, texto visível da unidade ativa, nome acessível que informe unidade atual e destino, e foco visível.
- [ ] 2.3 Criar teste unitário que valide nome acessível, estado e ativação por Enter e Espaço em `TemperatureUnitToggle.test.tsx`.

## Detalhes de implementação

Consultar `techspec.md`, seções “Visão dos componentes”, “Principais interfaces” e “Principais decisões”. O componente deve ser controlado: não guardar unidade própria, não acessar a API e não depender de Context.

## Critérios de aceitação relacionados

- CA-09

## Testes da tarefa

### Testes de unidade (se aplicável)

- [ ] TU-04 — Expõe estado e ação acessíveis no botão de unidade

### Testes de integração (se aplicável)

Não aplicável nesta entrega isolada; a integração com `WeatherView` será coberta na tarefa 3.0.

### Testes E2E (se aplicável)

Não aplicável conforme `.agents/rules/tests.md`.

## Arquivos relevantes

- `frontend/src/components/weather/TemperatureUnitToggle.tsx` (novo)
- `frontend/src/components/weather/TemperatureUnitToggle.test.tsx` (novo)
- `frontend/src/types/temperature.ts` (criado na tarefa 1.0)
- `frontend/src/components/ui/button.tsx` (reutilizado sem alteração)
- `tasks/prd-alternancia-unidade-temperatura/techspec.md`
