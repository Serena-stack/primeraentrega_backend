import express from "express";
import path from 'path';
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productorutas from "./rutas/producto.rutas.js";
import cartsroutes from "./rutas/carts.routes.js";
import viewsrutas from "./rutas/views.rutas.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import ProductManager from "./managers/ProductManager.js";

const productManager = new ProductManager("src/data/productos.json");

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/api/products", productorutas);
app.use("/api/carts", cartsroutes);
app.use("/", viewsrutas);

// Servidor HTTP y WebSocket
const server = app.listen(8080, () => console.log("🔥 Servidor en http://localhost:8080"));
const io = new Server(server);

// WebSocket para productos en tiempo real
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviar productos cuando un cliente se conecta
  socket.emit("productos", productManager.getProducts());

  // Escuchar cuando se agrega un nuevo producto
  socket.on("nuevoProducto", async (producto) => {
    await productManager.addProduct(producto);
    io.emit("productos", productManager.getProducts()); // Actualizar todos los clientes
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

export { io };



