const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

try {
  const config = JSON.parse(localStorage.getItem('bolsojovem:config')) || {};
  document.documentElement.dataset.tema = config.escuro ? 'escuro' : 'claro';
} catch {}

function prepararEquipe() {
  $$('.membro').forEach((membro) => {
    const nome = $('.nome', membro).textContent.trim();
    const avatar = $('.avatar', membro);
    const foto = avatar.dataset.foto;

    if (foto) {
      const img = document.createElement('img');
      img.src = foto;
      img.alt = 'Foto de ' + nome;
      avatar.replaceChildren(img);
    } else if (nome && !nome.startsWith('[')) {
      avatar.textContent = nome.charAt(0).toUpperCase();
    }
  });
}

function ligarEmail() {
  const alvo = $('#email-contato');
  const texto = alvo.textContent.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto)) return;
  const link = document.createElement('a');
  link.href = 'mailto:' + texto;
  link.textContent = texto;
  alvo.replaceWith(link);
}

function revelarAoRolar() {
  const itens = $$('.revelar');
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visivel');
        obs.unobserve(entrada.target);
      });
    },
    { threshold: 0.15 },
  );

  itens.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
    observador.observe(el);
  });
}

prepararEquipe();
ligarEmail();
revelarAoRolar();
