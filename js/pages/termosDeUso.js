'use strict';

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);

try {
  const config = JSON.parse(localStorage.getItem('bolsojovem:config')) || {};
  document.documentElement.dataset.tema = config.escuro ? 'escuro' : 'claro';
} catch {}

const botaoTopo = $('#btn-topo');

window.addEventListener('scroll', () => {
  botaoTopo.hidden = window.scrollY < 300;
});

botaoTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function destacarSecao() {
  const alvo = location.hash && $(location.hash);
  if (!alvo || !alvo.closest('.card')) return;
  alvo.animate(
    [{ background: 'rgba(185,246,36,.35)' }, { background: 'transparent' }],
    { duration: 1600, easing: 'ease-out' },
  );
}
window.addEventListener('hashchange', destacarSecao);
destacarSecao();
