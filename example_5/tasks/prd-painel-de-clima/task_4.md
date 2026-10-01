# Tarefa 4.0: Componentes de busca, condições atuais e previsão diária

## Visão geral

Criar os componentes de apresentação reutilizáveis do painel: busca, escolha de localidade, cartão atual, lista de sete dias, feedback dos estados e atribuição das fontes. Cada componente recebe dados e callbacks por props; a coordenação assíncrona fica para a tarefa 5.

## Dependências

- Tarefa 3.0: contratos, cliente de API e formatação disponíveis.

<skills>
### Conformidade com skills

Aplicar a skill react em .agents/skills/react/SKILL.md e suas referências de composição, hooks, props e estilos. A tela deve compor componentes pequenos; não concentrar requisições nem regras de estado nos componentes.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

Leitura confirmada do AGENTS.md e de todas as rules em .agents/rules/: code-standards.md, folder-structure.md, react.md e tests.md. Componentes ficam em frontend/src/components/weather, usam props explícitas, Tailwind, semântica acessível e até 30 linhas por componente; delegar lógica a hooks e serviços. Testar o comportamento público de cada componente, usar Given/When/Then e preservar ao menos 80% de cobertura em cada métrica. Não criar E2E.
</rules>

<requirements>
- RF1 e RF2: oferecer campo rotulado, submissão por botão ou Enter e feedback para entrada vazia.
- RF3: apresentar resultados distinguíveis por cidade, região e país.
- RF6 e RF7: mostrar condições atuais e previsão de sete datas locais nas unidades acordadas.
- RF8 e RF9: exibir atribuição à Open-Meteo e estados claros de carregamento, vazio e falha recuperável.
- RF10: apresentar uma ação explícita para iniciar o uso da localização do navegador.
</requirements>

## Subtarefas

- [x] 4.1 Criar formulário de busca e lista acessível de localidades com nome, região e país.
- [x] 4.2 Criar cartão de clima atual e previsão de hoje mais os seis dias seguintes, com condição e mínima/máxima.
- [x] 4.3 Criar estados de carregamento, entrada inválida, sem resultados, erro e localização recusada com mensagens acessíveis.
- [x] 4.4 Criar a ação visual de localização e atribuição visível com links para Open-Meteo e GeoNames.
- [x] 4.5 Adicionar testes unitários de apresentação para os componentes com comportamento, incluindo rótulos, estados e conteúdo.

## Detalhes de implementação

Consultar na techspec.md as seções Componentes novos ou modificados, Modelos de dados, Abordagem de testes e Conformidade com o AGENTS.md e as rules. Textos de interface ficam em português do Brasil. O estado de carregamento, erro e resultado deve ser anunciado a tecnologias assistivas; cor ou ícone não podem ser o único indicador. Manter foco visível e responsividade em telas móveis e desktop.

## Critérios de aceitação relacionados

- CA-01
- CA-02
- CA-03
- CA-04
- CA-06
- CA-07
- CA-10
- CA-11

## Testes da tarefa

### Testes de unidade

A TechSpec não atribui IDs TU específicos a estes componentes; adicionar testes unitários de comportamento para cada componente com lógica de apresentação.

### Testes de integração

Os fluxos integrados são cobertos por TI-04 e TI-05 na tarefa 6.0.

### Testes E2E

Não aplicável: .agents/rules/tests.md proíbe testes E2E neste momento.

## Arquivos relevantes

- frontend/src/components/weather/WeatherSearchForm.tsx
- frontend/src/components/weather/WeatherLocationResults.tsx
- frontend/src/components/weather/WeatherLocationButton.tsx
- frontend/src/components/weather/CurrentWeatherCard.tsx
- frontend/src/components/weather/DailyForecast.tsx
- frontend/src/components/weather/WeatherFeedback.tsx
- frontend/src/components/weather/WeatherAttribution.tsx
- Testes unitários adjacentes aos componentes
- tasks/prd-painel-de-clima/techspec.md
