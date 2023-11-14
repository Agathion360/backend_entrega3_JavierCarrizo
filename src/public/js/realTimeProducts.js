const socket = io();

const form = document.querySelector('#formProduct');
const productTable = document.querySelector('#productTable');

socket.emit('load');


const clearForm = () => {
    document.querySelector('#title').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#code').value = '';
    document.querySelector('#stock').value = '';
}


form.addEventListener('submit', event => {
	event.preventDefault();
	const dataForm = new FormData(event.target);
	const product = Object.fromEntries(dataForm);

    
	Swal.fire({
		title: 'Producto creado',
	});
	socket.emit('newProduct', product);
    clearForm();
});

socket.on('products', products => {
	productTable.innerHTML = '';
	products.forEach(prod => {
		productTable.innerHTML += `
    <tr class="cols-table">
    <th scope="row" class="col mx-6 text-center table2">${prod.id}</th>
    <td class="mx-6 text-left title-product table2">${prod.title}</td>
    <td class="mx-6 text-left description-product table2">${prod.description}</td>
    <th class="mx-6 text-center table2">$ ${prod.price}</th>
    <td class="mx-6 text-center table2">${prod.status}</td>
    <td class="mx-6 text-center table2">${prod.code}</td>
    <td class="mx-6 text-center table2">${prod.stock}</td>
 
    </tr>


  
    `;
	});
});
