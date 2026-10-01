# Relatório de QA — Painel de clima

## Resumo
- Data: 2026-10-01
- Status: APROVADO
- Total de critérios de aceitação: 12
- Critérios aprovados: 12 (11 verificados; validação estatística de CA-12 dispensada pelo usuário)
- Bugs encontrados: 2 (ambos corrigidos)

## Ambiente
- Backend: http://127.0.0.1:3000, iniciado com PORT=3000 npm run dev (sessão 33361).
- Frontend: http://127.0.0.1:5100, iniciado com VITE_API_BASE_URL=http://127.0.0.1:3000 npm run dev -- --host 127.0.0.1 --port 5100 (sessão 53990).
- As portas foram verificadas como livres antes do início. O backend consultou a Open-Meteo nos fluxos manuais. Não há banco ou serviço adicional.
- Os dois processos foram encerrados ao final; as portas 3000 e 5100 foram verificadas novamente como livres.

## Critérios de aceitação verificados
| ID | Critério de aceitação | Casos de teste | Status | Evidência |
|----|-----------------------|----------------|--------|-----------|
| CA-01 | Entrada vazia ou só com espaços mostra orientação e remove o resultado anterior. | TU-01, TU-08, TI-01, E2E-02 | PASSOU | [Entrada vazia](evidences/05-entrada-vazia-mobile.png) |
| CA-02 | Resultado exibe cidade, país, temperatura, condição, sensação térmica, umidade, vento e horário local. | TU-03, TU-05, TI-02, TI-04, E2E-01 | PASSOU | [Clima selecionado](evidences/02-clima-selecionado-desktop.png) |
| CA-03 | Exibe hoje e os seis dias seguintes no fuso local, com condição e mínima/máxima. | TU-03, TU-05, TI-02, TI-04, E2E-01 | PASSOU | [Clima selecionado](evidences/02-clima-selecionado-desktop.png) |
| CA-04 | Resultados homônimos informam região e país antes da seleção. | TU-02, TI-01, TI-04, E2E-01 | PASSOU | [Resultados homônimos](evidences/02-clima-selecionado-desktop.png) |
| CA-05 | Previsão usa as coordenadas da localidade selecionada. | TU-03, TU-08, TI-02, TI-04, E2E-01 | PASSOU | [Resultado Springfield, Missouri](evidences/02-clima-selecionado-desktop.png) |
| CA-06 | Localidade inexistente informa o resultado e mantém a busca disponível. | TU-02, TI-01, E2E-02 | PASSOU | [Localidade não encontrada](evidences/04-nao-encontrada-desktop.png) |
| CA-07 | Falha do serviço mostra erro compreensível e permite nova tentativa. | TU-04, TU-08, TI-03, E2E-03 | PASSOU | [Serviço indisponível](evidences/06-servico-indisponivel-mobile.png) |
| CA-08 | Geolocalização só é solicitada por ação explícita; recusa mantém a busca manual. | TU-01, TU-07, TI-05, E2E-04 | PASSOU | [Permissão negada](evidences/07-localizacao-negada-mobile.png), [permissão concedida](evidences/12-localizacao-permissao-browser.png) |
| CA-09 | O navegador chama geocodificação e clima somente no backend local. | TU-06, TI-04, TI-05, E2E-01, E2E-04 | PASSOU | [Requisições do navegador](evidences/15-rede-backend-local.log) |
| CA-10 | Controles e estados são acessíveis por teclado e tecnologia assistiva. | TU-07, TI-04, TI-05, E2E-04, E2E-05, E2E-07 | PASSOU | [Foco de teclado](evidences/09-foco-de-teclado-mobile.png), [estado de carregamento](evidences/13-carregando-desktop.png) |
| CA-11 | Atribuição à Open-Meteo fica visível junto ao resultado. | TI-04, E2E-01 | PASSOU | [Atribuição visível](evidences/02-clima-selecionado-desktop.png) |
| CA-12 | Pelo menos 95% das consultas válidas exibem resultados em até 5 segundos. | TI-06, E2E-01 | DISPENSADO PELO USUÁRIO | A validação estatística do p95 não foi exigida; a instrumentação continua validada em TI-06. |

