import express from 'express';
import products from './routes/products.routes.js';
import ProductManager from './controllers/ProductManager.js';
import { __dirname } from './path.js';
import path from 'path';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';



const dataPath = path.resolve(__dirname, './data/Products.json');
const productManager = new ProductManager(dataPath);
const app = express();
const PORT = 8090;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//SERVER
const server = app.listen(PORT, () => {
    console.log(`Servidor desde puerto: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
const io = new Server(server);



// handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Conexión con socket.io
io.on('connection', socket => {
	console.log('Conexión con Socket.io');

	socket.on('load', async () => {
		const products = await productManager.getProducts();
		socket.emit('products', products);
        
        
	});

	socket.on('newProduct', async product => {
		await productManager.addProduct(product);
		const products = await productManager.getProducts();
		socket.emit('products', products);
       
	});
});

app.use('/products', products);

//routes handlebars
app.use(express.static(path.join(__dirname, '/public')));

app.get('/home', (req, res) => {
    res.render('home', {
        routeCSS: 'home',
        rutaJs: 'home',
        title:'Home'
    });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        routeCSS: 'realTimeProducts',
        rutaJs: 'realTimeProducts',
        title:'Create Products'
    });
});

app.get('*', (req, res) => {
    res.status(404).send('<h1 style="color:red">Error 404, Not Found</h1>');
});
