import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("data", "carrito.json");

class CartManager {
    constructor() {
        this.path = filePath;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
        const newCart = { id, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

export default CartManager;
