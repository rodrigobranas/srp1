# Tarefa 1.0: Criar o tipo e o utilitário de conversão e formatação de temperatura

## Visão geral

Criar o tipo compartilhado da unidade de exibição e um utilitário puro que receba valores de origem em Celsius, formate-os em Celsius ou Fahrenheit e preserve valores indisponíveis. A tarefa não modifica componentes nem contratos da API.

## Dependências

- Nenhuma.

<skills>
### Conformidade com skills

- Nenhuma skill React se aplica: esta tarefa cria somente um tipo e um utilitário TypeScript sem JSX, hooks ou tela.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Manter nomes técnicos em inglês, arquivos em `frontend/src/types/` e `frontend/src/lib/`, arquivos de lógica em até 80 linhas, funções em até 30 linhas e no máximo três parâmetros. Criar testes unitários independentes em Given/When/Then; manter a cobertura mínima de 80% conforme a configuração de testes existente.
</rules>

<requirements>

- RF5: converter os valores Celsius para Fahrenheit pela relação definida na TechSpec.
- RF7: valores de origem nulos permanecem indisponíveis, sem gerar valor numérico inválido.
- RF8: valores Celsius continuam vindo da origem sem conversões cumulativas ou alteração dos dados meteorológicos.
- RF13: formatar em pt-BR com até uma casa decimal e sem zeros finais desnecessários.
</requirements>

## Subtarefas

- [ ] 1.1 Criar `TemperatureUnit` em `frontend/src/types/temperature.ts` com as opções `celsius` e `fahrenheit`.
- [ ] 1.2 Criar `formatTemperature` em `frontend/src/lib/temperature.ts`, aplicando a conversão e a formatação especificadas na TechSpec e retornando `Indisponível` para `null`.
- [ ] 1.3 Criar testes unitários da fórmula, da formatação pt-BR, da precisão e dos valores nulos em `frontend/src/lib/temperature.test.ts`.

## Detalhes de implementação

Consultar `techspec.md`, seções “Principais interfaces”, “Modelos de dados” e “Principais decisões”. Manter Celsius como fonte canônica; não adicionar parâmetros de unidade à API nem arredondar o valor convertido antes da formatação.

## Critérios de aceitação relacionados

- CA-03
- CA-04
- CA-06
- CA-11

## Testes da tarefa

### Testes de unidade (se aplicável)

- [ ] TU-01 — Converte temperaturas de Celsius para Fahrenheit
- [ ] TU-02 — Formata as duas unidades em português brasileiro
- [ ] TU-03 — Mantém valores indisponíveis e Celsius original

### Testes de integração (se aplicável)

Não aplicável: a tarefa cria um utilitário puro sem integração entre módulos ou serviços.

### Testes E2E (se aplicável)

Não aplicável conforme `.agents/rules/tests.md`.

## Arquivos relevantes

- `frontend/src/types/temperature.ts` (novo)
- `frontend/src/lib/temperature.ts` (novo)
- `frontend/src/lib/temperature.test.ts` (novo)
- `frontend/src/types/weather.ts` (contrato Celsius existente, sem alteração)
- `tasks/prd-alternancia-unidade-temperatura/techspec.md`
