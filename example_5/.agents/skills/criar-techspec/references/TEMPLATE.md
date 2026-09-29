# Especificação técnica

## Resumo

[Descreva brevemente a abordagem técnica da solução. Resuma as principais decisões de arquitetura e a estratégia de implementação em um ou dois parágrafos.]

## Arquitetura do sistema

### Visão dos componentes

[Descreva brevemente os principais componentes e liste cada componente novo ou modificado:

- Nomes dos componentes e funções principais
- Principais relacionamentos entre componentes
- Visão geral do fluxo de dados]

## Design de implementação

### Principais interfaces

[Se aplicável, defina as principais interfaces de serviço, respeitando os padrões e a linguagem do projeto, com no máximo 20 linhas por exemplo:

```
ServiceName
  methodName(input) -> output
```

]

### Modelos de dados

Se aplicável, documente **cada** entidade ou contrato usando o modelo abaixo: uma subseção própria, uma tabela de campos e um exemplo representativo no formato adotado pelo projeto. Variantes, degradações, envelopes de erro, mapeamentos e parâmetros fixos devem ter blocos próprios, conforme demonstrado.

Se houver contratos JSON entre backend e UI, eles devem estar prontos para exibição. [Complete o contexto específico da funcionalidade. Campos ausentes na origem devem ser normalizados para `null`, quando essa for a convenção do projeto.]

#### `[NomeDoTipo]` — [descrição curta]

| Campo     | Tipo     | Obrigatório | Descrição   |
| --------- | -------- | ----------- | ----------- |
| `[campo]` | `[tipo]` | sim/não     | [Descrição] |

```text
{
  "[campo]": "[valor realista]"
}
```

[Repita o padrão acima para cada entidade ou contrato principal: payload agregado, tipos de entrada, tipos de erro etc.]

> **[Variante/degradação (se aplicável)]:** [Explique quando ocorre e qual é o impacto no payload.]

```text
{
  "[secao_afetada]": null
}
```

#### `[NomeDoErro]` — envelope de erro (se aplicável)

| Código     | HTTP       | Significado |
| ---------- | ---------- | ----------- |
| `[codigo]` | `[status]` | [Descrição] |

```text
{
  "error": {
    "code": "[codigo]",
    "message": "[mensagem em inglês ou PT-BR, conforme o padrão do projeto]"
  }
}
```

#### Mapeamento [origem externa] → contrato (se aplicável)

| Origem ([API/fonte]) | Destino (contrato) |
| -------------------- | ------------------ |
| `[campo_origem]`     | `[campo_destino]`  |

#### Parâmetros fixos na origem (se aplicável)

| API               | Parâmetros principais              |
| ----------------- | ---------------------------------- |
| **[Nome da API]** | `[param1=valor]`, `[param2=valor]` |

[Se aplicável, documente os esquemas do banco de dados usando o mesmo padrão: subseção, tabela e exemplo em JSON ou SQL.]

### Endpoints da API (se aplicável)

Se a funcionalidade expuser ou consumir uma API, documente **cada** endpoint usando o modelo abaixo e cubra todos os cenários relevantes: sucesso, lista vazia, erro de validação, erro na origem e degradação parcial. Registre comportamentos não óbvios em um blockquote (`>`). Para payloads já documentados em Modelos de dados, referencie o exemplo existente em vez de duplicá-lo.

#### Visão geral

| Método           | Rota           | Descrição         |
| ---------------- | -------------- | ----------------- |
| `[GET/POST/...]` | `[/api/...]` | [Descrição breve] |

---

#### `[MÉTODO] [/api/rota]`

[Descrição breve do propósito do endpoint.]

**Parâmetros de consulta** (ou **corpo** para POST/PUT/PATCH)

| Parâmetro | Tipo     | Padrão           | Regras                |
| --------- | -------- | ---------------- | --------------------- |
| `[param]` | `[tipo]` | `[valor padrão ou —]` | [Validações e regras] |

**Respostas**