## Testes E2E executados
| ID | Fluxo | Resultado | Observações |
|----|-------|-----------|-------------|
| E2E-01 | Buscar Springfield por Enter, escolher Springfield, Missouri, e verificar dados atuais, sete dias, atribuição e chamadas de rede. | PASSOU | O POST usou latitude 37.21533 e longitude -93.29824, correspondentes à opção escolhida. Nenhuma chamada do navegador foi feita a Open-Meteo ou GeoNames. Evidência: [resultado](evidences/02-clima-selecionado-desktop.png), [rede](evidences/15-rede-backend-local.log). |
| E2E-02 | Enviar espaços após uma consulta válida e pesquisar uma localidade inexistente. | PASSOU | A consulta vazia removeu os dados anteriores; a busca inexistente informou que não houve correspondência e deixou o campo utilizável. Evidências: [vazio](evidences/05-entrada-vazia-mobile.png), [sem correspondência](evidences/04-nao-encontrada-desktop.png). |
| E2E-03 | Interromper o backend, pesquisar Toronto, restaurar o backend e usar “Tentar novamente”. | PASSOU | A falha de rede mostrou mensagem sem detalhe técnico. Depois da recuperação, a busca e a seleção de Toronto, Ontário, concluíram normalmente. Evidência: [erro recuperável](evidences/06-servico-indisponivel-mobile.png). |
| E2E-04 | Negar localização e continuar com busca manual; depois permitir localização e consultar por coordenadas. | PASSOU | A recusa preservou a busca manual. Com permissão de navegador concedida no contexto Playwright, a API nativa foi acionada somente após clique e gerou apenas POST /weather; a tela mostrou “Sua localização”. Evidências: [recusa](evidences/07-localizacao-negada-mobile.png), [resultado por localização](evidences/12-localizacao-permissao-browser.png). |
| E2E-05 | Usar Tab, Enter e Escape; conferir foco, nomes acessíveis e anúncios de erro e resultado. | PASSOU | O foco por teclado ficou visível com contorno de 4 px. O campo está associado ao rótulo “Cidade”; botões têm nomes descritivos. Erros usam alert; carregamento e sucesso usam status. Escape não interrompeu a página nem alterou os dados. |
| E2E-06 | Conferir dados nos breakpoints 320, 390, 768, 1280 e 1440 px. | PASSOU | Sete dias visíveis em todos os tamanhos, com grade adaptada e sem overflow horizontal. Evidências: [320 px](evidences/10-clima-mobile-320.png), [390 px](evidences/03-clima-selecionado-mobile.png), [768 px](evidences/11-clima-tablet-768.png), [desktop](evidences/02-clima-selecionado-desktop.png). |
| E2E-07 | Atrasar a resposta da busca para verificar o estado de carregamento. | PASSOU | Mensagem “Buscando as informações do clima…” ficou visível e exposta como status durante a espera. Evidência: [carregamento](evidences/13-carregando-desktop.png). |
| E2E-08 | Verificar a correção do ícone da aba em navegador e servidor local. | PASSOU | GET /favicon.svg retornou 200; uma aba nova não registrou erros de console. Evidência: [console final](evidences/14-console-final.log). |

Os fluxos de interface foram executados manualmente no Playwright. Não foram adicionados testes E2E automatizados, conforme .agents/rules/tests.md.

