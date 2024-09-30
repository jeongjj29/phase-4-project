import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${id}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  return (
    <div>
      {order ? (
        <div>
          <h1>Order Details</h1>
          <p>ID: {order.id}</p>
          <p>Item Name: {order.item_name}</p>
          <p>Quantity: {order.quantity}</p>
          <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetailsPage;
