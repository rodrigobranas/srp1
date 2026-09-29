# Tarefa 6.0: Composição da tela e integração do fluxo completo

## Visão geral

Compor os hooks e componentes em uma tela de clima, conectá-la ao ponto de entrada do frontend e validar os fluxos completos por testes de integração React. Remover a consulta periódica de /health do navegador sem remover o endpoint do backend.

## Dependências

- Tarefa 2.0: endpoints HTTP disponíveis.
- Tarefa 3.0: contratos, cliente de API e formatadores.
- Tarefa 4.0: componentes de apresentação.
- Tarefa 5.0: estado de busca e geolocalização.

<skills>
### Conformidade com skills

Aplicar a skill react em .agents/skills/react/SKILL.md e suas referências à composição de telas, uso de hooks e estilos. A view coordena a página sem concentrar chamadas HTTP ou formatação de domínio.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

Leitura confirmada do AGENTS.md e de todas as rules em .agents/rules/: code-standards.md, folder-structure.md, react.md e tests.md. A tela deve ficar em frontend/src/views, usar Tailwind, ser responsiva e acessível, e manter lógica nos hooks/services. Cobrir fluxos de integração com respostas controladas, Given/When/Then e cobertura mínima de 80% em cada métrica. Executar como parte da implementação os comandos disponíveis de lint, typecheck, build e cobertura; não criar testes E2E.
</rules>

<requirements>
- RF1–RF11: integrar busca, desambiguação, clima atual, previsão, mensagens, atribuição e geolocalização opcional em uma experiência coerente.
- RF5: confirmar no fluxo integrado que o navegador só chama o backend.
- Atender CA-10 com uso por teclado, foco visível, semântica e anúncio dos estados.
- Atender CA-12 instrumentando a duração e permitindo apurar o p95 em condições normais com o provedor disponível. A TechSpec esclarece que a apuração real depende de logs agregados no ambiente de execução; CI verifica instrumentação e timeout, não a latência variável do provedor.
</requirements>

## Subtarefas

- [ ] 6.1 Criar WeatherView para compor formulário, localidades, clima atual, previsão, feedback, localização e atribuição.
- [ ] 6.2 Atualizar App.tsx para exibir WeatherView e remover o polling do navegador para /health, mantendo o endpoint no backend.
- [ ] 6.3 Criar testes React de integração para busca, seleção de cidade homônima, renderização dos dados e estados acessíveis.
- [ ] 6.4 Criar teste React de integração para geolocalização autorizada e recusada, verificando o rótulo “Sua localização” e a ausência de geocodificação reversa.
- [ ] 6.5 Verificar navegação por teclado, foco, responsividade, atribuição e ausência de chamadas do frontend às URLs Open-Meteo.
- [ ] 6.6 Na implementação, rodar lint, typecheck, build e test:coverage nos dois projetos e corrigir falhas até atender às regras de cobertura.

## Detalhes de implementação

Consultar na techspec.md as seções Componentes novos ou modificados, Arquitetura do sistema, Abordagem de testes, Monitoramento e observabilidade e Sequenciamento do desenvolvimento. TI-04 e TI-05 são testes de integração do frontend com serviços controlados, não testes E2E. Para CA-12, garantir eventos com durationMs e o timeout definido; a medição do p95 exige agregação dos eventos do ambiente em execução e não deve enviar consulta ou coordenadas em logs.

## Critérios de aceitação relacionados

- CA-02
- CA-03
- CA-04
- CA-05
- CA-08
- CA-09
- CA-10
- CA-11
- CA-12

## Testes da tarefa

### Testes de unidade

Os casos unitários TU-01 a TU-08 estão atribuídos às tarefas 1.0, 3.0 e 5.0.

### Testes de integração

- [ ] TI-04 — Completa fluxo React de busca, seleção e renderização
- [ ] TI-05 — Consulta coordenadas do navegador sem geocodificação reversa

### Testes E2E

Não aplicável: .agents/rules/tests.md proíbe testes E2E neste momento.

## Arquivos relevantes

- frontend/src/App.tsx
- frontend/src/views/WeatherView.tsx
- frontend/src/views/WeatherView.test.tsx
- frontend/src/components/weather/*
- frontend/src/hooks/use-weather.ts
- frontend/src/hooks/use-browser-location.ts
- backend/src/app.ts
- backend/src/middleware/error-handler.ts
- tasks/prd-painel-de-clima/prd.md
- tasks/prd-painel-de-clima/techspec.md
