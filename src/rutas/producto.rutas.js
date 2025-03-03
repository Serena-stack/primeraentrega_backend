import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";


const router = Router();
const ProductManagerInstance = new ProductManager();

router.get("/", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await ProductManagerInstance.getProducts(limit);
    res.json(products);
});

router.get("/:pid", async (req, res) => {
    const product = await ProductManagerInstance.getProductById(parseInt(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
});

router.post("/", async (req, res) => {
    const product = req.body;
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios excepto thumbnails" });
    }
    const newProduct = await ProductoManagerInstance.addProduct(product);
    res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
    const updatedProduct = await ProductoManagerInstance.updateProduct(parseInt(req.params.pid), req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "Producto no encontrado" });
});

router.delete("/:pid", async (req, res) => {
    await ProductoManagerInstance.deleteProduct(parseInt(req.params.pid));
    res.json({ message: "Producto eliminado" });
});

export default router;
