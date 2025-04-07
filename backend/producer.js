// producer.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const redis = require("redis");

const app = express();
app.use(express.json());

// Crear servidor HTTP y configurar Socket.io con CORS
const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: "http://25.0.177.111", // o el puerto correspondiente si es diferente
    methods: ["GET", "POST"]
  }
});

// Conectar a Redis
const redisClient = redis.createClient();
redisClient.connect().then(() => console.log("Conectado a Redis"));

// Ruta para realizar un pedido
app.post("/order", async (req, res) => {
  const { cliente, platillo, vip } = req.body;
  if (!cliente || !platillo) {
    return res.status(400).send("Faltan datos del pedido");
  }

  // Construir el pedido como string JSON
  const order = JSON.stringify({ cliente, platillo, vip: vip || false });

  // Usar una cola para pedidos VIP o regular
  if (vip) {
    await redisClient.rPush("vipOrdersQueue", order);
  } else {
    await redisClient.rPush("ordersQueue", order);
  }

  console.log(`Pedido recibido: ${order}`);

  // Emitir el pedido (como objeto) para actualizar el dashboard
  io.emit("newOrder", JSON.parse(order));
  res.send("Pedido en cola, esperando ser preparado...");
});

// Inicia el servidor si este archivo se ejecuta directamente
if (require.main === module) {
  serverHttp.listen(3000, "0.0.0.0", () => {
    console.log("Servidor corriendo en http://25.51.254.125:3000");
  });
}

module.exports = { redisClient };
