import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const OrderDetailPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      const params = new URLSearchParams(location.search);
      const store = params.get("store");
      const date = params.get("date");

      try {
        const response = await fetch(`/api/order?store=${store}&date=${date}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Error fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [location.search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Order Details</h1>
      {orders.length === 0 ? (
        <div>No orders found for the specified store and date.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Purchased At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.item.name}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderDetailPage;
