import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
          <Link to={`/orders/${id}/edit`} className="btn">
            Edit
          </Link>
          <p>Date: {new Date(order.created_at).toLocaleString()}</p>
          <p>Store: {order.store_name || 'N/A'}</p> {/* Show store_name here */}
          <h2>Item Prices</h2>
          {order.item_prices && order.item_prices.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {order.item_prices.map(itemPrice => (
                  <tr key={itemPrice.id}>
                    <td>{itemPrice.item_name}</td> {/* Show item name if needed */}
                    <td>${itemPrice.price}</td>
                    <td>{new Date(itemPrice.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
