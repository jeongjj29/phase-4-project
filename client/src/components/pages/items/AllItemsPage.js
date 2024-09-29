import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

const AllItemsPage = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [listTitle, setListTitle] = useState('');
  const [listId, setListId] = useState(null);    

  useEffect(() => {
    axios.get('http://localhost:3001/api/items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const handleCheckboxChange = (item) => {
    if (cartItems.includes(item)) {
      setCartItems(cartItems.filter(i => i.id !== item.id));
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleSaveList = () => {
    if (!listTitle) {
      alert("Please provide a title for the shopping list.");
      return;
    }

    const listData = {
      title: listTitle,
      items: cartItems.map(item => item.id),
    };

    if (listId) {
      axios.put(`http://localhost:3001/api/lists/${listId}`, listData)
        .then(() => {
          alert("Shopping list updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating list:", error);
        });
    } else {
      axios.post('http://localhost:3001/api/lists', listData)
        .then((response) => {
          setListId(response.data.id);
          alert("Shopping list created successfully!");
        })
        .catch((error) => {
          console.error("Error creating list:", error);
        });
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '70%' }}>
        <h1>All Items</h1>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '10px' }}>Add to Cart</th>
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
                  <input 
                    type="checkbox" 
                    checked={cartItems.includes(item)}
                    onChange={() => handleCheckboxChange(item)} 
                  />
                </td>
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

      <div style={{ width: '30%', padding: '20px', borderLeft: '1px solid #ccc' }}>
        <h2>List</h2>
        <input 
          type="text" 
          placeholder="Shopping List Title" 
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)} 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
        />
        <button onClick={handleSaveList}
        style={{
          'position': 'absolute',
          'marginTop': '-50px',
          'margineft': '260px',

        }}><AddIcon /></button>
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} 
              <button onClick={() => handleRemoveFromCart(item.id)}><ClearIcon /></button>
            </li>
          ))}
        </ul>
        
      </div>
    </div>
  );
};

export default AllItemsPage;
