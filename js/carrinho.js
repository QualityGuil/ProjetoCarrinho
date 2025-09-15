// Lógica modal
const shoppingCartBtn = document.querySelector('.shopping__cart')
const modalBackdrop = document.querySelector('.modal__backdrop');
const modalCloseBtn = document.querySelector('.modal__close');

shoppingCartBtn.addEventListener('click', () => {
    modalBackdrop.style.display = 'flex';
})

function closeModal() {
    modalBackdrop.style.display = 'none';
}

modalBackdrop.addEventListener('click', closeModal);

modalCloseBtn.addEventListener('click', closeModal);


// Lógica carrinho
let listaCarrinho = [];

function adicionarAoCarrinho(id) {
    console.log(id)

    if (listaCarrinho.includes(id)) {
        let novaListaCarrinho = listaCarrinho.filter(produto => produto !== id);
        listaCarrinho = novaListaCarrinho;
    } else {
        listaCarrinho.push(id);
    }

    console.log(listaCarrinho);
}