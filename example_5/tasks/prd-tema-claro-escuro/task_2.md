# Tarefa 2.0: Integrar botão de tema acessível no cabeçalho do painel

## Visão geral

Adicionar um botão HTML nativo ao cabeçalho de `WeatherView`, com nome acessível fixo “Alternar tema”, `aria-pressed` refletindo o tema ativo e operação por mouse, toque e teclado. A atualização deve preservar o conteúdo, a busca e as operações meteorológicas atuais.

## Dependências

- Tarefa 1.0 — requer `ThemeProvider` e o hook de tema.

<skills>
### Conformidade com skills

- `react` (`.agents/skills/react/SKILL.md`): aplicar as convenções de composição de componentes, Tailwind, props explícitas e interação via handlers.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Manter alterações no frontend, componentes com até 30 linhas, funções com até 30 linhas e nomes técnicos em inglês. Cobrir comportamento alterado nos testes existentes ou novos e manter ao menos 80% de cobertura nas quatro métricas configuradas.
</rules>

<requirements>

- RF1: exibir botão para alternar tema no cabeçalho.
- RF2: alternar o tema sem recarregar nem mudar de tela.
- RF3: identificar acessivelmente a ação e o estado sem depender só de cor ou ícone.
- RF7: fornecer foco visível e suporte às teclas Enter e Espaço.
</requirements>

## Subtarefas

- [x] 2.1 Criar `ThemeToggle` com nome acessível estável “Alternar tema”, `aria-pressed` (`true` para escuro, `false` para claro) e ícone decorativo.
- [x] 2.2 Inserir o botão no cabeçalho existente de `WeatherView`, mantendo o foco visível e o layout utilizável em telas móveis e desktop.
- [x] 2.3 Atualizar testes de `App` e `WeatherView` para prover o contexto, verificar estado acessível, ativação por teclado e manutenção do estado da tela.
- [x] 2.4 Verificar que alternar o tema durante operações meteorológicas não desmonta a tela nem inicia consultas adicionais.

## Detalhes de implementação

Consultar `techspec.md`, seções “Visão dos componentes”, “Design de implementação” e “Abordagem de testes”. Usar botão nativo; o texto acessível permanece “Alternar tema” enquanto `aria-pressed` anuncia o estado. Reutilizar o contexto da tarefa 1.0 sem remontar `WeatherView`.

## Critérios de aceitação relacionados

- CA-02
- CA-03
- CA-06
- CA-07
- CA-09

## Testes da tarefa

### Testes de unidade (se aplicável)

### Testes de integração (se aplicável)

- [x] TI-01 — Alterna o tema da tela do clima e o estado acessível sem recarregar
- [x] TI-02 — Alterna tema com Enter e Espaço no botão do cabeçalho
- [x] TI-04 — Alternar tema não reinicia operações meteorológicas

### Testes E2E (se aplicável)

## Arquivos relevantes

- `frontend/src/components/theme/ThemeToggle.tsx` (novo)
- `frontend/src/components/theme/ThemeToggle.test.tsx` (novo)
- `frontend/src/views/WeatherView.tsx`
- `frontend/src/views/WeatherView.accessibility.test.tsx`
- `frontend/src/views/WeatherView.city.integration.test.tsx`
- `frontend/src/views/WeatherView.location.integration.test.tsx`
- `frontend/src/App.test.tsx`
- `frontend/src/main.tsx`
