---
type: Source Summary
title: PRD de escolha de tema
description: Requisitos para alternar a interface entre os temas escuro e claro com uma escolha temporária por aba.
resource: ../../raw/escolha-tema/prd.md
tags: [painel-de-clima, tema, prd]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:12:09-03:00
status: draft
sources:
  - id: prd-escolha-tema
    resource: ../../raw/escolha-tema/prd.md
    title: Documento de Requisitos do Produto (PRD)
---

# Visão geral

O PRD especifica um botão no cabeçalho para alternar toda a interface visível entre tema escuro e claro. Uma nova aba começa sempre no tema escuro, mesmo que o sistema operacional prefira outro tema. A escolha manual dura pela vida daquela aba, inclusive após recarregar a página, e é descartada ao fechar a aba. A funcionalidade pertence ao frontend e não exige conta.[^prd-escolha-tema]

O documento especifica requisitos de produto; não confirma implementação. A fonte não informa versão, status, data de publicação ou responsável. Ela menciona apenas “o frontend” e não nomeia o produto ou a tela.

# Requisitos registrados

- **Alternância (RF1–RF3):** botão no cabeçalho; cada ativação aplica o tema oposto sem recarregar ou mudar de tela; o botão comunica acessivelmente sua ação e estado, sem depender apenas de ícone ou cor.
- **Tema inicial e duração (RF4–RF6):** iniciar em escuro quando a aba ainda não tem escolha manual; manter a escolha na aba atual após recarga; novas abas começam em escuro e não herdam a escolha de outra aba.
- **Acessibilidade e leitura (RF7–RF8):** foco visível, operação por Enter e Espaço, e distinção de textos, controles e indicadores nos dois temas sem depender somente de cor ou ícone.
- **Critérios de aceitação (CA-01–CA-09):** cobrem tema escuro inicial, aplicação imediata a toda a interface, preservação do estado e conteúdo atuais, persistência após recarga na mesma aba, descarte ao fechar e abrir nova aba, teclado, comunicação acessível, legibilidade e ausência de chamadas ao backend.
- **Histórias (US1–US4):** preferência entre temas, continuidade do fluxo sem recarga, duração durante a aba e operação acessível.

# Limites e questões abertas

O tema do sistema operacional não deve substituir o tema escuro inicial. A escolha não é sincronizada entre abas, sessões, dispositivos ou contas, não é salva no perfil nem enviada ao backend. Temas adicionais, personalização de paletas e mudanças de comportamento de outras funcionalidades estão fora do escopo.

O PRD requer que os elementos continuem distinguíveis e legíveis, mas não define paleta, tokens de cor ou critérios numéricos de contraste. Também não especifica o mecanismo técnico para manter a escolha após recarga sem compartilhá-la com outra aba; essa implementação permanece em aberto.

Esta especificação foi relacionada ao [Painel de clima](/capacidades/painel-de-clima.md) e ao fluxo de [consulta por cidade](/fluxos/consultar-clima-por-cidade.md) pelo contexto deste bundle; o PRD não os nomeia diretamente. Os PRDs de clima e de alternância de unidade não especificam um tema visual, portanto não há conflito de escopo identificado.

[^prd-escolha-tema]: [PRD original](../../raw/escolha-tema/prd.md)