## Testes automatizados e cobertura
| Camada | ID | Resultado | Validação/comando | Observações |
|--------|----|-----------|-------------------|------------|
| Unidade | TU-01 | PASSOU | backend npm run test:coverage | Valida consultas vazias/curtas e coordenadas fora do limite. |
| Unidade | TU-02 | PASSOU | backend npm run test:coverage | Normaliza localidades e campos ausentes. |
| Unidade | TU-03 | PASSOU | backend npm run test:coverage | Normaliza condições atuais e sete datas locais. |
| Unidade | TU-04 | PASSOU | backend npm run test:coverage | Classifica timeout, falhas HTTP e payload inválido. |
| Unidade | TU-05 | PASSOU | frontend npm run test:coverage | Traduz códigos WMO conhecidos e desconhecidos. |
| Unidade | TU-06 | PASSOU | frontend npm run test:coverage | Confirma que o cliente usa somente base e rotas do backend. |
| Unidade | TU-07 | PASSOU | frontend npm run test:coverage | Confirma solicitação explícita de geolocalização e recuperação após recusa. |
| Unidade | TU-08 | PASSOU | frontend npm run test:coverage | Impede resposta antiga de substituir a consulta mais recente. |
| Integração | TI-01 | PASSOU | backend npm run test:coverage | Busca localidades, resultado vazio e query inválida. |
| Integração | TI-02 | PASSOU | backend npm run test:coverage | Consulta por coordenadas e serializa sete dias. |
| Integração | TI-03 | PASSOU | backend npm run test:coverage | Erros upstream viram respostas estáveis sem detalhes do provedor. |
| Integração | TI-04 | PASSOU | frontend npm run test:coverage | Integra busca, homônimos, seleção e renderização acessível. |
| Integração | TI-05 | PASSOU | frontend npm run test:coverage | Usa coordenadas do navegador sem geocodificação reversa. |
| Integração | TI-06 | PASSOU | backend npm run test:coverage | Registra duração e resultado sem consulta ou coordenadas. |

- Backend: 12 arquivos e 83 testes passaram. Cobertura: statements 98,1%, branches 95,65%, funções 100%, linhas 99,27%.
- Frontend: 20 arquivos e 44 testes passaram. Cobertura: statements 97,97%, branches 89,58%, funções 98,43%, linhas 99,36%.
- Lint, typecheck e build passaram nos dois projetos. O lint frontend manteve um aviso preexistente de Fast Refresh em frontend/src/components/ui/button.tsx:51; nenhum erro de lint.
- CA-12: validação estatística dispensada pelo usuário. TI-06 confirmou a instrumentação de duração e resultado; nenhum p95 é declarado neste relatório.

## Acessibilidade
- [x] Navegação por teclado: Tab e Enter operaram a busca; Escape foi verificado; foco visível no controle ativo.
- [x] Controles interativos com nomes acessíveis, incluindo botões de busca, localização e seleção de cidade.
- [x] Imagens: não há imagens raster na tela; o SVG decorativo do botão está marcado como oculto para tecnologia assistiva.
- [x] Contraste: amostras das cores principais passaram WCAG AA; menor proporção medida foi 4,76:1 para texto de data da previsão.
- [x] Formulário: campo Cidade tem rótulo associado e referência ao estado de feedback.
- [x] Erros: mensagens compreensíveis usam alert; carregamento e resultado usam regiões status com anúncio polite.
- [x] Fontes: controles e texto principal usam 14–16 px; atribuição secundária usa 12 px com alto contraste.
- [x] Condições e temperaturas são apresentadas em texto; cor e ícone não são o único meio de comunicar informação.

## Bugs encontrados e corrigidos
| ID | Descrição | Severidade | Status | Correção | Teste de regressão | Evidência |
|----|-----------|------------|--------|----------|--------------------|-----------|
| BUG-01 | Resultado bem-sucedido não tinha anúncio dedicado para tecnologia assistiva. | Média | Corrigido | WeatherView agora anuncia cidade e país em status aria-live polite e atômico. | A asserção no teste de integração WeatherView.city.integration.test.tsx falhou antes da correção e passou depois; incluída na suíte frontend. | [resultado acessível](evidences/02-clima-selecionado-desktop.png) |
| BUG-02 | O navegador solicitava /favicon.ico e recebia 404. | Baixa | Corrigido | frontend/index.html declara frontend/public/favicon.svg, adicionado ao projeto. | frontend/src/tests/favicon.test.ts verifica a referência e a existência do SVG; GET /favicon.svg retornou 200. | [console sem erros](evidences/14-console-final.log) |

## Conclusão
Os critérios CA-01 a CA-11 passaram e os dois defeitos encontrados foram corrigidos com regressões verificadas. A validação estatística de CA-12 foi dispensada pelo usuário, então o QA está APROVADO conforme essa dispensa. O p95 não foi medido nem é declarado neste relatório.
