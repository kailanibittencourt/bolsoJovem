const botoesAbrir = document.querySelectorAll('.abrir-modal');

botoesAbrir.forEach((botao) => {
  botao.addEventListener('click', () => {
    const idModal = botao.getAttribute('data-modal');
    const modal = document.getElementById(idModal);

    if (modal) {
      modal.showModal();
    }
  });
});

const botoesFechar = document.querySelectorAll('.fechar-modal');

botoesFechar.forEach((botao) => {
  botao.addEventListener('click', () => {
    const idModal = botao.getAttribute('data-modal');
    const modal = document.getElementById(idModal);

    if (modal) {
      modal.close();
    }
  });
});

const linksTrocar = document.querySelectorAll('.trocar-modal');

linksTrocar.forEach((link) => {
  link.addEventListener('click', (evento) => {
    evento.preventDefault();

    const idFechar = link.getAttribute('data-fechar');
    const idAbrir = link.getAttribute('data-abrir');

    const modalAtual = document.getElementById(idFechar);
    const proximoModal = document.getElementById(idAbrir);

    if (modalAtual) modalAtual.close();
    if (proximoModal) proximoModal.showModal();
  });
});

const botoesOlho = document.querySelectorAll('.botao-olho');

botoesOlho.forEach((botao) => {
  botao.addEventListener('click', () => {
    const campoSenha = botao.previousElementSibling;

    if (campoSenha.type === 'password') {
      campoSenha.type = 'text';
    } else {
      campoSenha.type = 'password';
    }
  });
});

const campoCpf = document.getElementById('cpf');
if (campoCpf) {
  campoCpf.addEventListener('input', () => {
    let valor = campoCpf.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campoCpf.value = valor;
  });
}

const campoNascimento = document.getElementById('nascimento');
if (campoNascimento) {
  campoNascimento.addEventListener('input', () => {
    let valor = campoNascimento.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    campoNascimento.value = valor;
  });
}

const campoTelefone = document.getElementById('telefone');
if (campoTelefone) {
  campoTelefone.addEventListener('input', () => {
    let valor = campoTelefone.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    campoTelefone.value = valor;
  });
}

const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
  formCadastro.addEventListener('submit', (evento) => {
    evento.preventDefault();
    alert('Conta criada com sucesso no Bolso Jovem!');
    formCadastro.reset();

    const modalCadastro = document.getElementById('modal-cadastro');
    if (modalCadastro) {
      modalCadastro.close();
    }
  });
}

const formLogin = document.getElementById('form-login');

if (formLogin) {
  formLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();
    alert('Login realizado com sucesso!');
    formLogin.reset();

    const modalLogin = document.getElementById('modal-login');
    if (modalLogin) {
      modalLogin.close();
    }
  });
}

const formRecuperar = document.getElementById('form-recuperar');

if (formRecuperar) {
  formRecuperar.addEventListener('submit', (evento) => {
    evento.preventDefault();
    alert(
      'Se os dados estiverem corretos, enviaremos as instruções para o seu e-mail!',
    );
    formRecuperar.reset();

    const modalRecuperar = document.getElementById('modal-recuperar');
    if (modalRecuperar) {
      modalRecuperar.close();
    }
  });
}

const botoesTipo = document.querySelectorAll('.opcao-tipo');
const inputTipo = document.getElementById('tipo-lancamento');

botoesTipo.forEach((botao) => {
  botao.addEventListener('click', () => {
    botoesTipo.forEach((b) => b.classList.remove('ativo'));

    botao.classList.add('ativo');

    if (inputTipo) {
      inputTipo.value = botao.getAttribute('data-tipo');
    }
  });
});

const campoValor = document.getElementById('valor');

if (campoValor) {
  campoValor.addEventListener('input', () => {
    let valor = campoValor.value.replace(/\D/g, '');

    if (valor === '') {
      campoValor.value = '';
      return;
    }

    valor = (Number(valor) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    campoValor.value = valor;
  });
}

const campoDataRegistro = document.getElementById('data-registro');

if (campoDataRegistro) {
  campoDataRegistro.addEventListener('input', () => {
    let valor = campoDataRegistro.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
    campoDataRegistro.value = valor;
  });
}

const formRegistro = document.getElementById('form-registro');

if (formRegistro) {
  formRegistro.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const tipo = inputTipo.value;
    const descricao = document.getElementById('descricao').value;
    const valor = campoValor.value;

    alert(
      `Lançamento salvo!\nTipo: ${tipo}\nDescrição: ${descricao}\nValor: ${valor}`,
    );

    formRegistro.reset();

    const modalRegistro = document.getElementById('modal-registro');
    if (modalRegistro) {
      modalRegistro.close();
    }
  });
}
