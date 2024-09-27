import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllItemPricesPage = () => {
  const [itemPrices, setItemPrices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/item_prices')
      .then((response) => {
        setItemPrices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching item prices:', error);
      });
  }, []);

  return (
    <div>
      <h1>All Item Prices</h1>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Store</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {itemPrices.map(itemPrice => (
            <tr key={itemPrice.id}>
              <td>{itemPrice.item}</td>
              <td>{itemPrice.store}</td>
              <td>${itemPrice.price.toFixed(2)}</td>
              <td>{new Date(itemPrice.created_at).toLocaleDateString()}</td>
              <td>{new Date(itemPrice.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllItemPricesPage;
