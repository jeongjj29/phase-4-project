import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllItemPricesPage = () => {
  const [itemPrices, setItemPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemPrices = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/purchases'); // Ensure this route returns item prices directly
        setItemPrices(response.data);
      } catch (err) {
        setError('Error fetching item prices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemPrices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Purchases</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Store</th>
            <th>Item</th>
            <th>Price</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {itemPrices.map((itemPrice) => (
            <tr key={itemPrice.id}>
              <td>
                <Link to={`/purchases/${itemPrice.id}`}>View Purchase</Link>
              </td>
              <td>
                <Link to={`/stores/${itemPrice.store.id}`}>{itemPrice.store.name}</Link>
              </td>
              <td>
                <Link to={`/items/${itemPrice.item.id}`}>{itemPrice.item.name}</Link>
              </td>
              <td>${itemPrice.price.toFixed(2)}</td>
              <td>{new Date(itemPrice.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllItemPricesPage;
