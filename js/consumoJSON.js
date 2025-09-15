fetch('products.json')
    .then(response => {
        
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON: ' + response.statusText);
        }
        
        return response.json();
    })
    .then(listaDeProdutos => {

        const productList = document.querySelector('.product__list');

        listaDeProdutos.forEach(produto => {

            productList.innerHTML += `
            <div class="product__card">

                <img src="${produto.image}" alt="">

                <div class="product__card__info">
                    <h2>${produto.name}</h2>
                    <p>R$${produto.price}</p>
                    <p>${produto.id}</p>
                    <button><i class="ri-add-line"></i><i class="ri-shopping-cart-line"></i></button>
                </div>
                
            </div>
            `;

        })
        
        // console.log(listaDePessoas);
        // console.log(listaDePessoas[1].nome);
    })
    .catch(error => {
        console.error('Houve um problema com a operação de busca:', error);
    });