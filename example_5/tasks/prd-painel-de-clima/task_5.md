# Tarefa 5.0: Estado da busca e atalho de geolocalização

## Visão geral

Implementar os hooks que coordenam busca, seleção, consulta, carregamento e erros. Adicionar o atalho opcional de localização, que só solicita permissão após uma ação explícita e usa coordenadas sem geocodificação reversa.

## Dependências

- Tarefa 3.0: serviço e contratos frontend.
- Tarefa 4.0: componentes que recebem o estado e os callbacks dos hooks.

<skills>
### Conformidade com skills

Aplicar a skill react em .agents/skills/react/SKILL.md e suas referências de hooks, composição e estado. Manter a lógica assíncrona fora dos componentes de apresentação.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

Leitura confirmada do AGENTS.md e de todas as rules em .agents/rules/: code-standards.md, folder-structure.md, react.md e tests.md. Hooks ficam em frontend/src/hooks e devem respeitar os limites de arquivo, função, parâmetros e condicionais; geolocalização não pode ser solicitada no carregamento inicial. Testar efeitos e respostas assíncronas com mocks, Given/When/Then e cobertura mínima de 80% em cada métrica. Não criar E2E.
</rules>

<requirements>
- RF1 e RF2: coordenar submissão e validação da busca.
- RF9: manter feedback recuperável em indisponibilidade e erro.
- RF10 e RF11: solicitar localização somente por ação do usuário e preservar busca manual se a permissão falhar.
- Garantir que respostas obsoletas não substituam os dados da consulta mais recente.
</requirements>

## Subtarefas

- [ ] 5.1 Implementar use-weather para busca, seleção de localidade, consulta, estados e cancelamento ou descarte de respostas obsoletas.
- [ ] 5.2 Implementar use-browser-location para encapsular navigator.geolocation e solicitar posição somente após invocação explícita.
- [ ] 5.3 Consultar clima pelas coordenadas recebidas no fluxo de localização e apresentar o resultado com o rótulo “Sua localização”, sem geocodificação reversa.
- [ ] 5.4 Tratar permissão negada, ausência de suporte e falha de posição com feedback recuperável e busca manual disponível.
- [ ] 5.5 Testar invocação explícita, falha de permissão, preservação do fluxo manual e ordenação de respostas concorrentes.

## Detalhes de implementação

Consultar na techspec.md as seções Fluxo de cidade, Geolocation API do navegador, Componentes novos ou modificados, Abordagem de testes e Considerações técnicas. O hook deve manter a associação entre dados e localidade, impedir que uma busca antiga vença a mais recente e não persistir coordenadas.

## Critérios de aceitação relacionados

- CA-01
- CA-05
- CA-07
- CA-08
- CA-09
- CA-10

## Testes da tarefa

### Testes de unidade

- [ ] TU-07 — Solicita localização somente quando a ação é invocada
- [ ] TU-08 — Impede resposta antiga de substituir consulta mais recente

### Testes de integração

Os fluxos integrados de cidade e localização são cobertos por TI-04 e TI-05 na tarefa 6.0.

### Testes E2E

Não aplicável: .agents/rules/tests.md proíbe testes E2E neste momento.

## Arquivos relevantes

- frontend/src/hooks/use-weather.ts
- frontend/src/hooks/use-browser-location.ts
- frontend/src/hooks/use-weather.test.ts
- frontend/src/hooks/use-browser-location.test.ts
- frontend/src/services/weather-api.ts
- frontend/src/components/weather/WeatherLocationButton.tsx
- tasks/prd-painel-de-clima/techspec.md
