const socket = io();

const productsContainer = document.querySelector('#products-container');

socket.emit('load');

socket.on('products', products => {
    if (products !== null) { 
        productsContainer.innerHTML = '';
        products.forEach(prod => {
            productsContainer.innerHTML += `
            <tr class="cols-table">
            <th scope="row" class="col mx-6 text-center">${prod.id}</th>
            <td class="mx-6 text-left title-product">${prod.title}</td>
            <td class="mx-6 text-left description-product">${prod.description}</td>
            <th class="mx-6 text-center">$ ${prod.price}</th>
            <td class="mx-6 text-center">${prod.status}</td>
            <td class="mx-8 text-center">${prod.code}</td>
            <td class="mx-6 text-center">${prod.stock}</td>
          </tr>`;
    });
} else {
    console.log("El array de productos es null.");
}
});