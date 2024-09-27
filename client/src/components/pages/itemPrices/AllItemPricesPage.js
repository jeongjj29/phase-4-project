import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllItemPricesPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/item_prices');
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
                <Link to={`/orders/${index}`}>View Order</Link>
              </td>
              <td><Link to={`/stores/${order.store.id}`}>{order.store.name}</Link></td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                     <Link to={`/items/${item.id}`}> {item.item_name}</Link> - ${item.price.toFixed(2)}
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

export default AllItemPricesPage;
