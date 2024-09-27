import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders');
        const groupedOrders = groupOrdersByStoreAndDate(response.data);
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
      const date = new Date(price.created_at).toLocaleDateString();
      const storeId = price.store.id;

      const orderKey = `${storeId}_${date}`;

      if (!ordersMap[orderKey]) {
        ordersMap[orderKey] = {
          store: price.store,
          created_at: price.created_at,
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
                <Link to={`/purchase?store=${order.store.id}&date=${new Date(order.created_at).toLocaleDateString()}`}>View Order</Link>
              </td>
              <td><Link to={`/stores/${order.store.id}`}>{order.store.name}</Link></td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
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
