// src/App.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Asegúrate de que la URL coincida con la del servidor
const socket = io("http://localhost:3000");

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on("newOrder", (order) => {
      const orderObj = JSON.parse(order);
      setOrders((prevOrders) => [...prevOrders, orderObj]);
    });

    return () => socket.off("newOrder");
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard de Pedidos</h1>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            {order.vip ? "VIP" : "Regular"}: {order.cliente} - {order.platillo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
