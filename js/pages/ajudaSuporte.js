const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

try {
  const config = JSON.parse(localStorage.getItem('bolsojovem:config')) || {};
  document.documentElement.dataset.tema = config.escuro ? 'escuro' : 'claro';
} catch {}

function alternar(item, abrir) {
  const botao = $('.faq-pergunta', item);
  const estado = abrir ?? !item.classList.contains('aberto');
  item.classList.toggle('aberto', estado);
  botao.setAttribute('aria-expanded', estado);
  $('.faq-icone', item).textContent = '+';
}

$('#faq').addEventListener('click', (e) => {
  const botao = e.target.closest('.faq-pergunta');
  if (!botao) return;
  const item = botao.closest('.faq-item');

  $$('.faq-item.aberto').forEach((outro) => {
    if (outro !== item) alternar(outro, false);
  });
  alternar(item);
});

const campoBusca = $('#busca');
const status = $('#busca-status');

const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function filtrar() {
  const termo = normalizar(campoBusca.value);
  const itens = $$('.faq-item');
  const cartoes = $$('.categoria');

  const bate = (el) => !termo || normalizar(el.textContent).includes(termo);

  let achados = 0;
  itens.forEach((item) => {
    const visivel = bate(item);
    item.hidden = !visivel;
    if (visivel) achados++;
    if (termo && visivel) alternar(item, true);
    if (!termo) alternar(item, false);
  });

  let cartoesVisiveis = 0;
  cartoes.forEach((c) => {
    c.hidden = !bate(c);
    if (!c.hidden) cartoesVisiveis++;
  });
  $('#categorias').hidden = termo && cartoesVisiveis === 0;
  $('#faq-vazio').hidden = achados > 0;
  $('#faq').hidden = achados === 0;

  const total = achados + cartoesVisiveis;
  status.textContent = !termo
    ? ''
    : total === 0
      ? 'Nenhum resultado para “' + campoBusca.value.trim() + '”.'
      : total +
        (total === 1 ? ' resultado encontrado.' : ' resultados encontrados.');
}
campoBusca.addEventListener('input', filtrar);

const form = $('#form-contato');
const assunto = $('#assunto');
const mensagem = $('#mensagem');
const contador = $('#contador');
const statusForm = $('#mensagem-status');
let temporizador;

function erro(campo, id, texto = '') {
  $('#' + id).textContent = texto;
  campo.setAttribute('aria-invalid', texto ? 'true' : 'false');
  return !texto;
}

mensagem.addEventListener('input', () => {
  contador.textContent = mensagem.value.length + '/' + mensagem.maxLength;
  erro(mensagem, 'erro-mensagem');
});
assunto.addEventListener('input', () => erro(assunto, 'erro-assunto'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const okAssunto = erro(
    assunto,
    'erro-assunto',
    assunto.value.trim().length < 3
      ? 'Informe um assunto (mínimo 3 letras).'
      : '',
  );
  const okMensagem = erro(
    mensagem,
    'erro-mensagem',
    mensagem.value.trim().length < 10
      ? 'Escreva uma mensagem com pelo menos 10 caracteres.'
      : '',
  );

  clearTimeout(temporizador);
  if (!okAssunto || !okMensagem) {
    (okAssunto ? mensagem : assunto).focus();
    statusForm.textContent = '';
    return;
  }

  form.reset();
  contador.textContent = '0/' + mensagem.maxLength;
  statusForm.textContent = 'Mensagem validada! (demonstração, sem servidor)';
  temporizador = setTimeout(() => {
    statusForm.textContent = '';
  }, 4000);
});

if (location.hash === '#contato') assunto.focus({ preventScroll: true });
