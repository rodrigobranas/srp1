# Tarefa 3.0: Integrar a unidade selecionada à tela e aos cards meteorológicos

## Visão geral

Integrar o botão ao cabeçalho de `WeatherView`, manter a unidade em estado local e passá-la aos cards da condição atual e da previsão diária. Verificar que a troca atualiza todos os campos de temperatura sem chamada adicional à API e que a seleção permanece entre buscas, mas reinicia em Celsius após recarga.

## Dependências

- Tarefa 1.0 — fornece `TemperatureUnit` e `formatTemperature`.
- Tarefa 2.0 — fornece o controle de unidade acessível.

<skills>
### Conformidade com skills

- `react` (`.agents/skills/react/SKILL.md`): aplicar estado local na view, props explícitas, composição de componentes, Tailwind e cálculo derivado durante a renderização.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Manter a implementação no frontend, sem alteração no backend ou no contrato da API. Usar estado local em vez de Context, manter componentes em até 30 linhas e testar componentes e fluxos afetados. Os testes devem ser independentes, usar Given/When/Then, simular `fetch` em vez de acessar serviços reais e manter pelo menos 80% de cobertura nas quatro métricas configuradas.
</rules>

<requirements>

- RF3: atualizar os valores exibidos sem recarga ou interrupção da página.
- RF4 e RF6: apresentar a temperatura atual, sensação térmica e mínimas/máximas diárias na unidade escolhida, com símbolo correto.
- RF9 e RF10: iniciar em Celsius; manter a escolha durante novas consultas na página atual.
- RF11: não persistir ou sincronizar a escolha entre visitas.
- RF12: não fazer nova consulta meteorológica ao alternar a unidade.
</requirements>

## Subtarefas

- [x] 3.1 Manter `TemperatureUnit` em estado local de `WeatherView`, iniciar em Celsius e renderizar `TemperatureUnitToggle` no cabeçalho sem remontar a tela durante buscas.
- [x] 3.2 Passar `temperatureUnit` para `CurrentWeatherCard` e `DailyForecast`; usar o formatador compartilhado em todas as temperaturas e preservar as unidades de umidade e vento.
- [x] 3.3 Atualizar testes unitários dos cards e o teste de acessibilidade existente; criar testes de integração para troca de unidade, chamadas à API, novas pesquisas e reinício após recarga.
- [x] 3.4 Validar a implementação com `npm run typecheck`, `npm run lint` e `npm run test:coverage` no frontend.

## Detalhes de implementação

Consultar `techspec.md`, seções “Visão dos componentes”, “Modelos de dados”, “Abordagem de testes” e “Principais decisões”. A previsão recebida continua sendo a fonte Celsius. A unidade fica fora do hook e reducer meteorológicos; `WeatherView` montada mantém a escolha durante buscas, e sua remontagem após recarga inicia em Celsius.

## Critérios de aceitação relacionados

- CA-01
- CA-02
- CA-05
- CA-06
- CA-07
- CA-08
- CA-09
- CA-10

## Testes da tarefa

### Testes de unidade (se aplicável)

- [x] TU-05 — Exibe temperatura atual e sensação térmica na unidade recebida
- [x] TU-06 — Exibe mínimas e máximas na unidade recebida

### Testes de integração (se aplicável)

- [x] TI-01 — Alterna todas as temperaturas sem nova chamada à API
- [x] TI-02 — Mantém Fahrenheit ao carregar outra cidade e reinicia em Celsius após recarga
- [x] TI-03 — Opera o controle por teclado na ordem acessível da página

### Testes E2E (se aplicável)

Não aplicável conforme `.agents/rules/tests.md`; a cobertura da interface será feita por testes de integração.

## Arquivos relevantes

- `frontend/src/views/WeatherView.tsx`
- `frontend/src/views/WeatherView.temperature.integration.test.tsx` (novo)
- `frontend/src/views/WeatherView.accessibility.test.tsx`
- `frontend/src/components/weather/CurrentWeatherCard.tsx`
- `frontend/src/components/weather/CurrentWeatherCard.test.tsx`
- `frontend/src/components/weather/DailyForecast.tsx`
- `frontend/src/components/weather/DailyForecast.test.tsx`
- `frontend/src/components/weather/TemperatureUnitToggle.tsx` (criado na tarefa 2.0)
- `frontend/src/lib/temperature.ts` (criado na tarefa 1.0)
- `tasks/prd-alternancia-unidade-temperatura/techspec.md`
