// Meus Registros

// Dados de teste
const movimentacoes = [
  {
    id: 1,
    descricao: 'Bolsa Estágio',
    valor: 1200,
    tipo: 'receita',
    categoria: 'trabalho',
    data: '2026-11-25',
  },
  {
    id: 2,
    descricao: 'Almoço',
    valor: 35.5,
    tipo: 'despesa',
    categoria: 'alimentacao',
    data: '2026-11-24',
  },
  {
    id: 3,
    descricao: 'Passagem',
    valor: 10,
    tipo: 'despesa',
    categoria: 'transporte',
    data: '2026-11-23',
  },
];

// Elementos do HTML
const listaRegistros = document.getElementById('lista-registros');
const campoPesquisa = document.getElementById('pesquisa-registros');
const filtroCategoria = document.getElementById('categoria-registros');
const botoesFiltro = document.querySelectorAll('.filtros-tipo button');
const totalRegistros = document.getElementById('total-registros');
const botoesPaginacao = document.querySelector('.botoes-paginacao');

// Configurações
const registrosPorPagina = 7;
let paginaAtual = 1;
let filtroTipoAtual = 'todos';

// Nomes das categorias
const nomesCategorias = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  lazer: 'Lazer',
  educacao: 'Educação',
  familia: 'Família',
  trabalho: 'Trabalho',
  'renda-extra': 'Renda Extra',
};

// Formatação de moeda
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Formatação de data
function formatarData(data) {
  return data.split('-').reverse().join('/');
}

// Atualização dos Cards Financeiros
function atualizarCards() {
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();

  const movimentacoesDoMes = movimentacoes.filter(function (movimentacao) {
    const partesData = movimentacao.data.split('-');
    const ano = Number(partesData[0]);
    const mes = Number(partesData[1]);

    return mes === mesAtual && ano === anoAtual;
  });

  const receitas = movimentacoesDoMes.filter(function (movimentacao) {
    return movimentacao.tipo === 'receita';
  });

  const despesas = movimentacoesDoMes.filter(function (movimentacao) {
    return movimentacao.tipo === 'despesa';
  });

  const totalReceitas = receitas.reduce(function (total, movimentacao) {
    return total + movimentacao.valor;
  }, 0);

  const totalDespesas = despesas.reduce(function (total, movimentacao) {
    return total + movimentacao.valor;
  }, 0);

  const saldo = totalReceitas - totalDespesas;

  let porcentagemGasta = 0;

  if (totalReceitas > 0) {
    porcentagemGasta = (totalDespesas / totalReceitas) * 100;
  }

  document.getElementById('saldo-disponivel').textContent =
    formatarMoeda(saldo);

  document.getElementById('total-receitas').textContent =
    formatarMoeda(totalReceitas);

  document.getElementById('total-despesas').textContent =
    formatarMoeda(totalDespesas);

  document.getElementById('data-saldo').textContent =
    movimentacoesDoMes.length + ' movimentações neste mês';

  document.getElementById('entradas-receitas').textContent =
    receitas.length + (receitas.length === 1 ? ' entrada' : ' entradas');

  document.getElementById('comparativo-receitas').textContent =
    'Receitas cadastradas neste mês';

  document.getElementById('limite-despesa').textContent =
    'Despesas cadastradas neste mês';

  document.getElementById('porcentagem-despesa').textContent =
    porcentagemGasta.toFixed(1).replace('.', ',') + '% das receitas gastas';
}

// Pesquisa e Filtros
function obterMovimentacoesFiltradas() {
  const textoPesquisa = campoPesquisa.value.toLowerCase().trim();
  const categoriaSelecionada = filtroCategoria.value;

  return movimentacoes.filter(function (movimentacao) {
    const nomeCategoria =
      nomesCategorias[movimentacao.categoria] || movimentacao.categoria;

    const correspondeTipo =
      filtroTipoAtual === 'todos' || movimentacao.tipo === filtroTipoAtual;

    const correspondeCategoria =
      categoriaSelecionada === 'todas' ||
      movimentacao.categoria === categoriaSelecionada;

    const correspondePesquisa =
      movimentacao.descricao.toLowerCase().includes(textoPesquisa) ||
      nomeCategoria.toLowerCase().includes(textoPesquisa) ||
      String(movimentacao.valor).includes(textoPesquisa) ||
      formatarMoeda(movimentacao.valor).toLowerCase().includes(textoPesquisa);

    return correspondeTipo && correspondeCategoria && correspondePesquisa;
  });
}

