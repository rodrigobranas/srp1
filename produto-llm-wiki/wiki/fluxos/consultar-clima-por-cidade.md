---
type: Workflow
title: Consultar clima por cidade
description: Sequência especificada para buscar uma localidade, consultar o clima e recuperar-se de resultados ausentes ou falhas.
tags: [painel-de-clima, fluxo, consulta]
generated:
  by: openai-codex/1.0
  at: 2026-10-01T11:12:09-03:00
status: draft
sources:
  - id: prd-painel-de-clima
    resource: ../../raw/painel-de-clima/prd.md
    title: Documento de Requisitos do Produto (PRD)
  - id: prd-alternancia-unidade
    resource: ../../raw/alternancia-unidade/prd.md
    title: PRD de alternância da unidade de temperatura
  - id: prd-escolha-tema
    resource: ../../raw/escolha-tema/prd.md
    title: PRD de escolha de tema
---

# Fluxo principal

O PRD especifica a seguinte sequência para a capacidade do [Painel de clima](/capacidades/painel-de-clima.md):[^prd-painel-de-clima]

1. A pessoa informa uma cidade e inicia a busca pelo botão ou pela tecla Enter.
2. O sistema remove espaços excedentes e rejeita uma entrada vazia com orientação para preencher a cidade.
3. O backend resolve o nome. Se houver localidades homônimas, o painel apresenta região e país para a pessoa escolher a correta.
4. Após a escolha, o backend consulta condições atuais e previsão diária para a localidade selecionada.
5. O painel apresenta os dados atuais e as sete datas locais, com atribuição à Open-Meteo.
6. A pessoa pode pesquisar outra cidade.

O frontend deve chamar apenas o backend da aplicação. Os papéis da [integração Open-Meteo](/integracoes/open-meteo.md) e as restrições de dados da [localização](/restricoes/privacidade-da-localizacao.md) limitam as chamadas externas e o atalho geográfico.

# Caminhos alternativos e recuperação

- **Entrada vazia:** informar que a cidade deve ser preenchida. CA-01 diz que dados de consulta anterior não devem ser mostrados como resultado da nova busca vazia.
- **Localidade não encontrada:** informar que não houve correspondência e manter o campo disponível para uma nova busca.
- **Falha ou demora do serviço:** apresentar mensagem compreensível, sem detalhes técnicos, e uma forma de tentar novamente.
- **Falha após um resultado anterior:** a experiência especificada diz que uma falha não deve substituir uma busca válida já exibida por conteúdo quebrado. CA-01, por sua vez, impede tratar dados antigos como resultado de uma nova busca vazia. O PRD não define como conciliar visualmente a retenção do resultado anterior e o estado de erro de uma nova busca válida.
- **Localização do navegador:** se incluída, só pode ser iniciada por ação do usuário e depende de permissão. Em caso de recusa ou falha, o fluxo digitado segue disponível. RF10 deixa em aberto se a localização sugere uma cidade ou origina diretamente a consulta.

O PRD também exige operação por teclado, foco visível e comunicação dos estados a tecnologias assistivas (CA-10), conforme a [capacidade](/capacidades/painel-de-clima.md).

# Unidade durante novas buscas

O PRD de alternância especifica que a unidade selecionada permanece ativa ao consultar outra cidade na mesma página. A busca da cidade nova realiza a consulta normal; a troca da unidade, por si só, não faz uma chamada meteorológica adicional. Consulte [Alternância de unidade de temperatura](/capacidades/alternancia-de-unidade-de-temperatura.md).[^prd-alternancia-unidade]

# Tema durante a consulta

Como a associação do PRD de tema ao Painel de clima é inferida pelo contexto deste bundle, sua aplicação ao fluxo de consulta também é contextual. Nesse contexto, alternar o tema durante uma busca deve preservar o conteúdo e o estado atuais, sem recarregar, navegar para outra tela ou chamar o backend. A escolha permanece após recarga na mesma aba e é descartada ao fechar essa aba; outra aba começa no tema escuro. Consulte [Alternância de tema visual](/capacidades/alternancia-de-tema-visual.md).[^prd-escolha-tema]

[^prd-painel-de-clima]: [PRD original](../../raw/painel-de-clima/prd.md)
[^prd-alternancia-unidade]: [PRD de alternância da unidade de temperatura](../../raw/alternancia-unidade/prd.md)
[^prd-escolha-tema]: [PRD de escolha de tema](../../raw/escolha-tema/prd.md)
