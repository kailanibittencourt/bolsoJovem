'use strict';

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const PREFIXO = 'bolsojovem:';
const CHAVE_CONFIG = PREFIXO + 'config';

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
  } catch {}
}

const PADRAO = {
  lembrete: true,
  alerta: true,
  novidades: false,
  escuro: false,
  doisFatores: false,
  limite: 1800,
};
let config = { ...PADRAO, ...lerStorage(CHAVE_CONFIG) };
const salvarConfig = () => gravarStorage(CHAVE_CONFIG, config);

let tempoToast;
function aviso(texto) {
  const toast = $('#toast');
  toast.textContent = texto;
  toast.classList.add('visivel');
  clearTimeout(tempoToast);
  tempoToast = setTimeout(() => toast.classList.remove('visivel'), 3000);
}

function aplicarTema() {
  document.documentElement.dataset.tema = config.escuro ? 'escuro' : 'claro';
}
function mostrarLimite() {
  $('#btn-limite').textContent = BRL.format(config.limite);
}

const mensagens = {
  lembrete: ['Lembretes ativados.', 'Lembretes desativados.'],
  alerta: ['Alerta de limite ativado.', 'Alerta de limite desativado.'],
  novidades: [
    'Você receberá novidades da Jornada.',
    'Novidades da Jornada desativadas.',
  ],
  escuro: ['Tema escuro ativado.', 'Tema claro ativado.'],
  doisFatores: [
    'Verificação em duas etapas ativada.',
    'Verificação em duas etapas desativada.',
  ],
};

$$('input[data-config]').forEach((caixa) => {
  const chave = caixa.dataset.config;
  caixa.checked = config[chave];
  caixa.addEventListener('change', () => {
    config[chave] = caixa.checked;
    salvarConfig();
    if (chave === 'escuro') aplicarTema();
    aviso(mensagens[chave][caixa.checked ? 0 : 1]);
  });
});

let focoAnterior = null;

function abrir(janela) {
  focoAnterior = document.activeElement;
  janela.hidden = false;
  document.body.classList.add('sem-rolagem');
  const primeiro = $('input:not([type=hidden]), textarea, button', janela);
  if (primeiro) primeiro.focus();
}
function fechar(janela) {
  janela.hidden = true;
  if ($$('.sobreposicao').every((j) => j.hidden))
    document.body.classList.remove('sem-rolagem');
  if (focoAnterior) focoAnterior.focus();
}
$$('.sobreposicao').forEach((janela) => {
  $$('[data-fechar]', janela).forEach((b) =>
    b.addEventListener('click', () => fechar(janela)),
  );
  janela.addEventListener('click', (e) => {
    if (e.target === janela) fechar(janela);
  });
});
document.addEventListener('keydown', (e) => {
  const aberta = $$('.sobreposicao').find((j) => !j.hidden);
  if (!aberta) return;
  if (e.key === 'Escape') return fechar(aberta);
  if (e.key === 'Tab') {
    const itens = $$('input, textarea, button:not([disabled])', aberta);
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

function mostrarErro(campo, erroId, texto = '') {
  $('#' + erroId).textContent = texto;
  campo.setAttribute('aria-invalid', texto ? 'true' : 'false');
  return !texto;
}

const campoLimite = $('#campo-limite');
$('#btn-limite').addEventListener('click', () => {
  campoLimite.value = config.limite;
  mostrarErro(campoLimite, 'erro-limite');
  abrir($('#modal-limite'));
});
$('#form-limite').addEventListener('submit', (e) => {
  e.preventDefault();
  const valor = Number(campoLimite.value);
  if (!(valor > 0))
    return mostrarErro(
      campoLimite,
      'erro-limite',
      'Informe um valor maior que zero.',
    );
  config.limite = Math.round(valor * 100) / 100;
  salvarConfig();
  mostrarLimite();
  fechar($('#modal-limite'));
  aviso('Limite atualizado para ' + BRL.format(config.limite) + '.');
});

const senhas = {
  atual: $('#senha-atual'),
  nova: $('#senha-nova'),
  confirma: $('#senha-confirma'),
};

$('#btn-senha').addEventListener('click', () => {
  $('#form-senha').reset();
  for (const k in senhas) mostrarErro(senhas[k], 'erro-' + k);
  abrir($('#modal-senha'));
});

$('#form-senha').addEventListener('submit', (e) => {
  e.preventDefault();
  const { atual, nova, confirma } = senhas;
  const regra = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const ok = [
    mostrarErro(
      atual,
      'erro-atual',
      atual.value ? '' : 'Informe sua senha atual.',
    ),
    mostrarErro(
      nova,
      'erro-nova',
      !regra.test(nova.value)
        ? 'Use 8+ caracteres, com letras e números.'
        : nova.value === atual.value
          ? 'A nova senha deve ser diferente da atual.'
          : '',
    ),
    mostrarErro(
      confirma,
      'erro-confirma',
      confirma.value === nova.value ? '' : 'As senhas não coincidem.',
    ),
  ];
  if (ok.includes(false)) return;

  fechar($('#modal-senha'));
  aviso('Senha validada! (demonstração, sem servidor)');
});

const areaDados = $('#dados-exportados');

$('#btn-exportar').addEventListener('click', () => {
  const dados = {
    exportadoEm: new Date().toISOString(),
    configuracoes: config,
    perfil: lerStorage(PREFIXO + 'perfil'),
    transacoes: lerStorage(PREFIXO + 'transacoes') || [],
  };
  areaDados.value = JSON.stringify(dados, null, 2);
  abrir($('#modal-exportar'));
});

$('#btn-baixar').addEventListener('click', () => {
  try {
    const arquivo = new Blob([areaDados.value], { type: 'application/json' });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bolsojovem-dados.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    aviso('Download iniciado! Se nada baixar, use o botão Copiar.');
  } catch {
    aviso('Não foi possível baixar. Use o botão Copiar.');
  }
});

$('#btn-copiar').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(areaDados.value);
    aviso('Dados copiados!');
  } catch {
    areaDados.select();
    aviso(
      document.execCommand('copy')
        ? 'Dados copiados!'
        : 'Selecione o texto e use Ctrl+C.',
    );
  }
});

const confirmaExcluir = $('#confirma-excluir');
const botaoConfirma = $('#btn-confirma-excluir');

$('#btn-excluir').addEventListener('click', () => {
  confirmaExcluir.value = '';
  botaoConfirma.disabled = true;
  abrir($('#modal-excluir'));
});
confirmaExcluir.addEventListener('input', () => {
  botaoConfirma.disabled = confirmaExcluir.value.trim() !== 'EXCLUIR';
});
$('#form-excluir').addEventListener('submit', (e) => {
  e.preventDefault();
  if (botaoConfirma.disabled) return;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIXO))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}

  config = { ...PADRAO };
  $$('input[data-config]').forEach((c) => {
    c.checked = config[c.dataset.config];
  });
  aplicarTema();
  mostrarLimite();
  fechar($('#modal-excluir'));
  aviso('Dados deste navegador apagados.');
});

aplicarTema();
mostrarLimite();