// Renderização da Tabela
function renderizarTabela() {
  const movimentacoesFiltradas = obterMovimentacoesFiltradas();

  const totalPaginas = Math.ceil(
    movimentacoesFiltradas.length / registrosPorPagina,
  );

  if (paginaAtual > totalPaginas) {
    paginaAtual = Math.max(totalPaginas, 1);
  }

  const inicio = (paginaAtual - 1) * registrosPorPagina;
  const fim = inicio + registrosPorPagina;

  const movimentacoesPagina = movimentacoesFiltradas.slice(inicio, fim);

  listaRegistros.innerHTML = '';

  if (movimentacoesPagina.length === 0) {
    const linhaVazia = document.createElement('tr');
    linhaVazia.classList.add('registro-vazio');

    const mensagem = document.createElement('td');
    mensagem.colSpan = 6;
    mensagem.textContent = 'Nenhuma movimentação encontrada';

    linhaVazia.appendChild(mensagem);
    listaRegistros.appendChild(linhaVazia);
  }

  movimentacoesPagina.forEach(function (movimentacao) {
    const linha = document.createElement('tr');

    const data = document.createElement('td');
    data.textContent = formatarData(movimentacao.data);

    const descricao = document.createElement('td');
    descricao.textContent = movimentacao.descricao;

    const categoria = document.createElement('td');
    const nomeCategoria = document.createElement('span');

    nomeCategoria.textContent =
      nomesCategorias[movimentacao.categoria] || movimentacao.categoria;

    nomeCategoria.classList.add('categoria');
    categoria.appendChild(nomeCategoria);

    const tipo = document.createElement('td');
    tipo.textContent =
      movimentacao.tipo === 'receita' ? '↗ Receita' : '↙ Despesa';

    tipo.classList.add('tipo', movimentacao.tipo);

    const valor = document.createElement('td');
    const sinal = movimentacao.tipo === 'receita' ? '+ ' : '- ';

    valor.textContent = sinal + formatarMoeda(movimentacao.valor);
    valor.classList.add('valor', movimentacao.tipo);

    const acoes = document.createElement('td');
    acoes.classList.add('botoes-acoes');

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.setAttribute(
      'aria-label',
      'Excluir ' + movimentacao.descricao,
    );

    botaoExcluir.dataset.acao = 'excluir';
    botaoExcluir.dataset.id = movimentacao.id;

    const iconeExcluir = document.createElement('img');
    iconeExcluir.src = '../assets/icon/trash.svg';
    iconeExcluir.alt = '';

    botaoExcluir.appendChild(iconeExcluir);
    acoes.appendChild(botaoExcluir);

    linha.appendChild(data);
    linha.appendChild(descricao);
    linha.appendChild(categoria);
    linha.appendChild(tipo);
    linha.appendChild(valor);
    linha.appendChild(acoes);

    listaRegistros.appendChild(linha);
  });

  atualizarContador(movimentacoesFiltradas.length);
  atualizarPaginacao(totalPaginas);
}

// Contador de Movimentações
function atualizarContador(total) {
  totalRegistros.textContent =
    'Mostrando ' + total + (total === 1 ? ' movimentação' : ' movimentações');
}

// Paginação
function atualizarPaginacao(totalPaginas) {
  botoesPaginacao.innerHTML = '';

  const botaoAnterior = document.createElement('button');
  botaoAnterior.type = 'button';
  botaoAnterior.textContent = '‹';
  botaoAnterior.setAttribute('aria-label', 'Página anterior');
  botaoAnterior.disabled = paginaAtual === 1;
  botaoAnterior.dataset.pagina = 'anterior';

  botoesPaginacao.appendChild(botaoAnterior);

  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    const botao = document.createElement('button');

    botao.type = 'button';
    botao.textContent = pagina;
    botao.dataset.pagina = pagina;

    if (pagina === paginaAtual) {
      botao.classList.add('pagina-ativa');
      botao.setAttribute('aria-current', 'page');
    }

    botoesPaginacao.appendChild(botao);
  }

  const botaoProximo = document.createElement('button');
  botaoProximo.type = 'button';
  botaoProximo.textContent = '›';
  botaoProximo.setAttribute('aria-label', 'Próxima página');

  botaoProximo.disabled = totalPaginas === 0 || paginaAtual === totalPaginas;

  botaoProximo.dataset.pagina = 'proxima';

  botoesPaginacao.appendChild(botaoProximo);
}

// Filtro por Tipo
botoesFiltro.forEach(function (botao) {
  botao.addEventListener('click', function () {
    filtroTipoAtual = botao.dataset.filtro;
    paginaAtual = 1;

    botoesFiltro.forEach(function (outroBotao) {
      outroBotao.classList.remove('filtro-ativo');
    });

    botao.classList.add('filtro-ativo');

    renderizarTabela();
  });
});

// Pesquisa
campoPesquisa.addEventListener('input', function () {
  paginaAtual = 1;
  renderizarTabela();
});

// Filtro por Categoria
filtroCategoria.addEventListener('change', function () {
  paginaAtual = 1;
  renderizarTabela();
});

// Navegação da Paginação
botoesPaginacao.addEventListener('click', function (evento) {
  const botao = evento.target.closest('button');

  if (!botao || botao.disabled) {
    return;
  }

  if (botao.dataset.pagina === 'anterior') {
    paginaAtual--;
  } else if (botao.dataset.pagina === 'proxima') {
    paginaAtual++;
  } else {
    paginaAtual = Number(botao.dataset.pagina);
  }

  renderizarTabela();
});

// Exclusão de Movimentações
listaRegistros.addEventListener('click', function (evento) {
  const botao = evento.target.closest('button');

  if (!botao || botao.dataset.acao !== 'excluir') {
    return;
  }

  const id = Number(botao.dataset.id);

  const confirmarExclusao = confirm(
    'Deseja realmente excluir esta movimentação?',
  );

  if (confirmarExclusao) {
    const indice = movimentacoes.findIndex(function (movimentacao) {
      return movimentacao.id === id;
    });

    if (indice !== -1) {
      movimentacoes.splice(indice, 1);

      atualizarCards();
      renderizarTabela();
    }
  }
});

// Inicialização da Página
atualizarCards();
renderizarTabela();
