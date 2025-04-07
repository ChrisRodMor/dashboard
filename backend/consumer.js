// consumer.js
const redis = require("redis");
const redisClient = redis.createClient({
  url: "redis://25.51.254.125:6379"
});

redisClient.connect().then(() => console.log("Conectado a Redis - Cocina lista"));


async function processOrders() {
  while (true) {
    // Primero intenta obtener un pedido VIP
    let order = await redisClient.lPop("vipOrdersQueue");

    // Si no hay VIP, intenta con la cola regular
    if (!order) {
      order = await redisClient.lPop("ordersQueue");
    }

    if (order) {
      const orderObj = JSON.parse(order);
      if (orderObj.vip) {
        console.log(`Preparando pedido VIP de ${orderObj.cliente}: ${orderObj.platillo}...`);
      } else {
        console.log(`Preparando pedido de ${orderObj.cliente}: ${orderObj.platillo}...`);
      }
      // Simula 5 segundos de preparación
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log(`Pedido listo para ${orderObj.cliente}: ${orderObj.platillo}`);
    } else {
      console.log("Esperando nuevos pedidos...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

processOrders();
