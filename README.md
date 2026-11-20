# bolsoJovem

O Bolso Jovem é um organizador financeiro desenvolvido como projeto final do curso de Front-end do PROA. Ele foi pensado para jovens que querem acompanhar os pequenos gastos do dia a dia e entender para onde vai o dinheiro.

## O que já foi desenvolvido

- Tela inicial com o menu Início, Meus Registros e Jornada Financeira.
- Cartão interativo que gira ao clicar em “+ Descubra mais aqui!”.
- Estrutura inicial da tela Meus Registros, com Header e Footer integrados.
- Estrutura dos três cards financeiros: Saldo Disponível, Receitas do Mês e Despesas do Mês.

## Funcionalidades planejadas

- Registrar, editar e excluir receitas e despesas.
- Pesquisar movimentações por descrição, valor ou categoria.
- Filtrar registros por tipo e categoria.
- Consultar saldo, resumo de receitas e despesas e gráficos mensais e anuais.
- Atualizar automaticamente os valores dos cards conforme as movimentações cadastradas.
- Organizar os registros por meio de paginação.

## Ideia para uma versão futura

Usar o WhatsApp com IA para registrar gastos e consultar informações financeiras. A integração é uma proposta para apresentação.

## Tecnologias

HTML, CSS e JavaScript.

## Estrutura do projeto

- `index.html` — página de entrada do site.
- `pages/meusRegistros.html` — estrutura da tela de movimentações financeiras.
- `components/header.html` e `components/footer.html` — componentes de navegação reutilizados nas páginas.
- `css/variables.css` — variáveis de cores e fontes.
- `css/components.css` — estilos do Header, Footer e componentes compartilhados.
- `[caminho do CSS]` — estilos específicos das páginas.
- `[caminho do JavaScript]` — funcionalidades e interações do projeto.
- `[caminho das imagens]` — imagens e ícones usados na interface.

## Como a tela inicial funciona

O HTML contém o botão “+ Descubra mais aqui!” e as duas faces do cartão. Ao clicar no botão, o JavaScript muda o estado do cartão, e o CSS aplica a rotação que revela o verso.

Para verificar esse comportamento, abra a tela inicial e clique no botão. O resultado esperado é que o cartão gire e mostre o verso.

## Como a tela Meus Registros funciona

A tela está sendo desenvolvida para apresentar as movimentações financeiras do usuário. Sua estrutura conta com três cards que exibem o saldo disponível, o total de receitas e o total de despesas do mês.

Os elementos que terão seus valores atualizados possuem identificadores (`id`) para permitir futuras alterações com JavaScript. A tela também está sendo preparada para receber uma barra de pesquisa, filtros e uma tabela com as movimentações financeiras.

## Como o Meu painel funciona

O Meu painel reúne o resumo financeiro do usuário em uma única página. O HTML define a estrutura, o CSS cuida da aparência e o JavaScript guarda as transações e calcula o que aparece em cada bloco. Quando uma transação muda, os blocos são atualizados sem recarregar a página.

- Cartões de resumo — somam receitas e despesas; o saldo é a receita menos a despesa, e a barra mostra o gasto sobre o limite do mês.
- Fluxo Semanal — os botões "Esta semana" e "Semana anterior" trocam os dados do gráfico, e a barra de maior valor fica em verde-limão.
- Últimos Gastos — as abas "Todos", "Receitas" e "Despesas" filtram a lista por tipo.
- Metas Financeiras — a barra de progresso mostra o valor atual dividido pelo total da meta.
- Jornada Financeira — mostra as missões concluídas e soma o XP de cada missão finalizada.
- Botões — "Adicionar Transação" abre um formulário e atualiza todos os blocos; "Ver Relatório", "Ver todas" e "Aprenda agora" levam às outras telas.

Para verificar esse comportamento, abra o Meu painel, alterne o período do gráfico, troque as abas de Últimos Gastos e adicione uma transação. O resultado esperado é que cada ação atualize os blocos relacionados.

## Equipe

Projeto desenvolvido pela equipe Bolso Jovem no PROA.

- Kailani Bittencourt — Product Owner (PO)
- Pedro Coelho - DEV. Front-End
- Gustavo Rentanero - DEV. Front-End
- Guilherme Romano - DEV. Front-End
- Vitoria - UX Design
