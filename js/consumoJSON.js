// A função que carrega os produtos de forma assíncrona
export function getProdutos() {
    return fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON: ' + response.statusText);
            }
            return response.json();
        })
        .then(produtosJSON => {
            console.log("Produtos disponíveis:", produtosJSON);
            return produtosJSON; // Retorna a lista de produtos
        })
        .catch(error => {
            console.error('Houve um problema com a operação de busca:', error);
            throw error; // Propaga o erro
        });
}
// O resto do código (renderização) deve ficar em outro arquivo
// que importa esta função, para separar as responsabilidades.