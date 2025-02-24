import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productorutas from "./rutas/producto.rutas.js";
import cartsRoutes from "./rutas/carts.routes.js";

const app = express();
const PORT = 8080;

const __dirname = path.resolve();

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "src/public")));

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", viewsRoutes);

// Servidor HTTP y WebSocket
const server = app.listen(8080, () => console.log("🔥 Servidor en http://localhost:8080"));
const io = new Server(server);

// WebSocket para productos en tiempo real
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

export { io };


