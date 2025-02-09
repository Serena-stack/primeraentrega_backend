import express from "express";
import productorutas from "./rutas/producto.rutas.js";
import cartsRoutes from "./rutas/carts.routes.js";

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/productos", productorutas);
app.use("/api/carts", cartsRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
