// Seleciona o cartão e os botões
const cartao = document.querySelector('.cartao');
const descobrir = document.getElementById('descobrir');
const voltar = document.getElementById('voltar');

// Seleciona as duas faces
const frente = document.querySelector('.frente');
const verso = document.querySelector('.verso');

// Impede acessar os links do verso antes de girar
verso.inert = true;

// Gira para mostrar os quatro cards
descobrir.addEventListener('click', function () {
  cartao.classList.add('girado');

  frente.inert = true;
  verso.inert = false;

  voltar.focus();
});

// Gira de volta para a apresentação
voltar.addEventListener('click', function () {
  cartao.classList.remove('girado');

  frente.inert = false;
  verso.inert = true;

  descobrir.focus();
});
