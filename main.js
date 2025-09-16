// Importa a função que carrega os produtos do outro módulo
import { getProdutos } from './js/consumoJSON.js';

let listaDeProdutos = [];
let listaCarrinho = [];

const CARRINHO_STORAGE_KEY = 'listaDeIdsCarrinho';

// --- Lógica do Modal ---
const shoppingCartBtn = document.querySelector('.shopping__cart');
const modalBackdrop = document.querySelector('.modal__backdrop');
const modalCloseBtn = document.querySelector('.modal__close');
const cartListContainer = document.querySelector('.modal__shopping__cart');
const shoppingCartBtnNum = document.querySelector('.shopping__cart span');

// O seu evento de clique para abrir o modal
shoppingCartBtn.addEventListener('click', () => {
    modalBackdrop.style.display = 'flex';
    renderizarCarrinho();
});

// Outras funções do modal...
function closeModal() {
    modalBackdrop.style.display = 'none';
}

modalBackdrop.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);

// --- Funções de Lógica e Renderização ---

function atualizarQtdCarrinho() {
    shoppingCartBtnNum.textContent = listaCarrinho.length;
}

function salvarCarrinhoNoLocalStorage() {
    const listaCarrinhoJSON = JSON.stringify(listaCarrinho);

    localStorage.setItem(CARRINHO_STORAGE_KEY, listaCarrinhoJSON);
    console.log('Carrinho salvo no localStorage');
}

function carregarCarrinhoLocalStorage() {
    const carrinhoSalvo = localStorage.getItem(CARRINHO_STORAGE_KEY);

    if (carrinhoSalvo) {
        listaCarrinho = JSON.parse(carrinhoSalvo);
        console.log("Carrinho carregado do localStorage: ", localStorage);
    }
}

function adicionarAoCarrinho(id) {
    const idInt = parseInt(id); // Converte o ID para número
    // const idInt = parseInt(id, 10); // Converte o ID para número
    const itemExistente = listaCarrinho.includes(idInt);

    if (itemExistente) {
        listaCarrinho = listaCarrinho.filter(produtoId => produtoId !== idInt);
    } else {
        listaCarrinho.push(idInt);
    }
    console.log("Carrinho atualizado:", listaCarrinho);
    // Atualizando o número de produtos no carrinho
    atualizarQtdCarrinho()

    salvarCarrinhoNoLocalStorage();
}

function renderizarCarrinho() {
    cartListContainer.innerHTML = '';
    listaCarrinho.forEach(idDoProduto => {
        const produto = listaDeProdutos.find(p => p.id === idDoProduto);
        if (produto) {

            if (produto.discounts) {
                cartListContainer.innerHTML += `
                <div class="shopping__card">
                    <p class="shopping__card__name">Nome: <span class="span__shoppingcard__name">${produto.name}</span></p>
                    <p class="shopping__card__price">Preço: <span class="span__shoppingcard__price">R$${produto.price}</span></p>
                    <p class="shopping__card__discounts">Desconto: <span class="span__shoppingcard__discounts">R$${produto.discounts}</span></p>
                    <p class="shopping__card__id">ID: <span class="span__shoppingcard__id">${produto.id}</span></p>
                </div>
            `;
            } else {
                cartListContainer.innerHTML += `
                <div class="shopping__card">
                    <p class="shopping__cardname">Nome: <span class="span__shoppingcard__name">${produto.name}</span></p>
                    <p class="shopping__cardprice">Preço: <span class="span__shoppingcard__price">R$${produto.price}</span></p>
                    <p class="shopping__cardid">ID: <span class="span__shoppingcard__id">${produto.id}</span></p>
                </div>
            `;
            }

        }

        atualizarQtdCarrinho();

    });

    const precosProdutos = document.querySelectorAll('.span__shoppingcard__price');
    const descontosProdutos = document.querySelectorAll('.span__shoppingcard__discounts');
    const totalProdutos = document.querySelector('.modal__span__total');
    const descontoTotalProdutos = document.querySelector('.modal__span__discounts');

    let somaTotal = 0;

    precosProdutos.forEach(preco => {
        let textoPreco = preco.textContent;

        let precoLimpo = textoPreco.replace('R$', '').trim();

        const valorPreco = parseFloat(precoLimpo);

        somaTotal += valorPreco;

    });

    let descontoTotal = 0;

    descontosProdutos.forEach(desconto => {
        let textoDesconto = desconto.textContent;

        let descontoLimpo = textoDesconto.replace('R$', '').trim();

        let valorDesconto = parseFloat(descontoLimpo);

        descontoTotal += valorDesconto;
    })

    somaTotal -= descontoTotal;

    totalProdutos.textContent = `R$${somaTotal.toFixed(2)}`;
    descontoTotalProdutos.textContent = `R$${descontoTotal.toFixed(2)}`;

}

function renderizarProdutosNaPagina() {
    const productList = document.querySelector('.product__list');
    productList.innerHTML = '';

    listaDeProdutos.forEach(produto => {
        productList.innerHTML += `
            <div class="product__card">
                <img src="${produto.image}" alt="">
                <div class="product__card__info">
                    <h2>${produto.name}</h2>
                    <p>R$${produto.price}</p>
                    <button class="product__add__btn" data-id="${produto.id}">
                        <i class="ri-add-line"></i><i class="ri-shopping-cart-line"></i>
                    </button>
                </div>
            </div>
        `;
    });

    // Adiciona os listeners de clique aos botões recém-criados
    document.querySelectorAll('.product__add__btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.currentTarget.dataset.id;
            adicionarAoCarrinho(id);
        });
    });
}

// --- Fluxo Principal da Aplicação ---
// Chama a função getProdutos e usa a Promise para renderizar a página
getProdutos()
    .then(produtos => {
        listaDeProdutos = produtos; // Preenche a variável global com os dados
        renderizarProdutosNaPagina(); // Agora, podemos renderizar!
        carregarCarrinhoLocalStorage();
    })
    .catch(error => {
        console.error("Não foi possível carregar e renderizar os produtos." + error);
    });