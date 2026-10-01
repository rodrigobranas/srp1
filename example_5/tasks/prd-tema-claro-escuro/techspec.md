# Especificação técnica

## Resumo

A solução reutiliza a classe de tema já configurada no Tailwind CSS e os tokens claro/escuro existentes no frontend. Um provedor React manterá o tema global, e um botão nativo no cabeçalho do painel de clima o alternará sem recarregar ou navegar. O tema começa escuro; a escolha manual fica na sessão da aba e é restaurada ao recarregar essa mesma aba.

A preferência será guardada em `sessionStorage`, sem persistência no backend ou dependências novas. Como navegadores podem copiar esse armazenamento para uma aba aberta por outra, a inicialização só restaura a preferência quando a navegação atual é uma recarga. Navegações novas e abas duplicadas começam escuras. A escolha segue o modo manual por classe do [Tailwind CSS 3](https://v3.tailwindcss.com/docs/dark-mode), o escopo por aba de [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) e a classificação de navegação documentada em [`PerformanceNavigationTiming`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type).

## Arquitetura do sistema

### Visão dos componentes

- `frontend/src/lib/theme-preference.ts` — resolve o tema inicial, valida e lê a preferência da aba, grava escolhas, aplica ou remove a classe `dark` no elemento raiz e atualiza o meta `theme-color`. Erros de acesso ao armazenamento não impedem a troca durante a página atual.
- `frontend/src/contexts/ThemeContext.tsx` — mantém o estado global `light | dark`, sincroniza a classe raiz antes da pintura e expõe estado e ação por Context e pelo hook `useTheme`.
- `frontend/src/components/theme/ThemeToggle.tsx` — botão HTML nativo no cabeçalho existente de `WeatherView`, com nome acessível estável “Alternar tema”, `aria-pressed` para o tema ativo e ícone decorativo de `lucide-react`, já instalado.
- `frontend/src/main.tsx` — envolve `App` com `ThemeProvider`, preservando `StrictMode` e o ponto de entrada atual.
- `frontend/src/views/WeatherView.tsx` — posiciona o controle no cabeçalho já existente e continua coordenando a tela do clima.
- `frontend/src/components/weather/CurrentWeatherCard.tsx`, `DailyForecast.tsx`, `WeatherFeedback.tsx`, `WeatherLocationButton.tsx`, `WeatherLocationResults.tsx`, `WeatherSearchForm.tsx` e `WeatherAttribution.tsx` — substituem cores fixas incompatíveis com um dos temas por tokens compartilhados ou variantes claras/escuras com contraste adequado.
- `frontend/src/index.css` — mantém os tokens existentes, aplica `background`/`foreground` ao `body` e define `color-scheme` para os controles nativos acompanharem a classe raiz.
- `frontend/index.html` — o meta `theme-color`, hoje fixo em claro, acompanha o tema atual para atualizar a cor de interface do navegador em dispositivos compatíveis. O idioma já está definido como `pt-BR`.

Fluxo inicial: o provedor determina o tema por `theme-preference.ts`, usa escuro como padrão e restaura o valor de sessão somente em uma recarga. Em seguida, sincroniza a classe no `<html>` antes da pintura da árvore React; `ThemeToggle` lê o estado pelo contexto. Ao ativar o botão, o estado e a preferência da aba são atualizados, sem remontar `WeatherView` ou reiniciar a busca, a localização ou resultados já exibidos.

A aplicação já define tokens para fundo, texto, cartão, borda, superfícies secundárias, foco e estados destrutivos em `index.css`, além de configurar o modo escuro por classe em `tailwind.config.js`. As classes utilitárias fixas `slate`, `white` e `sky` existentes na tela precisam ser revistas para que campos, mensagens, previsões, resultados, atribuição e cartão atual continuem legíveis em ambos os temas. O cartão atual pode manter o gradiente de marca se a revisão confirmar contraste suficiente nos dois modos.

## Design de implementação

### Principais interfaces

```text
ThemePreference
  getInitialTheme() -> Theme
  applyTheme(theme: Theme) -> void
  saveTheme(theme: Theme) -> void

ThemeContextValue
  theme: Theme
  toggleTheme() -> void
```

`getInitialTheme` retorna `dark` em navegação nova e só considera um valor salvo quando a entrada de Navigation Timing indica `reload`; aceita apenas `light` ou `dark`. Valor inválido, ausência de sessão ou erro de acesso ao `sessionStorage` usa `dark`. Em uma navegação que não é reload, o estado escuro inicial também substitui qualquer valor eventualmente copiado do `opener`.

O provedor usa Context porque o tema é estado global compartilhado. O React descreve [`createContext`](https://react.dev/reference/react/createContext) e [`useContext`](https://react.dev/reference/react/useContext) para fornecer e ler valores dinâmicos em diferentes níveis da árvore. A sincronização da classe DOM é um efeito de layout porque o elemento raiz é externo ao estado React e precisa acompanhar o primeiro tema antes da pintura; a ação do usuário atualiza o estado e salva a preferência no handler.

O controle usa `<button>` nativo para foco e ativação por Enter e Espaço. O nome permanece “Alternar tema”; `aria-pressed="true"` significa tema escuro ativo e `false` significa tema claro. Essa combinação segue o [padrão de botão toggle da WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/button/). O ícone muda entre sol e lua, mas é decorativo e não substitui o nome nem o estado acessível.

### Modelos de dados

Não há modelo persistido no backend nem contrato JSON novo. Os únicos valores de domínio são o estado React e a preferência textual local da aba.

#### `Theme` — tema visual aceito

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `theme` | `'light' \| 'dark'` | sim | Tema ativo. Valores diferentes são inválidos e resultam no padrão escuro. |

```text
{
  "theme": "dark"
}
```

#### `ThemeContextValue` — estado disponível à interface

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `theme` | `Theme` | sim | Tema visual atual da aplicação. |
| `toggleTheme` | `() => void` | sim | Alterna entre `light` e `dark`, atualiza a raiz e salva a escolha da aba. |

```text
{
  "theme": "light",
  "toggleTheme": "função"
}
```

### Endpoints da API (se aplicável)

Não aplicável à funcionalidade de tema. O botão não expõe nem consome endpoints, e as chamadas meteorológicas já existentes permanecem sem alteração.

### Pontos de integração

Não há nova integração externa. O tema integra apenas o estado React com APIs do navegador (`sessionStorage`, Navigation Timing e DOM); não depende do serviço de clima, de chamadas à API ou de alterações no backend.

## Abordagem de testes

O frontend já tem Vitest, Testing Library, `user-event` e cobertura V8 configurados em `frontend/package.json` e `frontend/vite.config.ts`. Seguir `.agents/rules/tests.md`: criar ou atualizar testes junto aos arquivos com comportamento e manter ao menos 80% de linhas, funções, branches e statements. `frontend/src/main.tsx` já está excluído da medição de cobertura.

### Testes de unidade (se aplicável)

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
| --- | --- | --- | --- |
| TU-01 | Usa tema escuro em navegação nova mesmo com preferência copiada | CA-01, CA-05 | Uma navegação nova ou duplicada ignora a preferência copiada e retorna `dark`. |
| TU-02 | Restaura escolha válida ao recarregar a mesma aba | CA-04 | `light` ou `dark` salvo é restaurado somente quando o tipo de navegação é `reload`. |
| TU-03 | Usa tema escuro para valor inválido ou armazenamento indisponível | CA-01, CA-04 | Valor inválido ou exceção de armazenamento não interrompe a inicialização; o padrão é `dark`. |

Os testes de `theme-preference.ts` cobrem resolução e persistência de sessão, incluindo acesso negado a `sessionStorage`. Os demais componentes existentes mantêm seus testes de comportamento; atualizá-los quando mudarem classes de cor para verificar o uso de tokens e a legibilidade das mensagens nos dois temas.

### Testes de integração (se aplicável)

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
| --- | --- | --- | --- |
| TI-01 | Alterna o tema da tela do clima e o estado acessível sem recarregar | CA-02, CA-03, CA-07 | A raiz e o botão refletem o novo tema; formulário, resultado e estado atual permanecem montados. |
| TI-02 | Alterna tema com Enter e Espaço no botão do cabeçalho | CA-06, CA-07 | O botão nativo alterna o tema, mantém o foco e expõe nome fixo mais `aria-pressed` correto. |
| TI-03 | Exibe mensagens e controles nos dois temas | CA-02, CA-08 | Campos, feedback, localização, cartão atual, previsão e atribuição usam tokens ou variantes legíveis. |
| TI-04 | Alternar tema não reinicia operações meteorológicas | CA-03, CA-09 | A troca preserva busca, resultado atual e estado de localização sem iniciar outra consulta. |

Usar Testing Library e `user-event` para verificar controles por papel/nome acessível, estado e interações por teclado. Os testes de integração atuais de `WeatherView` devem envolver `ThemeProvider` e continuar comprovando busca, feedback e localização sem regressões. Não adicionar mocks para APIs externas além dos já usados nos testes meteorológicos.

### Testes E2E (se aplicável)

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
| --- | --- | --- | --- |
| E2E-01 | Mantém tema manual no reload e inicia escuro após fechar, abrir ou duplicar uma aba | CA-01, CA-04, CA-05 | `light` sobrevive ao reload na mesma aba; uma nova aba aberta ou duplicada começa em `dark`, e fechar a aba encerra a preferência. |
| E2E-02 | Alterna tema durante busca e consulta resultados meteorológicos | CA-02, CA-03, CA-08, CA-09 | A interface muda sem navegação; pesquisa, seleção, resultado e mensagens permanecem legíveis e no estado atual. |

Não há runner E2E configurado. Até que o projeto adote um, executar esses dois cenários manualmente em navegador durante a validação; os testes automatizados ficam nas camadas de unidade e integração do Vitest/jsdom.

## Sequenciamento do desenvolvimento

### Ordem de construção

1. Criar e testar `theme-preference.ts`, incluindo padrão escuro, restauração apenas em reload e fallback quando o armazenamento estiver indisponível.
2. Criar `ThemeContext.tsx` e testar estado global, persistência na sessão da aba e sincronização da classe raiz antes da pintura.
3. Criar `ThemeToggle.tsx` e integrar `ThemeProvider` em `main.tsx`; validar `aria-pressed`, foco e operação por teclado.
4. Posicionar o botão no cabeçalho existente de `WeatherView.tsx` e converter estilos fixos dos componentes do clima para tokens ou variantes que preservem o contraste nos dois temas.
5. Atualizar a cor do meta `theme-color`, atualizar testes de componentes e views afetados e validar cobertura, lint, tipos e build do frontend.

### Dependências técnicas

- React 19, TypeScript, Vite 7, Tailwind CSS 3, Testing Library e `lucide-react` já estão instalados; nenhuma dependência nova é necessária.
- `darkMode: ["class"]` já está configurado em `frontend/tailwind.config.js`, e `frontend/src/index.css` já declara tokens claros e escuros em `:root` e `.dark`.
- `sessionStorage` deve estar acessível para restaurar a escolha após reload. Se o navegador bloquear seu uso, a alternância continua funcionando na página atual, mas a preferência não sobrevive a uma recarga.
- Nenhum endpoint ou serviço externo é necessário para essa funcionalidade; serviços de clima existentes não mudam.

## Monitoramento e observabilidade

Não adicionar telemetria, eventos de analytics, métricas ou health checks para uma preferência visual local. Os critérios de funcionamento serão cobertos pela suíte de comportamento e pela validação manual do fluxo entre abas. O estado de cada tema será inspecionado visualmente no painel meteorológico completo.

## Considerações técnicas

### Principais decisões

- Reutilizar a classe `.dark` e os tokens existentes, sem trocar a configuração de classe do Tailwind nem adicionar biblioteca de tema. As classes estáticas de cor dos componentes do clima devem migrar para tokens como `background`, `foreground`, `card`, `muted`, `border`, `primary` e `destructive`; variantes específicas podem ser usadas no gradiente atual se necessário para contraste.
- Usar Context para o tema global e um hook `useTheme` para os consumidores. A documentação oficial do [React `createContext`](https://react.dev/reference/react/createContext) e [`useContext`](https://react.dev/reference/react/useContext) descreve o fluxo de estado dinâmico entre componentes.
- Usar `sessionStorage` porque a escolha deve sobreviver ao reload da mesma aba e terminar com a sessão da aba. Navegadores podem copiar o armazenamento inicial de uma aba com `opener`; a inicialização aceita o valor salvo apenas em uma navegação classificada como `reload`, e usa `dark` nas demais. A classificação está documentada em [`PerformanceNavigationTiming.type`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type).
- Usar botão nativo com nome fixo “Alternar tema” e `aria-pressed` para estado, conforme o [padrão de toggle da WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/button/). A confirmação do usuário durante o esclarecimento selecionou essa semântica.
- O esclarecimento sobre exibir texto para o status da API não se aplica ao estado atual do frontend: o painel de clima não contém o indicador genérico de saúde observado na exploração inicial; seus feedbacks existentes já apresentam mensagens textuais. Nenhuma alteração de status da API faz parte desta TechSpec.

### Riscos conhecidos

- A forma como navegadores classificam uma aba duplicada pode variar. Confirmar que ela não é classificada como `reload`; caso seja, revisar o discriminador para que a aba duplicada continue iniciando escura sem sincronizar preferências entre abas.
- Se o navegador bloquear `sessionStorage`, a escolha não sobrevive a reloads. O fallback mantém a interface utilizável, mas não pode garantir persistência nesse ambiente.
- Gradientes e cores fixas de marca podem não acompanhar automaticamente os tokens. Verificar contraste e legibilidade no cartão atual, campos, botões, resultados, estados de feedback e atribuição em ambos os temas.
- A navegação é client-side com Vite/React; sincronizar a classe raiz antes da pintura para evitar flash do tema padrão. Manter a leitura de estado inicial fora de efeitos usados apenas para derivação de estado.

### Conformidade com o AGENTS.md e as rules

O `AGENTS.md` e todas as rules em `.agents/rules/` foram lidos: `code-standards.md`, `folder-structure.md`, `react.md` e `tests.md`. Esta especificação mantém o trabalho em `frontend/`, usa React 19/TypeScript/Tailwind, Context para estado global e hooks/componentes nas pastas previstas, nomes técnicos em inglês, componentes de até 30 linhas, arquivos de lógica de até 80 linhas e funções de até 30 linhas.

Há uma divergência de documentação: o `AGENTS.md` diz que ainda não existe framework ou script de testes no frontend; o estado atual de `frontend/package.json` e `frontend/vite.config.ts` contém Vitest, Testing Library, jsdom e limiar de cobertura de 80%. A rule `tests.md` também exige testes para arquivos com comportamento e cobertura mínima de 80%; esta TechSpec usa a infraestrutura atual e mantém esse limiar. Não haverá mudança no backend ou nos contratos dos serviços meteorológicos.

### Conformidade com skills

- `react` em `.agents/skills/react/SKILL.md` é aplicável. Também foram lidas `references/styling-and-props.md`, `references/component-composition.md` e `references/react-hooks.md`. A abordagem usa Tailwind, props explícitas, estado em Context/hook e efeitos somente para sincronizar o DOM do navegador; nenhuma biblioteca de estilos será adicionada.
- A skill `pr` não se aplica porque esta tarefa produz uma TechSpec e não prepara uma pull request. Nenhuma outra skill de implementação do frontend se aplica ao documento.

### Arquivos relevantes e dependentes

- Modificados: `frontend/src/main.tsx`, `frontend/src/index.css`, `frontend/index.html`, `frontend/src/views/WeatherView.tsx`, `frontend/src/views/WeatherView.accessibility.test.tsx`, `frontend/src/views/WeatherView.city.integration.test.tsx`, `frontend/src/views/WeatherView.location.integration.test.tsx`, `frontend/src/components/weather/CurrentWeatherCard.tsx`, `DailyForecast.tsx`, `WeatherFeedback.tsx`, `WeatherLocationButton.tsx`, `WeatherLocationResults.tsx`, `WeatherSearchForm.tsx`, `WeatherAttribution.tsx` e os respectivos arquivos `*.test.tsx` existentes.
- Novos: `frontend/src/lib/theme-preference.ts`, `frontend/src/lib/theme-preference.test.ts`, `frontend/src/contexts/ThemeContext.tsx`, `frontend/src/contexts/ThemeContext.test.tsx`, `frontend/src/components/theme/ThemeToggle.tsx` e `frontend/src/components/theme/ThemeToggle.test.tsx`.
- Testes de composição existentes a manter: `frontend/src/App.test.tsx` e os testes de integração/acessibilidade de `WeatherView`; adicionar `ThemeProvider` nos testes que renderizam `App` ou `WeatherView` fora do bootstrap de `main.tsx`.
- Configuração existente reutilizada sem novas dependências: `frontend/package.json`, `frontend/vite.config.ts` e `frontend/tailwind.config.js`.
