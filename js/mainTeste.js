// Importa a função que carrega os produtos
import { getProdutos } from './js/consumoJSON.js';

// --- Variáveis de estado da aplicação ---
let listaDeProdutos = [];
let listaCarrinho = [];

const CARRINHO_STORAGE_KEY = 'listaDeIdsCarrinho';

// --- Seleção de Elementos DOM (melhor ter tudo em um só lugar) ---
const shoppingCartBtn = document.querySelector('.shopping__cart');
const modalBackdrop = document.querySelector('.modal__backdrop');
const modalCloseBtn = document.querySelector('.modal__close');
const cartListContainer = document.querySelector('.modal__shopping__cart');
const shoppingCartBtnNum = document.querySelector('.shopping__cart span');
const totalGeralElemento = document.querySelector('.modal__span__total');
const descontoTotalElemento = document.querySelector('.modal__span__discounts');
const productListContainer = document.querySelector('.product__list');

// --- Lógica do Modal ---
function openModal() {
    modalBackdrop.style.display = 'flex';
    renderizarCarrinho();
}

function closeModal() {
    modalBackdrop.style.display = 'none';
}

shoppingCartBtn.addEventListener('click', openModal);
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
        console.log("Carrinho carregado do localStorage.");
    }
}

function adicionarOuRemoverDoCarrinho(id) {
    const idInt = parseInt(id, 10);
    const itemExistente = listaCarrinho.includes(idInt);

    if (itemExistente) {
        listaCarrinho = listaCarrinho.filter(produtoId => produtoId !== idInt);
    } else {
        listaCarrinho.push(idInt);
    }

    console.log("Carrinho atualizado:", listaCarrinho);
    atualizarQtdCarrinho();
    salvarCarrinhoNoLocalStorage();
}

function renderizarItensCarrinho() {
    cartListContainer.innerHTML = ''; // Limpa o conteúdo antes de renderizar
    if (listaCarrinho.length === 0) {
        cartListContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    const fragmento = document.createDocumentFragment();

    listaCarrinho.forEach(idDoProduto => {
        const produto = listaDeProdutos.find(p => p.id === idDoProduto);
        if (!produto) return;

        const cartCard = document.createElement('div');
        cartCard.classList.add('shopping__card');
        
        // Use uma array para construir o HTML para melhor legibilidade
        const htmlContent = [
            `<p class="shopping__card__name">Nome: <span class="span__shoppingcard__name">${produto.name}</span></p>`,
            `<p class="shopping__card__price">Preço: <span class="span__shoppingcard__price">R$${produto.price.toFixed(2)}</span></p>`
        ];
        
        if (produto.discounts) {
            htmlContent.push(
                `<p class="shopping__card__discounts">Desconto: <span class="span__shoppingcard__discounts">R$${produto.discounts.toFixed(2)}</span></p>`
            );
        }
        
        htmlContent.push(
            `<p class="shopping__card__id">ID: <span class="span__shoppingcard__id">${produto.id}</span></p>`
        );
        
        cartCard.innerHTML = htmlContent.join('');
        fragmento.appendChild(cartCard);
    });

    cartListContainer.appendChild(fragmento);
}

function renderizarTotaisCarrinho() {
    let somaTotal = 0;
    let descontoTotal = 0;

    listaCarrinho.forEach(idDoProduto => {
        const produto = listaDeProdutos.find(p => p.id === idDoProduto);
        if (produto) {
            somaTotal += produto.price;
            if (produto.discounts) {
                descontoTotal += produto.discounts;
            }
        }
    });

    const totalFinal = somaTotal - descontoTotal;
    totalGeralElemento.textContent = `R$${totalFinal.toFixed(2)}`;
    descontoTotalElemento.textContent = `R$${descontoTotal.toFixed(2)}`;
}

function renderizarCarrinho() {
    renderizarItensCarrinho();
    renderizarTotaisCarrinho();
    atualizarQtdCarrinho();
}

function renderizarProdutosNaPagina() {
    productListContainer.innerHTML = '';
    
    // Adiciona o event listener uma única vez ao container pai (delegação de eventos)
    productListContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.product__add__btn');
        if (button) {
            const id = button.dataset.id;
            adicionarOuRemoverDoCarrinho(id);
        }
    });

    listaDeProdutos.forEach(produto => {
        productListContainer.innerHTML += `
            <div class="product__card">
                <img src="${produto.image}" alt="">
                <div class="product__card__info">
                    <h2>${produto.name}</h2>
                    <p>R$${produto.price.toFixed(2)}</p>
                    <button class="product__add__btn" data-id="${produto.id}">
                        <i class="ri-add-line"></i><i class="ri-shopping-cart-line"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

// --- Fluxo Principal da Aplicação ---
async function iniciarApp() {
    try {
        listaDeProdutos = await getProdutos();
        renderizarProdutosNaPagina();
        carregarCarrinhoLocalStorage();
        atualizarQtdCarrinho(); // Garante que o contador está correto ao carregar a página
    } catch (error) {
        console.error("Não foi possível carregar os produtos:", error);
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);