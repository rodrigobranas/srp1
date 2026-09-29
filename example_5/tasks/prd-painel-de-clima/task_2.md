# Tarefa 2.0: Endpoints HTTP, erros estáveis e observabilidade

## Visão geral

Expor os contratos meteorológicos ao frontend por meio dos endpoints Express, mantendo a aplicação testável com dependências substituíveis. Preservar /health e registrar duração e resultado sem registrar consulta ou coordenadas.

## Dependências

- Tarefa 1.0: contratos, validações e gateways usados pelo serviço HTTP.

<skills>
### Conformidade com skills

Nenhuma skill de implementação de frontend se aplica a esta tarefa. A skill criar-tasks foi usada para decompor o trabalho.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

Leitura confirmada do AGENTS.md e de todas as rules em .agents/rules/: code-standards.md, folder-structure.md, react.md e tests.md. Manter rotas, serviço, middleware e tipos nas responsabilidades e diretórios do backend; a rota valida e serializa, enquanto o serviço não depende de Request ou Response. Não registrar termo de busca, latitude ou longitude. Manter testes Given/When/Then, upstream isolado por stubs e cobertura mínima de 80% em cada métrica. Não criar E2E.
</rules>

<requirements>
- RF4: oferecer busca de localidades e consulta de clima pelo backend.
- RF9: responder a entradas inválidas e falhas externas com estados HTTP e mensagens estáveis.
- Preservar GET /health e adicionar GET /weather/locations e POST /weather conforme a TechSpec.
- Registrar duração e resultado da consulta sem dados de localização.
</requirements>

## Subtarefas

- [ ] 2.1 Extrair a criação do Express para createApp, permitindo injetar o serviço nos testes, e manter o listener em backend/src/index.ts.
- [ ] 2.2 Implementar as rotas, validação HTTP, serialização, envelope de erros e Cache-Control: no-store para a consulta de clima.
- [ ] 2.3 Adicionar eventos JSON de início/fim com rota, duração, resultado e categoria de erro, sem query, coordenadas ou payload do provedor.
- [ ] 2.4 Criar testes de integração Supertest para busca, lista vazia, entradas inválidas, previsão de sete dias e erros upstream.
- [ ] 2.5 Verificar que o contrato legado GET /health continua respondendo após a extração da aplicação.

## Detalhes de implementação

Consultar na techspec.md as seções Arquitetura do sistema, Endpoints da API, Pontos de integração, Abordagem de testes e Monitoramento e observabilidade. GET /weather/locations recebe query aparada de 2 a 100 caracteres e retorna até dez localidades. POST /weather recebe latitude e longitude validadas. O timeout externo é quatro segundos; timeout deve virar 504 e demais erros externos 502, sem detalhes brutos na resposta. A TechSpec determina que CI valide o registro de duração e o timeout; a apuração real de p95 depende dos logs agregados no ambiente de execução.

## Critérios de aceitação relacionados

- CA-01
- CA-02
- CA-03
- CA-04
- CA-05
- CA-06
- CA-07
- CA-12

## Testes da tarefa

### Testes de unidade

Não há casos de unidade da TechSpec adicionais atribuídos a esta tarefa; TU-01 a TU-04 cobrem as regras isoladas na tarefa 1.0.

### Testes de integração

- [ ] TI-01 — Busca localidades por nome e trata lista vazia e query inválida
- [ ] TI-02 — Consulta clima por coordenadas e entrega sete datas
- [ ] TI-03 — Devolve falha externa como erro estável sem vazar conteúdo
- [ ] TI-06 — Registra duração e resultado sem dados de localização

### Testes E2E

Não aplicável: .agents/rules/tests.md proíbe testes E2E neste momento.

## Arquivos relevantes

- backend/src/index.ts
- backend/src/app.ts
- backend/src/routes/weather-routes.ts
- backend/src/services/weather-service.ts
- backend/src/middleware/error-handler.ts
- backend/src/types/weather.ts
- backend/src/app.test.ts ou testes de integração em backend/src/tests/
- backend/package.json
- tasks/prd-painel-de-clima/techspec.md
