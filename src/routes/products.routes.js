import { Router } from "express";
import ProductManager from '../controllers/ProductManager.js';
import { __dirname } from '../path.js';
import path from 'path'; // Añade esta línea

const dataPath = path.resolve(__dirname, './data/Products.json');
const productManager = new ProductManager(dataPath);
const router = Router();


router.get('/', async (req, res) => {

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


router.get('/:id', async (req, res) => {
    try {

        const productId = parseInt(req.params.id)
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


router.post('/', async (req, res) => {
    try {

        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.status(201).json({ message: "Producto agregado correctamente" });

    } catch (error) {
        console.error("Error al agregar el producto:", error.message);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
})

router.put('/:id', async (req, res) => {
    try {

        const productId = parseInt(req.params.id)
        const product = req.body
        await productManager.updateProduct(productId, product)
        res.json({ message: "Producto actualizado correctamente" })

    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
})


router.delete('/:id', async (req, res) => {
    try {

        const productId = parseInt(req.params.id)
        await productManager.deleteProduct(productId)
        res.json({ message: "Producto eliminado correctamente" })

    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
})




export default router;