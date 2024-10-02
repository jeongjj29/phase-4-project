import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`}>
                Order {order.id}: {order.item_name} - Quantity: {order.quantity}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllOrdersPage;
