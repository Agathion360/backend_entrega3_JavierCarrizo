import express from 'express';
import ProductManager from './ProductManager.js';



const app = express();
const PORT = 8090;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productManager = new ProductManager("./src/Products.json");


app.get('/products', async (req, res) => {

    try {

        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();

        if (!isNaN(limit)) {
            res.status(200).json(products.slice(0, limit));
           
        }else{
            res.status(200).json(products);
        }

    } catch (error) {
        console.error("Error al obtener la lista de productos:", error.message);
        res.status(500).json({ error: "Error al obtener la lista de productos" });
    }
})



app.get('/products/:pid', async (req, res) => {
    try {

        const productId = parseInt(req.params.pid)
        const producto = await productManager.getProductsById(productId)
    
        if (producto) {
          res.json(producto)
        } else {
          res.status(404).send('Producto no encontrado')
        }


      
    } catch (error) {
        console.error("Error al obtener el producto:", error.message);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
})



app.get('*', (req, res) => {
    res.status(404).send('<h1 style="color:red">Error 404, Not Found</h1>');
});


app.listen(PORT, () => {
    console.log(`server on port ${PORT} `);
    console.log(`http://localhost:${PORT}`);
});
