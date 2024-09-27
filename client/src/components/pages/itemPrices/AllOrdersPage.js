import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const groupedOrders = groupOrdersByStoreAndDate(data);
        setOrders(groupedOrders);
      } catch (err) {
        setError('Error fetching orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const groupOrdersByStoreAndDate = (data) => {
    const ordersMap = {};

    data.forEach((price) => {
      const date = new Date(price.created_at);
      const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`; // Format as MM-DD-YYYY
      const storeId = price.store.id;

      const orderKey = `${storeId}_${formattedDate}`;

      if (!ordersMap[orderKey]) {
        ordersMap[orderKey] = {
          store: price.store,
          created_at: formattedDate, // Store the formatted date here
          items: [],
        };
      }

      ordersMap[orderKey].items.push({
        id: price.item.id,
        name: price.item.name,
        price: price.price,
      });
    });

    return Object.values(ordersMap);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Store</th>
            <th>Created At</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>
                <Link to={`/order?store=${order.store.name}&date=${order.created_at}`}>View Order</Link>
              </td>
              <td><Link to={`/stores/${order.store.id}`}>{order.store.name}</Link></td>
              <td>{order.created_at}</td>
              <td>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                     <Link to={`/items/${item.id}`}> {item.name}</Link> - ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrdersPage;
