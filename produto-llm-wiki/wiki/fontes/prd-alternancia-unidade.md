---
type: Source Summary
title: PRD de alternância da unidade de temperatura
description: Requisitos para alternar localmente as temperaturas do painel de clima entre Celsius e Fahrenheit.
resource: ../../raw/alternancia-unidade/prd.md
tags: [painel-de-clima, temperatura, prd]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:10:02-03:00
status: draft
sources:
  - id: prd-alternancia-unidade
    resource: ../../raw/alternancia-unidade/prd.md
    title: Documento de Requisitos do Produto (PRD)
---

# Visão geral

Este PRD especifica um controle no topo do painel de clima para alternar a apresentação das temperaturas entre Celsius e Fahrenheit. A preferência vale enquanto a página estiver carregada, inclusive entre buscas de cidades; uma recarga ou nova visita começa em Celsius. A conversão usa os dados meteorológicos já carregados e não deve iniciar outra consulta. O PRD especifica requisitos, mas não confirma implementação.[^prd-alternancia-unidade]

# Requisitos registrados

- **Controle (RF1–RF3):** botão no topo, indicação da unidade ativa e nome acessível que comunica a unidade para a qual a ação alternará; ativação atualiza as temperaturas sem recarregar a página ou interromper a navegação.
- **Conversão e apresentação (RF4–RF8):** converter temperatura atual, sensação térmica e mínimas e máximas da previsão; seguir as fórmulas °F = (°C × 1,8) + 32 e °C = (°F − 32) ÷ 1,8; exibir °C ou °F em cada valor; manter temperaturas indisponíveis sem produzir valores inválidos; ao voltar para Celsius, usar os valores Celsius originais para evitar arredondamentos acumulados.
- **Duração e formato (RF9–RF13):** iniciar em Celsius em nova visita ou recarga, manter a seleção durante novas buscas na mesma página, não sincronizar a preferência entre visitas, contas ou dispositivos, não fazer nova consulta meteorológica para alternar e formatar números em pt-BR com até uma casa decimal e sem zeros finais desnecessários.
- **Critérios de aceite (CA-01–CA-11):** verificam padrão Celsius, alternância dos campos, conversões de referência (0 °C = 32 °F; 100 °C = 212 °F; 23,4 °C = 74,1 °F; 25 °C = 77 °F), retorno sem perda de precisão original, preservação de valores indisponíveis, unidade mantida entre buscas, recarga em Celsius, acessibilidade do controle e atualização em até um segundo sem chamada de rede adicional.

O PRD identifica visitantes sem conta como público e inclui US1–US4 para preferência de unidade, identificação dos símbolos, consistência entre buscas e acessibilidade por teclado ou tecnologia assistiva.

# Escopo e evidência

A alternância é especificada como comportamento de frontend sobre valores Celsius já carregados. Umidade, velocidade do vento e demais dados não relacionados à temperatura mantêm valores e unidades. O documento exclui alteração da unidade solicitada ou recebida pela API, mudança de backend ou contrato, novas escalas e persistência/sincronização da preferência entre visitas.

O PRD cita as [equações de conversão de temperatura do NIST](https://www.nist.gov/system/files/documents/2019/11/19/00-20-hb44-final11152019pdf.pdf); a referência é registrada conforme indicada pela fonte e não foi verificada independentemente nesta ingestão.

# Resolução de escopo

O PRD anterior do painel de clima declarava a troca de unidades fora do escopo e Celsius como única unidade da primeira versão. Em 2026-10-01, o usuário orientou a adotar esta nova especificação: o painel agora oferece Celsius e Fahrenheit. Assim, a exclusão do documento anterior permanece como registro histórico da fonte, mas não descreve o escopo atual da wiki. Nenhum dos PRDs informa versão, status ou data de publicação; a aplicabilidade atual decorre da orientação explícita do usuário, e não de uma inferência de que a fonte mais recente substitui a anterior.

Consulte [Painel de clima](/capacidades/painel-de-clima.md) para a capacidade integrada, [Alternância de unidade de temperatura](/capacidades/alternancia-de-unidade-de-temperatura.md) para os requisitos detalhados e o [resumo do PRD inicial](/fontes/prd-painel-de-clima.md) para o histórico da especificação Celsius-only.

[^prd-alternancia-unidade]: [PRD original](../../raw/alternancia-unidade/prd.md)
