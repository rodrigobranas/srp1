# Tarefa 3.0: Adaptar estilos da interface meteorológica para os dois temas

## Visão geral

Substituir cores fixas incompatíveis com um dos temas por tokens existentes ou variantes legíveis. Garantir que campos, mensagens, controles, previsões, resultados, atribuições e o cartão atual continuem distinguíveis no tema claro e no escuro.

## Dependências

- Tarefa 2.0 — o botão e o estado global estabelecem a alternância visual a validar.

<skills>
### Conformidade com skills

- `react` (`.agents/skills/react/SKILL.md`): aplicar Tailwind e as convenções de composição ao ajustar estilos nos componentes do clima.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Manter os tokens globais em `index.css`, estilos dos componentes no Tailwind e código técnico em inglês. Atualizar os testes dos componentes afetados e preservar cobertura mínima de 80% em linhas, funções, branches e statements.
</rules>

<requirements>

- RF8: manter textos, controles e indicadores distinguíveis nos dois temas, sem depender apenas de cor ou ícone.
- RF2: aplicar a alternância a toda a interface visível.
</requirements>

## Subtarefas

- [ ] 3.1 Ajustar o fundo, o primeiro plano e `color-scheme` globais para acompanhar os tokens claro/escuro existentes.
- [ ] 3.2 Revisar cores fixas e estados visuais dos componentes meteorológicos, preservando contraste também no gradiente do cartão atual.
- [ ] 3.3 Atualizar testes dos componentes afetados para verificar apresentação legível nos dois temas e manter os limites de cobertura.

## Detalhes de implementação

Consultar `techspec.md`, seções “Visão dos componentes”, “Abordagem de testes” e “Principais decisões”. Priorizar tokens existentes (`background`, `foreground`, `card`, `muted`, `border`, `primary` e `destructive`); manter variantes de marca somente quando o contraste for adequado.

## Critérios de aceitação relacionados

- CA-02
- CA-08

## Testes da tarefa

### Testes de unidade (se aplicável)

### Testes de integração (se aplicável)

- [ ] TI-03 — Exibe mensagens e controles nos dois temas

### Testes E2E (se aplicável)

## Arquivos relevantes

- `frontend/src/index.css`
- `frontend/src/components/weather/CurrentWeatherCard.tsx` e `CurrentWeatherCard.test.tsx`
- `frontend/src/components/weather/DailyForecast.tsx` e `DailyForecast.test.tsx`
- `frontend/src/components/weather/WeatherFeedback.tsx` e `WeatherFeedback.test.tsx`
- `frontend/src/components/weather/WeatherLocationButton.tsx` e `WeatherLocationButton.test.tsx`
- `frontend/src/components/weather/WeatherLocationResults.tsx` e `WeatherLocationResults.test.tsx`
- `frontend/src/components/weather/WeatherSearchForm.tsx` e `WeatherSearchForm.test.tsx`
- `frontend/src/components/weather/WeatherAttribution.tsx` e `WeatherAttribution.test.tsx`
