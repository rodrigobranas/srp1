# Especificação técnica

## Resumo

A alternância será implementada no frontend sobre os dados meteorológicos já carregados, que permanecem em Celsius no contrato existente. `WeatherView` controlará a unidade selecionada em estado React local e a passará ao controle do cabeçalho e aos dois componentes que exibem temperaturas. Um utilitário puro compartilhará a conversão e a formatação brasileira.

A conversão não altera a previsão armazenada nem chama o backend. A unidade começa em Celsius, acompanha novas pesquisas enquanto `WeatherView` permanecer montada e volta a Celsius após recarga ou nova montagem. Não serão adicionadas dependências.

## Arquitetura do sistema

### Visão dos componentes

- `frontend/src/views/WeatherView.tsx` — mantém `TemperatureUnit` com `useState`, renderiza o botão no cabeçalho e passa a unidade para os cards. A busca e o resultado continuam sob responsabilidade de `useWeather`.
- `frontend/src/components/weather/TemperatureUnitToggle.tsx` — novo botão acessível que exibe °C ou °F e aciona a troca.
- `frontend/src/components/weather/CurrentWeatherCard.tsx` — recebe a unidade e apresenta nela a temperatura atual e a sensação térmica; umidade e vento não mudam.
- `frontend/src/components/weather/DailyForecast.tsx` — recebe a unidade e apresenta nela as mínimas e máximas diárias.
- `frontend/src/types/temperature.ts` — novo tipo compartilhado `TemperatureUnit`.
- `frontend/src/lib/temperature.ts` — novo formatador/conversor puro; lê um valor original em Celsius, converte somente quando a unidade selecionada for Fahrenheit, aplica a formatação numérica pt-BR e preserva o estado indisponível.
- `frontend/src/services/weather-api.ts`, `frontend/src/hooks/use-weather.ts` e `frontend/src/types/weather.ts` — permanecem sem mudanças: a API continua retornando valores Celsius e as buscas existentes não dependem da unidade de exibição.

