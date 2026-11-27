const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

try {
  const config = JSON.parse(localStorage.getItem('bolsojovem:config')) || {};
  document.documentElement.dataset.tema = config.escuro ? 'escuro' : 'claro';
} catch {}

const MUNDOS = {
  1: {
    titulo: 'Conhecendo meu dinheiro',
    texto:
      'Entenda receitas, despesas e a diferença entre necessidade e desejo.',
    topicos: [
      'Receita é tudo o que entra; despesa é tudo o que sai.',
      'Necessidade é o que você precisa para viver e estudar; desejo é o que você quer, mas pode esperar.',
      'Anote tudo por uma semana para descobrir para onde o seu dinheiro vai.',
    ],
  },
  2: {
    titulo: 'Assumindo o controle',
    texto: 'Categorias, limites e orçamento mensal.',
    topicos: [
      'Separe os gastos em categorias, como alimentação, transporte e lazer.',
      'Defina um limite mensal para cada categoria. A regra 50/30/20 é um bom começo.',
      'Compare o que planejou com o que gastou e ajuste no mês seguinte.',
    ],
  },
  3: {
    titulo: 'Escolhas inteligentes',
    texto: 'Compras conscientes e consumo planejado.',
    topicos: [
      'Espere 24 horas antes de fazer uma compra por impulso.',
      'Compare preços e veja se o item cabe no seu orçamento.',
      'Planeje as compras maiores em vez de parcelar sem necessidade.',
    ],
  },
  4: {
    titulo: 'Construindo objetivos',
    texto: 'Metas de curto, médio e longo prazo.',
    topicos: [
      'Curto prazo: até 1 ano, como um celular ou uma viagem.',
      'Médio prazo: de 1 a 5 anos, como um curso ou um computador.',
      'Longo prazo: mais de 5 anos, como a entrada de um imóvel.',
      'Divida o valor da meta pelos meses até a data para saber quanto guardar por mês.',
    ],
  },
};

const ARTIGO = {
  titulo: 'Como montar sua primeira reserva de emergência',
  texto:
    'A reserva de emergência é um dinheiro guardado para imprevistos, como um conserto urgente ou uma queda na renda.',
  topicos: [
    'Calcule seus gastos essenciais do mês: moradia, comida, transporte e estudos.',
    'Defina a meta: comece com 1 mês de gastos e vá aumentando até 3 a 6 meses.',
    'Guarde um valor fixo assim que receber, mesmo que seja pequeno.',
    'Deixe o dinheiro em um lugar seguro e de resgate rápido.',
    'Use a reserva só para imprevistos de verdade, e reponha depois.',
  ],
};

const CHAVE = 'bolsojovem:educacao';

function lerConcluidos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch {
    return [];
  }
}
function salvarConcluidos(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {}
}
let concluidos = lerConcluidos();

function desenharProgresso() {
  $$('.mundo').forEach((cartao) => {
    const feito = concluidos.includes(Number(cartao.dataset.mundo));
    cartao.classList.toggle('concluido', feito);
    $('.selo', cartao).textContent =
      (feito ? '✓ ' : '') + 'Mundo ' + cartao.dataset.mundo;
  });
  const total = Object.keys(MUNDOS).length;
  $('#progresso').textContent = concluidos.length
    ? '· ' + concluidos.length + ' de ' + total + ' mundos concluídos'
    : '';
}

const janela = $('#modal');
const botaoConcluir = $('#btn-concluir');
let mundoAberto = null;
let focoAnterior = null;

function atualizarBotaoConcluir() {
  if (mundoAberto === null) {
    botaoConcluir.hidden = true;
    return;
  }
  botaoConcluir.hidden = false;
  botaoConcluir.textContent = concluidos.includes(mundoAberto)
    ? 'Desmarcar conclusão'
    : 'Marcar como concluído';
}

function abrir(conteudo, selo, mundo = null) {
  focoAnterior = document.activeElement;
  mundoAberto = mundo;
  $('#modal-selo').textContent = selo;
  $('#modal-titulo').textContent = conteudo.titulo;
  $('#modal-texto').textContent = conteudo.texto;
  $('#modal-lista').replaceChildren(
    ...conteudo.topicos.map((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      return li;
    }),
  );
  atualizarBotaoConcluir();
  janela.hidden = false;
  document.body.classList.add('sem-rolagem');
  $('.btn-claro', janela).focus();
}

function fechar() {
  janela.hidden = true;
  document.body.classList.remove('sem-rolagem');
  if (focoAnterior) focoAnterior.focus();
}

$$('.abrir').forEach((botao) => {
  botao.addEventListener('click', () => {
    const n = Number(botao.dataset.mundo);
    abrir(MUNDOS[n], 'Mundo ' + n, n);
  });
});
$('#btn-artigo').addEventListener('click', () => abrir(ARTIGO, 'Artigo'));

botaoConcluir.addEventListener('click', () => {
  concluidos = concluidos.includes(mundoAberto)
    ? concluidos.filter((n) => n !== mundoAberto)
    : [...concluidos, mundoAberto];
  salvarConcluidos(concluidos);
  desenharProgresso();
  atualizarBotaoConcluir();
});

$('[data-fechar]', janela).addEventListener('click', fechar);
janela.addEventListener('click', (e) => {
  if (e.target === janela) fechar();
});
document.addEventListener('keydown', (e) => {
  if (janela.hidden) return;
  if (e.key === 'Escape') return fechar();
  if (e.key === 'Tab') {
    const itens = $$('button:not([hidden])', janela);
    const primeiro = itens[0],
      ultimo = itens[itens.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  }
});

desenharProgresso();