| Status  | Corpo            | Quando                          |
| ------- | ---------------- | ------------------------------- |
| `[200]` | `[TipoResposta]` | [Condição de sucesso]           |
| `[400]` | `[TipoErro]`     | [Condição de erro de validação] |
| `[502]` | `[TipoErro]`     | [Condição de falha na origem]   |

**Exemplo — sucesso**

```http
[MÉTODO] /api/rota?param=valor
```

```text
{
  "[campo]": "[valor realista]"
}
```

**Exemplo — [cenário alternativo, por exemplo, nenhuma correspondência]**

```http
[MÉTODO] /api/rota?param=valor
```

```text
{
  "[corpo]": []
}
```

> [Nota sobre comportamento no frontend/cliente, se aplicável.]

**Exemplo — [cenário de erro]**

```http
[MÉTODO] /api/rota
```

```text
{
  "error": {
    "code": "[codigo]",
    "message": "[mensagem]"
  }
}
```

[Repita o padrão acima para cada endpoint, separando-os com `---`.]

---

## Pontos de integração

[Inclua apenas se a funcionalidade exigir integrações externas:

- Serviços ou APIs externos
- Requisitos de autenticação
- Estratégia de tratamento de erros]

## Abordagem de testes

Defina a estratégia de testes aplicável à funcionalidade e nomeie cada caso com um identificador estável. Use `TU-*` para testes de unidade, `TI-*` para testes de integração e `E2E-*` para testes E2E. Associe cada caso aos critérios de aceitação (`CA-*`) que ele verifica. Registre como não aplicável qualquer camada que não faça sentido para a solução.

### Testes de unidade (se aplicável)

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
|----|-----------------------|------------------------|--------------------|
| TU-01 | [nome do caso de teste] | [CA-01] | [resultado esperado] |

[Detalhe a estratégia de testes de unidade:

- Principais componentes a serem testados
- Use mocks somente para serviços externos
- Cenários de teste críticos]

### Testes de integração (se aplicável)

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
|----|-----------------------|------------------------|--------------------|
| TI-01 | [nome do caso de teste] | [CA-01] | [resultado esperado] |

[Se necessário, detalhe:

- Componentes a serem testados em conjunto
- Requisitos de dados de teste]

### Testes E2E (se aplicável)

| ID | Nome do caso de teste | Critérios de aceitação | Resultado esperado |
|----|-----------------------|------------------------|--------------------|
| E2E-01 | [nome do caso de teste] | [CA-01] | [resultado esperado] |

[Se necessário, descreva como testar a interface junto com os serviços envolvidos usando a ferramenta de navegador disponível no ambiente.]

## Sequenciamento do desenvolvimento

### Ordem de construção

[Descreva a sequência de implementação:

1. Primeiro componente/funcionalidade (por que primeiro)
2. Segundo componente/funcionalidade (dependências)
3. Demais componentes
4. Integração e testes]

### Dependências técnicas

[Liste os bloqueadores e as dependências técnicas:

- Infraestrutura necessária
- Disponibilidade de serviços externos]

## Monitoramento e observabilidade

[Descreva a abordagem de monitoramento usando a infraestrutura existente do projeto:

- Métricas ou health checks a expor
- Principais eventos a registrar e respectivos níveis]

## Considerações técnicas

### Principais decisões

[Registre as principais decisões técnicas:

- Escolha da abordagem e justificativa
- Trade-offs considerados
- Alternativas descartadas e os motivos]

### Riscos conhecidos

[Liste os riscos técnicos:

- Desafios potenciais
- Abordagens de mitigação
- Áreas que precisam de pesquisa]

### Conformidade com o AGENTS.md e as rules

[Confirme a leitura do `AGENTS.md` e de todas as rules em `.agents/rules/`. Registre as restrições e decisões relevantes para esta especificação.]

### Conformidade com skills

[Liste somente as skills do projeto (`.agents/skills`) aplicáveis a esta especificação.]

### Arquivos relevantes e dependentes

[Liste os arquivos relevantes e dependentes.]
