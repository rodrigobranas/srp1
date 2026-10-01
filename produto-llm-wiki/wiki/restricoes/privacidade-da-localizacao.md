---
type: Constraint
title: Privacidade da localização no painel de clima
description: A localização do navegador é opcional, depende de ação e permissão e não deve ser armazenada pelo produto após a consulta.
tags: [painel-de-clima, privacidade, localização]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:07:18-03:00
status: draft
sources:
  - id: prd-painel-de-clima
    resource: ../../raw/painel-de-clima/prd.md
    title: Documento de Requisitos do Produto (PRD)
---

# Regra especificada

O PRD permite que o painel use localização do navegador somente como atalho opcional. O usuário deve iniciar a ação e conceder a permissão solicitada; o produto não pode solicitar nem usar localização sem essa ação. Se a permissão for negada ou a localização não estiver disponível, a busca manual permanece funcional (RF10–RF11, CA-08).[^prd-painel-de-clima]

A cidade digitada ou as coordenadas usadas na consulta são enviadas ao backend e ao provedor para obter o clima. Como o frontend deve conversar exclusivamente com o backend, a interpretação operacional é que o valor fornecido pelo usuário chega ao backend e o backend o encaminha ao provedor quando necessário (RF5). O PRD declara que a localização não deve ser armazenada pelo produto após a consulta.

# Limites e questões abertas

- A localização não é obrigatória nem deve ser obtida automaticamente.
- A busca digitada é o fluxo principal e deve continuar disponível após recusa ou falha de geolocalização.
- O PRD não decide se as coordenadas apenas sugerem uma cidade ou iniciam a consulta diretamente.
- A fonte não detalha como a regra de não armazenamento se aplica a logs, telemetria, caches ou retenção operacional. Isso precisa ser especificado sem transformar a ausência de detalhes em autorização para persistência.

Esta restrição afeta o [fluxo de consulta](/fluxos/consultar-clima-por-cidade.md) e a integração do [backend com a Open-Meteo](/integracoes/open-meteo.md). O estado da funcionalidade em produção não foi confirmado.

[^prd-painel-de-clima]: [PRD original](../../raw/painel-de-clima/prd.md)
