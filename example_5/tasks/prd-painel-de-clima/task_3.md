# Tarefa 3.0: Cliente de API e formatos meteorológicos no frontend

## Visão geral

Preparar a camada de integração do frontend: definir os tipos dos contratos, centralizar as chamadas ao backend e fornecer conversões de códigos meteorológicos e datas locais. Esta tarefa não adiciona chamadas diretas do navegador à Open-Meteo.

## Dependências

- Tarefa 2.0: contratos públicos e endpoints do backend definidos.

<skills>
### Conformidade com skills

Nenhuma skill de componente React se aplica: o escopo desta tarefa são tipos, serviços, utilitários e configuração de testes. A skill criar-tasks foi usada para decompor o trabalho.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

Leitura confirmada do AGENTS.md e de todas as rules em .agents/rules/: code-standards.md, folder-structure.md, react.md e tests.md. Manter o cliente HTTP em frontend/src/services, os tipos em frontend/src/types e os utilitários puros em frontend/src/lib. Centralizar VITE_API_BASE_URL, escrever testes Given/When/Then com mocks e configurar cobertura mínima de 80% em cada métrica. Não criar E2E.
</rules>

<requirements>
- RF5: o navegador consulta geocoding e clima somente pelo backend.
- RF6 e RF7: oferecer à interface tipos e formatadores compatíveis com unidades, datas locais e respostas meteorológicas do contrato.
- Usar VITE_API_BASE_URL com padrão local indicado na TechSpec e traduzir erros HTTP em mensagens compreensíveis em PT-BR.
</requirements>

## Subtarefas

- [x] 3.1 Configurar Vitest, jsdom, Testing Library, user-event, cobertura V8 e scripts de teste no frontend.
- [x] 3.2 Definir tipos TypeScript para localidades, coordenadas, clima atual, previsão diária e erros HTTP.
- [x] 3.3 Implementar o serviço frontend para GET /weather/locations e POST /weather, com suporte a AbortSignal e sem URLs de provedores externos.
- [x] 3.4 Implementar utilitários puros para rótulos WMO e apresentação de datas/horários no fuso retornado pela API.
- [x] 3.5 Cobrir o mapeamento WMO, fallback desconhecido, formatação local e uso exclusivo da base/rotas do backend.

## Detalhes de implementação

Consultar na techspec.md as seções Arquitetura do sistema, Modelos de dados, Endpoints da API, Pontos de integração, Abordagem de testes e Considerações técnicas. Os contratos frontend/backend são duplicados nos projetos e os testes de integração HTTP devem proteger sua compatibilidade. O cliente não deve incluir coordenadas na URL; a consulta de clima usa POST.

## Critérios de aceitação relacionados

- CA-02
- CA-03
- CA-09

## Testes da tarefa

### Testes de unidade

- [x] TU-05 — Traduz códigos WMO conhecidos e desconhecidos
- [x] TU-06 — Usa somente a base e rotas do backend no service frontend

### Testes de integração

Não há casos de integração da TechSpec atribuídos a esta tarefa.

### Testes E2E

Não aplicável: .agents/rules/tests.md proíbe testes E2E neste momento.

## Arquivos relevantes

- frontend/package.json
- frontend/package-lock.json
- frontend/vite.config.ts
- frontend/src/services/weather-api.ts
- frontend/src/types/weather.ts
- frontend/src/lib/weather-codes.ts
- frontend/src/lib/weather-dates.ts
- Testes unitários adjacentes ao serviço e utilitários
- tasks/prd-painel-de-clima/techspec.md
