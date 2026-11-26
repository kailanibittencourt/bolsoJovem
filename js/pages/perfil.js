'use strict';

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);

const CHAVE_PERFIL = 'bolsojovem:perfil';
const CHAVE_FOTO = 'bolsojovem:foto';

function lerStorage(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave));
  } catch {
    return null;
  }
}
function gravarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

const form = $('#form-perfil');
const campos = {
  nome: $('#nome'),
  email: $('#email'),
  nascimento: $('#nascimento'),
  instituicao: $('#instituicao'),
};
const mensagem = $('#mensagem');
let temporizador;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validadores = {
  nome(v) {
    if (v.length < 2) return 'Informe seu nome (mínimo 2 letras).';
  },
  email(v) {
    if (!REGEX_EMAIL.test(v))
      return 'Informe um e-mail válido, ex.: nome@email.com.';
  },
  nascimento(v) {
    if (!v) return 'Informe sua data de nascimento.';
    const data = new Date(v + 'T00:00:00');
    if (isNaN(data) || data.getFullYear() < 1900) return 'Data inválida.';
    if (data > new Date()) return 'A data não pode ser no futuro.';
  },
  instituicao(v) {
    if (v && v.length < 2) return 'Digite o nome completo da instituição.';
  },
};

function mostrarErro(nome, texto = '') {
  $('#erro-' + nome).textContent = texto;
  campos[nome].setAttribute('aria-invalid', texto ? 'true' : 'false');
}

function validarCampo(nome) {
  const erro = validadores[nome](campos[nome].value.trim());
  mostrarErro(nome, erro);
  return !erro;
}

function atualizarCartao() {
  $('#nome-exibido').textContent = campos.nome.value.trim() || 'Nome';
  $('#email-exibido').textContent = campos.email.value.trim() || 'E-mail';
}

function mostrarMensagem(texto, erro = false) {
  clearTimeout(temporizador);
  mensagem.textContent = texto;
  mensagem.style.color = erro ? 'var(--erro)' : '';
  temporizador = setTimeout(() => {
    mensagem.textContent = '';
  }, 3500);
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const invalidos = Object.keys(campos).filter((nome) => !validarCampo(nome));
  if (invalidos.length) {
    campos[invalidos[0]].focus();
    mostrarMensagem('Corrija os campos destacados.', true);
    return;
  }

  const dados = {};
  for (const nome in campos) dados[nome] = campos[nome].value.trim();

  if (gravarStorage(CHAVE_PERFIL, dados)) {
    atualizarCartao();
    mostrarMensagem('Alterações salvas com sucesso!');
  } else {
    mostrarMensagem('Não foi possível salvar neste navegador.', true);
  }
});

Object.keys(campos).forEach((nome) => {
  campos[nome].addEventListener('input', () => mostrarErro(nome));
  campos[nome].addEventListener('blur', () => {
    if (campos[nome].value.trim() || nome === 'nome') validarCampo(nome);
  });
});

const arquivo = $('#arquivo-foto');
const foto = $('#foto');
const iconeFoto = $('#icone-foto');

function mostrarFoto(url) {
  foto.src = url;
  foto.hidden = false;
  iconeFoto.style.display = 'none';
}

$('#btn-foto').addEventListener('click', () => arquivo.click());

arquivo.addEventListener('change', () => {
  const imagem = arquivo.files[0];
  if (!imagem) return;
  if (!imagem.type.startsWith('image/'))
    return mostrarMensagem('Escolha um arquivo de imagem.', true);
  if (imagem.size > 1.5 * 1024 * 1024)
    return mostrarMensagem('A imagem deve ter até 1,5 MB.', true);

  const leitor = new FileReader();
  leitor.onload = () => {
    mostrarFoto(leitor.result);
    gravarStorage(CHAVE_FOTO, leitor.result);
  };
  leitor.readAsDataURL(imagem);
});

const botaoMenu = $('#btn-menu');
const menu = $('#menu');
botaoMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', aberto);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('aberto')) {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  }
});

campos.nascimento.max = new Date().toISOString().split('T')[0];

const salvo = lerStorage(CHAVE_PERFIL);
if (salvo) {
  for (const nome in campos) campos[nome].value = salvo[nome] || '';
  atualizarCartao();
}
const fotoSalva = lerStorage(CHAVE_FOTO);
if (fotoSalva) mostrarFoto(fotoSalva);
