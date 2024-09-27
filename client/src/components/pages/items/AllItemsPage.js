import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AllItemsPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <div>
      <h1>All Items</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Image</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Item Name</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Category</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Group</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Form</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Department</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Count</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Size</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                {item.image_url && item.image_url.trim() !== '' ? (
                  <img 
                    src={`/assets/item_images/${item.image_url}`} 
                    alt={item.name} 
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                  />
                ) : null}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                <Link to={`/items/${item.id}`}>{item.name}</Link>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.category}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.group}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.form}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.department}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.count}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{item.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllItemsPage;
