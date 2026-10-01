---
type: Product Capability
title: Alternância de tema visual
description: A interface alterna entre tema escuro e claro e mantém a escolha manual somente na aba atual, inclusive após recarga.
tags: [painel-de-clima, tema, acessibilidade]
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

O PRD especifica um botão no cabeçalho para alternar entre tema escuro e claro em toda a interface visível. A mudança ocorre sem recarregar a página ou navegar para outra tela, preservando a interação em curso. A capacidade pertence ao frontend e não confirma comportamento já implementado.[^prd-escolha-tema]

A fonte não nomeia o produto nem a tela. A associação desta capacidade ao Painel de clima decorre do contexto deste bundle, não de uma afirmação explícita no PRD.

# Tema inicial e duração

- Uma nova aba começa no tema escuro, independentemente da preferência do sistema operacional.
- Uma escolha manual permanece ativa naquela aba, inclusive após recarregar a página.
- Ao fechar a aba, a escolha é descartada; uma nova aba começa no tema escuro e não herda a escolha de outra aba.
- A escolha não é sincronizada entre abas, sessões, dispositivos ou contas, não é guardada em perfil e não é enviada ao backend.

O PRD especifica duração limitada à aba, mas não define o mecanismo técnico de persistência entre recargas.

# Controle e acessibilidade

O botão fica em posição previsível no cabeçalho, também em telas móveis. Seu rótulo acessível identifica a ação disponível e seu estado; um ícone pode complementar o rótulo, mas não substituí-lo. O controle recebe foco visível e responde a Enter e Espaço. A tecnologia assistiva deve conseguir identificar que o botão alterna o tema e qual ação está disponível.

Todo o conteúdo visível, incluindo textos, controles e indicadores, deve continuar distinguível em ambos os temas. A cor ou o ícone não pode ser a única forma de comunicar informação. A troca não deve ocultar conteúdo nem interromper a interação atual. A fonte não define paleta ou critérios numéricos de contraste.

# Critérios de aceitação

- **CA-01:** nova aba sem escolha manual começa no tema escuro.
- **CA-02 e CA-03:** o botão muda toda a interface sem recarga ou navegação e preserva o estado e o conteúdo atuais.
- **CA-04 e CA-05:** a escolha permanece após recarga na mesma aba; fechar a aba e abrir outra restaura o tema escuro.
- **CA-06 e CA-07:** teclado e tecnologia assistiva identificam o controle, seu comportamento e a ação disponível.
- **CA-08:** textos, controles e indicadores permanecem distinguíveis nos dois temas sem depender apenas de cor ou ícone.
- **CA-09:** alternar o tema não exige chamada ao backend ou resposta da API.

Os requisitos RF1–RF8 estão sintetizados em [PRD de escolha de tema](/fontes/prd-escolha-tema.md). Esta capacidade integra a interface geral do [Painel de clima](/capacidades/painel-de-clima.md).

[^prd-escolha-tema]: [PRD original](../../raw/escolha-tema/prd.md)
