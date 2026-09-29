---
name: pr
description: Cria ou prepara pull requests seguindo o padrão obrigatório de título e descrição em português do Brasil. Use ao abrir ou preparar uma PR.
---

# Pull Request

Use esta skill sempre que for abrir ou preparar uma pull request.

## Idioma

Escreva o título e a descrição integralmente em português do Brasil. Preserve nomes próprios, caminhos, comandos, identificadores técnicos e termos de código quando necessário.

## Título

Use exatamente o formato abaixo:

```text
<tipo>: <resumo conciso da mudança>
```

O `<tipo>` deve ser um dos seguintes, em letras minúsculas:

- `feat`: inclusão de funcionalidade.
- `fix`: correção de defeito.
- `docs`: alteração exclusiva de documentação.
- `chore`: manutenção, configuração, dependências ou outras tarefas sem funcionalidade ou correção de defeito.

Defina o tipo e o resumo a partir das mudanças efetivamente realizadas nos commits e no diff da PR. Quando houver mais de um tipo de mudança, use o que representa a entrega principal. Não use tipos fora dessa lista.

Exemplos:

```text
feat: adiciona alternância de tema
fix: corrige atualização da previsão do tempo
docs: atualiza instruções de execução do projeto
chore: atualiza configuração do ESLint
```

## Descrição

Descreva com clareza todas as mudanças incluídas na PR. Organize a descrição em uma seção `## Alterações` e use uma lista para registrar cada alteração relevante, incluindo mudanças de comportamento, componentes, serviços, documentação, configuração, dependências e testes quando existirem.

Baseie a descrição no diff e nos commits: não omita mudanças relevantes, não inclua trabalho que não esteja na PR e não faça afirmações não verificadas. Se validações tiverem sido executadas, registre-as em `## Validações` com os comandos e respectivos resultados.
