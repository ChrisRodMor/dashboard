import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Asegúrate de apuntar al puerto donde corre tu servidor
const socket = io("http://localhost:3000");

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Escuchamos el evento 'newOrder' del servidor
    socket.on("newOrder", (order) => {
      // order ya es un objeto (no hace falta JSON.parse)
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    // Limpiamos el listener cuando el componente se desmonta
    return () => socket.off("newOrder");
  }, []);

  return (
    <div>
      <h1>Dashboard de Pedidos</h1>
      <ul>
        {orders.map((o, index) => (
          <li key={index}>
            {o.vip ? "VIP" : "Regular"}: {o.cliente} - {o.platillo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
