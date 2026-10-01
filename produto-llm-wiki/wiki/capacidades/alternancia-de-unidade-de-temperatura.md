---
type: Product Capability
title: Alternância de unidade de temperatura
description: O painel reapresenta as temperaturas carregadas em Celsius ou Fahrenheit, mantendo Celsius como padrão de cada nova visita.
tags: [painel-de-clima, temperatura, unidade]
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

O PRD especifica um botão no topo do [Painel de clima](/capacidades/painel-de-clima.md) para alternar as temperaturas exibidas entre Celsius e Fahrenheit. Celsius é a unidade inicial em cada nova visita ou recarga; a escolha permanece durante a página atual, inclusive ao pesquisar outras cidades. Esta é uma especificação de produto, sem confirmação de implementação.[^prd-alternancia-unidade]

Em 2026-10-01, o usuário orientou a adotar esta especificação como escopo atual: o painel agora oferece ambas as unidades. O PRD anterior do painel registrava a alternância como fora de escopo; essa afirmação fica preservada como histórico da fonte anterior, não como limite vigente. A [resolução entre as fontes](/fontes/prd-alternancia-unidade.md) registra essa decisão.

# Comportamento especificado

- O botão indica a unidade ativa e seu nome acessível informa a unidade para a qual a ação alternará. Deve ser operável por teclado, ter foco visível e comunicar seu estado a tecnologias assistivas.
- Alternar a unidade atualiza a temperatura atual, a sensação térmica e as temperaturas mínimas e máximas de cada dia da previsão exibida.
- Cada temperatura mostra explicitamente °C ou °F. Valores indisponíveis continuam identificados como indisponíveis; a alternância não pode gerar `NaN`, infinito ou outro valor inválido.
- Umidade, velocidade do vento, condições meteorológicas e outros dados que não sejam temperatura permanecem inalterados.
- A troca usa os dados já carregados no frontend; não recarrega a página, não altera backend, contrato de API ou unidade pedida ao provedor e não inicia nova consulta meteorológica.
- Uma nova busca na mesma página conserva a unidade selecionada. Uma recarga, nova visita ou outro dispositivo começa em Celsius; a preferência não é sincronizada entre visitas, contas ou dispositivos.
- A atualização deve ocorrer em até um segundo. Os valores seguem formatação pt-BR, com até uma casa decimal e sem zeros finais desnecessários.

# Conversão

O PRD define as relações:

- Celsius para Fahrenheit: `°F = (°C × 1,8) + 32`.
- Fahrenheit para Celsius: `°C = (°F − 32) ÷ 1,8`.

A resposta meteorológica é especificada em Celsius. Ao voltar para Celsius, o painel reapresenta os valores Celsius originais da resposta, sem converter de volta valores Fahrenheit arredondados. Isso evita acumular erro durante alternâncias sucessivas. O PRD cita as [equações do NIST](https://www.nist.gov/system/files/documents/2019/11/19/00-20-hb44-final11152019pdf.pdf).

Exemplos de aceitação: 0 °C deve resultar em 32 °F; 100 °C em 212 °F; 23,4 °C em 74,1 °F; 25 °C em 77 °F. O valor 77 não deve manter zero decimal final.

# Critérios de aceitação

- **CA-01 e CA-08:** nova visita ou recarga inicia em Celsius.
- **CA-02 e CA-05:** Fahrenheit atualiza todos os campos de temperatura, incluindo sensação térmica e mínimas e máximas dos sete dias; umidade e vento permanecem iguais.
- **CA-03, CA-04 e CA-11:** conversões de referência, retorno aos Celsius originais sem erro acumulado e formatação numérica esperada.
- **CA-06:** temperaturas indisponíveis permanecem identificadas sem valores inválidos.
- **CA-07:** Fahrenheit persiste ao pesquisar outra cidade na mesma aba e a alternância não acrescenta uma requisição meteorológica.
- **CA-09:** controle operável por teclado e acessivelmente identificado.
- **CA-10:** atualização em até um segundo, sem recarga ou chamada adicional ao backend.

Os requisitos RF1–RF13 estão agrupados e descritos em [PRD de alternância da unidade de temperatura](/fontes/prd-alternancia-unidade.md). Essa funcionalidade integra o escopo maior do [Painel de clima](/capacidades/painel-de-clima.md).

[^prd-alternancia-unidade]: [PRD original](../../raw/alternancia-unidade/prd.md)
