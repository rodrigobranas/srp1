# Tarefa 1.0: Contratos, validação e gateways Open-Meteo no backend

## Visão geral

Criar a camada de domínio e integração externa do backend: contratos meteorológicos, validações reutilizáveis, gateways para geocoding e previsão, normalização das respostas e classificação dos erros. Esta é a base para os endpoints HTTP da tarefa 2.

<skills>
### Conformidade com skills

Nenhuma skill de implementação de frontend se aplica a esta tarefa. A skill criar-tasks foi usada para decompor o trabalho.
</skills>

<rules>
### Conformidade com o AGENTS.md e as rules

Leitura confirmada do AGENTS.md e de todas as rules em .agents/rules/: code-standards.md, folder-structure.md, react.md e tests.md. Manter os arquivos em backend/src/gateway, backend/src/types e backend/src/services, usar nomes e mensagens técnicas em inglês e respeitar os limites de 80 linhas por arquivo, 30 linhas por função, três parâmetros e três níveis de condicionais. Testes devem seguir Given/When/Then, controlar as respostas externas com stubs e contribuir para pelo menos 80% de cobertura em cada métrica. Não criar E2E.
</rules>

<requirements>
- RF2: rejeitar consultas vazias ou menores que o tamanho mínimo antes de chamar a origem.
- RF4: resolver localidades e normalizar condições atuais e sete datas de previsão por meio das APIs Open-Meteo.
- Respeitar o contrato e os parâmetros de origem descritos na TechSpec, incluindo timeout de quatro segundos, idioma português e unidades especificadas.
- Não adicionar dependência de produção para HTTP; usar fetch nativo do Node >=22, conforme a TechSpec.
</requirements>

## Subtarefas

- [x] 1.1 Configurar Vitest e cobertura V8 no backend, incluindo os scripts de teste e as dependências de desenvolvimento previstas na TechSpec.
- [x] 1.2 Definir tipos de domínio e validações de busca e coordenadas; rejeitar entradas inválidas sem chamar gateways.
- [x] 1.3 Implementar os gateways de geocoding e previsão, com parâmetros fixos, timeout, validação de payload e normalização para os contratos internos.
- [x] 1.4 Adicionar testes unitários isolados com fixtures e stubs para sucesso, campos ausentes, lista vazia, timeout e respostas inválidas.

## Detalhes de implementação

Consultar na techspec.md as seções Arquitetura do sistema, Design de implementação, Modelos de dados, Parâmetros fixos na origem, Pontos de integração e Abordagem de testes. Os gateways devem ocultar o formato externo e preservar timezone, campos opcionais normalizados como null e as sete datas locais. Erros externos não devem expor conteúdo bruto do provedor.

## Critérios de aceitação relacionados

- CA-01
- CA-02
- CA-03
- CA-04
- CA-05
- CA-06
- CA-07
- CA-08

## Testes da tarefa

### Testes de unidade

- [x] TU-01 — Rejeita busca vazia/curta e coordenadas fora dos limites
- [x] TU-02 — Converte correspondências de geocodificação e campos ausentes
- [x] TU-03 — Normaliza clima atual e associa arrays diários às datas locais
- [x] TU-04 — Classifica timeout, HTTP não-2xx e payload externo inválido

### Testes de integração

Não há casos de integração da TechSpec atribuídos a esta tarefa.

### Testes E2E

Não aplicável: .agents/rules/tests.md proíbe testes E2E neste momento.

## Arquivos relevantes

- backend/package.json
- backend/package-lock.json
- backend/vitest.config.ts
- backend/src/types/weather.ts
- backend/src/gateway/open-meteo-geocoding-gateway.ts
- backend/src/gateway/open-meteo-weather-gateway.ts
- backend/src/services/weather-service.ts
- Testes unitários adjacentes aos validadores e gateways
- tasks/prd-painel-de-clima/techspec.md
