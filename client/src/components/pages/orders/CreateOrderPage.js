import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateOrderPage = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newOrder = {
      item_name: itemName,
      quantity: quantity,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        // Redirect to the All Orders Page after successful creation
        navigate('/orders');
      } else {
        console.error('Failed to create order:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <h1>Create Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Item Name:
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <button type="submit">Add Order</button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
