import fs from 'fs'


export default class ProductManager {
    
    static genId = 0

    constructor(path) {
        this.path = path
        this.products = []
        
        
    }

async initProduct() {
    try {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        this.products = JSON.parse(data);

        // Inicializa genId con el ID más alto en el array de productos, más uno
        const highestId = this.products.reduce((max, product) => Math.max(max, product.id), 0);
        ProductManager.genId = highestId + 1;
    } catch (error) {
        console.error("Error al inicializar el producto:", error.message);
    }
}


async addProduct(product) {
    try {
        await this.initProduct()
        
        product.id = ProductManager.genId++  //chequear este metodo

        if (this.products.some(prod => prod.code === product.code)) {
            console.log(`Error, el código ${product.code} está repetido`)
            return
        } else if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
            console.log('Error, todos los campos son obligatorios')
            return
        } else {
            product.status = true;  // Agregar status por defecto
            this.products.push(product)
            console.log('Producto agregado correctamente')
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        }

    } catch (error) {
        console.error("Error al agregar el producto:", error.message)
    }
}



    async getProducts() {
        try{
            await this.initProduct()
            return this.products

        }
        catch(error){
            console.error("Error al obtener la lista de productos:", error.message)
        }
    }

    async getProductsById(id) {
      try{
        await this.initProduct()

         return this.products.find(prod => prod.id === id)
       
        }
        catch(error){
            console.error("Error al obtener la lista de productos:", error.message)
        }
    }
       
   
    

    async updateProduct(id, data) {
       
       try  {
        await this.initProduct()
        const productIndex = this.products.findIndex(prod => prod.id === id)

        if (productIndex !== -1) {
            
            for (const key in data) {
                if (key in this.products[productIndex]) {
                    this.products[productIndex][key] = data[key]
                }
            }

            console.log('Producto actualizado correctamente')
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } else {
            console.log(`El producto con ID: ${id} no existe`)
        }
        
       }catch(error){
           console.error("Error al actualizar el producto:", error.message)
       }
       
    }

    async deleteProduct(id) {
        try{
            await this.initProduct()
            const product = this.products.find(prod => prod.id === id)
            if (product) {
                this.products = this.products.filter(prod => prod.id !== id)
                console.log('Producto eliminado correctamente')
            } else {
                console.log(`El producto con ID: ${id} no existe`)
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        }
        catch(error){
            console.error("Error al eliminar el producto:", error.message)
        }
    }
}
const productManager = new ProductManager()

