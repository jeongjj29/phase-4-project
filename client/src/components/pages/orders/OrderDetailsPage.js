import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
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
          <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
          <h2>Item Prices</h2>
          {order.item_prices && order.item_prices.length > 0 ? (
            <ul>
              {order.item_prices.map(itemPrice => (
                <li key={itemPrice.id}>
                  <p>Item ID: {itemPrice.item_id}</p>
                  <p>Price: ${itemPrice.price}</p>
                  <p>Store: {itemPrice.store?.name || 'N/A'}</p>
                  <p>Created At: {new Date(itemPrice.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No item prices found for this order.</p>
          )}
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderDetailsPage;