Fluxo: `WeatherView` mantém a unidade → o botão solicita a alternância → `WeatherView` renderiza novamente → os cards formatam os valores Celsius originais na unidade selecionada. Como a unidade fica fora do estado do hook meteorológico, uma busca ou uma falha de busca não a redefine. O estado React local é preservado enquanto a tela permanece montada, seguindo o comportamento documentado de [`useState`](https://react.dev/reference/react/useState) e de [preservação de estado do React](https://react.dev/learn/preserving-and-resetting-state).

## Design de implementação

### Principais interfaces

```ts
export type TemperatureUnit = 'celsius' | 'fahrenheit'
export function formatTemperature(valueCelsius: number | null, unit: TemperatureUnit): string

interface TemperatureUnitToggleProps {
  unit: TemperatureUnit
  onToggle: () => void
}

interface CurrentWeatherCardProps {
  locationName: string
  country: string | null
  forecast: WeatherForecast
  temperatureUnit: TemperatureUnit
}

interface DailyForecastProps {
  days: WeatherDay[]
  temperatureUnit: TemperatureUnit
}
```

`formatTemperature` usa °C diretamente quando a unidade for Celsius e aplica `°F = (°C × 1,8) + 32` quando for Fahrenheit. Para `null`, retorna o rótulo existente `Indisponível`, sem tentar formatar ou converter o valor. A fórmula segue as [equações exatas de temperatura do NIST](https://www.nist.gov/system/files/documents/2019/11/19/00-20-hb44-final11152019pdf.pdf).

O botão deve ser um elemento `<button>` nativo através do componente `Button` já existente em `components/ui/button.tsx`, com `type="button"`, `aria-pressed`, nome acessível que informa a unidade atual e a unidade de destino, e foco visível. Seu texto visível mostra a unidade ativa. O layout do cabeçalho deve continuar utilizável em telas móveis e desktop.

### Modelos de dados

#### `TemperatureUnit` — unidade de exibição local

| Opção | Tipo | Origem | Descrição |
| ----- | ---- | ------ | --------- |
| `celsius` | literal de `TemperatureUnit` | estado inicial de `WeatherView` | Exibe o número Celsius original com °C. |
| `fahrenheit` | literal de `TemperatureUnit` | ativação do controle | Converte o Celsius original para Fahrenheit e exibe °F. |

O valor existe apenas no estado da tela; não é serializado nem enviado à API. Os contratos existentes continuam inalterados: `temperatureC`, `apparentTemperatureC`, `minimumTemperatureC` e `maximumTemperatureC` são `number | null` em Celsius. Os valores de origem não devem ser substituídos por números convertidos.

#### Formatação dos valores

| Campo | Tipo | Obrigatório | Descrição |
| ----- | ---- | ----------- | --------- |
| valor de origem | `number | null` | sim | Valor Celsius já fornecido pelo contrato meteorológico. |
| unidade selecionada | `TemperatureUnit` | sim | Determina a conversão de exibição. |
| texto exibido | `string` | sim | Valor em pt-BR com °C ou °F; para origem nula, `Indisponível`. |

Precisão confirmada na clarificação: até uma casa decimal, sem zeros finais desnecessários. O número convertido não será arredondado antes da formatação. A formatação usa `Intl.NumberFormat` com locale `pt-BR`, `minimumFractionDigits: 0` e `maximumFractionDigits: 1`; esses controles são opções padrão da [API `Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat).

### Endpoints da API (se aplicável)

Não aplicável à alternância: nenhum endpoint é adicionado ou alterado e o botão não faz chamadas de rede. O fluxo de busca existente continua usando `GET /weather/locations` e `POST /weather` conforme já documentado no `AGENTS.md`.

## Pontos de integração

Não há integração externa nova. A integração existente entre frontend e backend é usada somente para carregar localizações e previsões; a troca de unidade opera no resultado já recebido. Não há requisitos de autenticação, timeout, retry ou idempotência para o controle.

## Abordagem de testes

Os testes usam Vitest e Testing Library já presentes no frontend. Os testes de interação simulam a API com `fetch` stubado; a conversão é testada como função pura. Cada caso deve seguir Given/When/Then e manter estado independente. A cobertura deve permanecer em pelo menos 80% para linhas, funções, branches e statements, conforme `.agents/rules/tests.md` e a configuração existente em `frontend/vite.config.ts`.

### Testes de unidade

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
|----|-----------------------|------------------------|--------------------|
| TU-01 | Converte temperaturas de Celsius para Fahrenheit | CA-03 | 0 °C resulta em 32 °F, 100 °C em 212 °F e um valor fracionário segue a fórmula exata antes da formatação. |
| TU-02 | Formata as duas unidades em português brasileiro | CA-01, CA-02, CA-03, CA-11 | O texto usa vírgula decimal, até uma casa decimal sem zero final e o símbolo da unidade selecionada. |
| TU-03 | Mantém valores indisponíveis e Celsius original | CA-04, CA-06 | `null` continua como `Indisponível`; alternar a unidade não altera o valor Celsius de origem nem acumula arredondamento. |
| TU-04 | Expõe estado e ação acessíveis no botão de unidade | CA-09 | A unidade ativa e a ação de alternância são acessíveis, e o botão responde a Enter e Espaço. |
| TU-05 | Exibe temperatura atual e sensação térmica na unidade recebida | CA-02, CA-05 | `CurrentWeatherCard` apresenta ambas as temperaturas em °C ou °F e preserva umidade e vento. |
| TU-06 | Exibe mínimas e máximas na unidade recebida | CA-02, CA-05, CA-06 | `DailyForecast` apresenta cada mínima e máxima na unidade correta e mantém campos nulos indisponíveis. |

Os casos TU-01 a TU-03 pertencem a `frontend/src/lib/temperature.test.ts`; TU-04, a `frontend/src/components/weather/TemperatureUnitToggle.test.tsx`; TU-05 e TU-06 atualizam os testes existentes dos respectivos cards. O tipo declarativo é validado pelo typecheck e pelos consumidores.

### Testes de integração

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
|----|-----------------------|------------------------|--------------------|
| TI-01 | Alterna todas as temperaturas sem nova chamada à API | CA-02, CA-03, CA-05, CA-10 | Em `WeatherView`, um clique atualiza a temperatura atual, sensação térmica e mínimas/máximas; umidade e vento ficam iguais; a contagem de chamadas não aumenta. |
| TI-02 | Mantém Fahrenheit ao carregar outra cidade e reinicia em Celsius após recarga | CA-07, CA-08 | A unidade continua Fahrenheit durante a busca seguinte; uma remontagem que representa a recarga inicia em Celsius. |
| TI-03 | Opera o controle por teclado na ordem acessível da página | CA-09 | O skip link continua primeiro, o controle é alcançável e alterna a unidade por teclado sem impedir a busca. |

TI-01 e TI-02 serão cobertos por `frontend/src/views/WeatherView.temperature.integration.test.tsx`, usando respostas determinísticas para `fetch`. TI-03 atualizará `frontend/src/views/WeatherView.accessibility.test.tsx`. Nenhum teste deve acessar Open-Meteo ou outro serviço real.

### Testes E2E

Não aplicável. `.agents/rules/tests.md` determina que não sejam criados testes E2E neste momento; os testes de unidade e integração cobrem os critérios desta alteração.

## Sequenciamento do desenvolvimento

### Ordem de construção

1. Criar `TemperatureUnit` e o formatador puro, com testes de fórmula, precisão, locale e nulos para fixar o contrato de exibição.
2. Criar o botão acessível e seu teste unitário.
3. Adicionar estado local ao `WeatherView`, renderizar o controle no cabeçalho e passar a unidade aos cards.
4. Atualizar os testes unitários de `CurrentWeatherCard` e `DailyForecast` e cobrir o fluxo completo de busca/troca em testes de integração.
5. Atualizar o teste de acessibilidade e validar typecheck, lint e cobertura do frontend.

### Dependências técnicas

- React e TypeScript existentes, `Button` e classes Tailwind já disponíveis no frontend.
- `Intl.NumberFormat` nativo do ambiente JavaScript; não é necessário adicionar pacote npm.
- Testes dependem da configuração Vitest e Testing Library existente. Não há dependência de serviço externo para a alternância.

## Monitoramento e observabilidade

Não adicionar métricas, logs, eventos ou health checks: a mudança de estado é local e não envolve rede. Os resultados verificáveis são cobertos pelos testes de unidade e integração e pelos critérios de aceitação do PRD.

## Considerações técnicas

### Principais decisões

- Manter a unidade em estado local de `WeatherView`; não usar Context, reducer de clima ou `localStorage`, pois só esta tela consome a escolha. Novas buscas mantêm o componente montado; uma recarga reinicia em Celsius, conforme confirmado na clarificação do PRD.
- Tratar Celsius recebido da API como fonte canônica e calcular Fahrenheit somente para exibição. Isso evita arredondamento acumulado e deixa o contrato do backend intacto.
- Reutilizar o botão UI existente e classes Tailwind, sem instalar biblioteca de controles ou formatação.
- Formatar com até uma casa decimal, sem zero final, conforme confirmado na clarificação e registrado em RF13 do PRD.
- Não usar `useEffect` nem `useMemo`: a seleção é alterada por evento e a conversão de poucos valores é um cálculo simples durante a renderização.

### Riscos conhecidos

- Um campo de temperatura pode permanecer com símbolo Celsius fixo. Mitigação: centralizar a formatação em `lib/temperature.ts` e cobrir temperatura atual, sensação térmica e limites diários separadamente.
- Valores nulos podem virar `NaN` durante a conversão. Mitigação: preservar `null` antes de qualquer operação numérica e verificar essa regra em TU-03 e TU-06.
- Há divergência entre documentação e configuração do frontend: `AGENTS.md` informa que não há testes automatizados no frontend, enquanto `frontend/package.json`, `frontend/vite.config.ts` e os arquivos `*.test.ts(x)` configuram e usam Vitest. Esta especificação segue a configuração executável e mantém o limite de 80% exigido pelas rules.

### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules foram lidos: `.agents/rules/code-standards.md`, `.agents/rules/folder-structure.md`, `.agents/rules/react.md` e `.agents/rules/tests.md`. O escopo de implementação fica em `frontend/`; não altera backend, API ou dependências. Os nomes técnicos serão em inglês, tipos compartilhados ficam em `src/types/`, lógica pura em `src/lib/`, componentes em `src/components/weather/` e testes junto dos módulos. A implementação deve manter arquivos de lógica em até 80 linhas, funções em até 30 linhas e no máximo três parâmetros; testes unitários e de integração usam Given/When/Then, mocks apenas para serviços externos e cobertura mínima de 80%. Testes E2E não serão adicionados conforme a regra vigente.

### Conformidade com skills

- `criar-techspec`: estrutura seguida, componentes e contratos identificados e casos de teste nomeados por camada e associados aos critérios do PRD.
- `react`: aplica-se à mudança de tela e componentes. Estado local pertence à view, transformações ficam em utilitário puro, estilos usam Tailwind e as props dos componentes são explícitas. Não há desvios previstos.

### Arquivos relevantes e dependentes

- Novos: `frontend/src/types/temperature.ts`, `frontend/src/lib/temperature.ts`, `frontend/src/lib/temperature.test.ts`, `frontend/src/components/weather/TemperatureUnitToggle.tsx`, `frontend/src/components/weather/TemperatureUnitToggle.test.tsx`, `frontend/src/views/WeatherView.temperature.integration.test.tsx`.
- Modificados: `frontend/src/views/WeatherView.tsx`, `frontend/src/components/weather/CurrentWeatherCard.tsx`, `frontend/src/components/weather/CurrentWeatherCard.test.tsx`, `frontend/src/components/weather/DailyForecast.tsx`, `frontend/src/components/weather/DailyForecast.test.tsx`, `frontend/src/views/WeatherView.accessibility.test.tsx`.
- Referências existentes sem alteração: `frontend/src/services/weather-api.ts`, `frontend/src/hooks/use-weather.ts`, `frontend/src/types/weather.ts`, `frontend/src/components/ui/button.tsx`, `frontend/package.json` e `frontend/vite.config.ts`.
- Requisito de origem: `tasks/prd-alternancia-unidade-temperatura/prd.md`.
