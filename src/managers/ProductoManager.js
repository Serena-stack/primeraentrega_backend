import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("data", "productos.json");

class ProductoManager {
    constructor() {
        this.path = filePath;
    }

    async getProducts(limit) {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            const products = JSON.parse(data);
            return limit ? products.slice(0, limit) : products;
        } catch {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id) || null;
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const id = products.length ? products[products.length - 1].id + 1 : 1;
        const newProduct = { id, ...product, status: true };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updatedFields };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        products = products.filter(p => p.id !== id);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

export default ProductoManager;
