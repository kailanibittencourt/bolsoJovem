const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

const BASE = { saldo: 1420.5, receita: 1800, despesa: 1300 };
const CHART_MAX = 250;
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const SEMANAS = {
  atual: [42, 118, 30, 92, 208, 60, 42],
  anterior: [80, 65, 110, 40, 150, 90, 55],
};
const CATEGORIAS = {
  alimentacao: {
    nome: 'Alimentação',
    icone: '🍴',
    cor: 'i-laranja',
    tipo: 'despesa',
  },
  estudos: { nome: 'Estudos', icone: '📖', cor: 'i-azul', tipo: 'despesa' },
  lazer: { nome: 'Lazer', icone: '📺', cor: 'i-roxo', tipo: 'despesa' },
  transporte: {
    nome: 'Transporte',
    icone: '🚌',
    cor: 'i-cinza',
    tipo: 'despesa',
  },
  renda: { nome: 'Renda', icone: '💼', cor: 'i-verde', tipo: 'receita' },
  outros: { nome: 'Outros', icone: '🧾', cor: 'i-cinza', tipo: 'ambos' },
};

const CHAVE = 'bolsojovem:transacoes';
function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch {
    return [];
  }
}
function salvar(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {}
}
let transacoes = carregar();

function atualizarResumo() {
  const soma = (tipo) =>
    transacoes.filter((t) => t.tipo === tipo).reduce((s, t) => s + t.valor, 0);
  const receita = BASE.receita + soma('receita');
  const despesa = BASE.despesa + soma('despesa');
  const saldo = BASE.saldo + soma('receita') - soma('despesa');

  $('#saldo').textContent = BRL.format(saldo);
  $('#receita').textContent = '+ ' + BRL.format(receita);
  $('#despesa').textContent = '— ' + BRL.format(despesa);
}

let semanaAtiva = 'atual';

function valoresDaSemana(chave) {
  const valores = [...SEMANAS[chave]];
  if (chave !== 'atual') return valores;

  const hoje = new Date();
  const inicio = new Date(hoje);
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7));
  transacoes.forEach((t) => {
    const data = new Date(t.ts);
    if (data >= inicio) valores[(data.getDay() + 6) % 7] += t.valor;
  });
  return valores;
}

function desenharGrafico(chave = semanaAtiva) {
  semanaAtiva = chave;
  const area = $('#area-grafico');
  const valores = valoresDaSemana(chave);
  const maior = Math.max(...valores);

  area.replaceChildren(
    ...valores.map((v, i) => {
      const col = document.createElement('div');
      col.className = 'col' + (v === maior ? ' destaque' : '');
      col.innerHTML = '<div class="b"></div><span></span>';
      $('span', col).textContent = DIAS[i];
      const barra = $('.b', col);
      barra.style.height = '0%';
      barra.title = BRL.format(v);

      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          barra.style.height = Math.min(100, (v / CHART_MAX) * 100) + '%';
        }),
      );
      return col;
    }),
  );
}

function configurarAbas(id, aoMudar) {
  const grupo = document.getElementById(id);
  grupo.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $$('button', grupo).forEach((b) => b.classList.toggle('ativo', b === btn));
    aoMudar(btn);
  });
}

let filtro = 'todos';

function aplicarFiltro() {
  $$('#lista .item').forEach((item) => {
    item.hidden = filtro !== 'todos' && item.dataset.tipo !== filtro;
  });
}

function rotuloTempo(ts) {
  const dia = (d) => new Date(d).setHours(0, 0, 0, 0);
  const dias = Math.round((dia(Date.now()) - dia(ts)) / 86400000);
  if (dias === 0) {
    return (
      'Hoje, ' +
      new Date(ts).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }
  return dias === 1 ? 'Ontem' : dias + ' dias atrás';
}

function criarItem(t) {
  const cat = CATEGORIAS[t.cat] || CATEGORIAS.outros;
  const receita = t.tipo === 'receita';
  const li = document.createElement('li');
  li.className = 'item';
  li.dataset.tipo = t.tipo;
  li.innerHTML = `
    <div class="icone ${cat.cor}">${cat.icone}</div>
    <div class="info"><b></b><small></small></div>
    <span class="valor ${receita ? 'verde' : 'vermelho'}"></span>`;
  $('b', li).textContent = t.desc;
  $('small', li).textContent = rotuloTempo(t.ts);
  $('.valor', li).textContent = (receita ? '+ ' : '— ') + BRL.format(t.valor);
  return li;
}

function desenharTransacoes() {
  const lista = $('#lista');
  $$('.item.nova', lista).forEach((el) => el.remove());

  transacoes.forEach((t) => {
    const li = criarItem(t);
    li.classList.add('nova');
    lista.prepend(li);
  });
  aplicarFiltro();
}

const modal = $('#modal');
const form = $('#form-transacao');
const selTipo = $('#campo-tipo');
const selCat = $('#campo-cat');

function preencherCategorias() {
  selCat.replaceChildren(
    ...Object.entries(CATEGORIAS)
      .filter(([, c]) => c.tipo === 'ambos' || c.tipo === selTipo.value)
      .map(([chave, c]) => new Option(c.nome, chave)),
  );
}
selTipo.addEventListener('change', preencherCategorias);

$('#btn-transacao').addEventListener('click', () => {
  form.reset();
  preencherCategorias();
  modal.showModal();
});
$('#btn-cancelar').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
}); // clique fora

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = Number($('#campo-valor').value.replace(',', '.'));
  const desc = $('#campo-desc').value.trim();
  if (!desc || !(valor > 0)) return;

  transacoes.push({
    desc,
    valor,
    tipo: selTipo.value,
    cat: selCat.value,
    ts: Date.now(),
  });
  salvar(transacoes);
  modal.close();
  atualizarTudo();
});

function animarBarras() {
  $$('.barra > i').forEach((barra) => {
    const largura = barra.style.width;
    barra.style.width = '0%';
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        barra.style.width = largura;
      }),
    );
  });
}

function atualizarTudo() {
  atualizarResumo();
  desenharGrafico();
  desenharTransacoes();
}

configurarAbas('abas-semana', (btn) => desenharGrafico(btn.dataset.semana));
configurarAbas('abas-tipo', (btn) => {
  filtro = btn.dataset.tipo;
  aplicarFiltro();
});

atualizarTudo();
animarBarras();
