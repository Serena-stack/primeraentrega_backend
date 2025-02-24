import fs from "fs";
import { io } from "../server.js";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer productos:", error);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const newProduct = { id: products.length + 1, ...product, status: true };
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      
      // Notificar a todos los clientes conectados
      io.emit("updateProducts", products);

      return newProduct;
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((p) => p.id !== id);
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
    
    // Notificar actualización a WebSocket
    io.emit("updateProducts", filteredProducts);
    
    return true;
  }
}

export default ProductManager;
