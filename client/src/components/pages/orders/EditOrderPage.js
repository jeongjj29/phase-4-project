import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const EditOrdersPage = () => {
  const [order, setOrder] = useState(null);
  const [createdAt, setCreatedAt] = useState('');  
  const [store, setStore] = useState('');  
  const [storeSuggestions, setStoreSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const [itemSuggestions, setItemSuggestions] = useState([[]]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        setOrder(data);
        setCreatedAt(data.created_at.split(" ")[0]); // Set date in 'YYYY-MM-DD' format
        setStore(data.store_name);
        setItems(data.item_prices || []);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStoreChange = (event, value) => {
    setStore(value);
    if (value) {
      fetchStoreSuggestions(value);
    } else {
      setStoreSuggestions([]);
    }
  };

  const fetchStoreSuggestions = async (query) => {
    try {
      const response = await fetch(`/api/stores/search?query=${query}`);
      const data = await response.json();
      setStoreSuggestions(data);
    } catch (error) {
      console.error('Error fetching store suggestions:', error);
    }
  };

  const handleItemNameChange = (index, event) => {
    const values = [...items];
    values[index].item_name = event.target.value;
    setItems(values);
    fetchItemSuggestions(index, event.target.value);
  };

  const handleItemPriceChange = (index, event) => {
    const values = [...items];
    values[index].price = event.target.value;
    setItems(values);
  };

  const fetchItemSuggestions = async (index, query) => {
    if (!query) {
      setItemSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = [];
        return newSuggestions;
      });
      return;
    }

    try {
      const response = await fetch(`/api/items/search?query=${query}`);
      const data = await response.json();
      setItemSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = data;
        return newSuggestions;
      });
    } catch (error) {
      console.error('Error fetching item suggestions:', error);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { item_name: '', price: 0 }]);
    setItemSuggestions((prev) => [...prev, []]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure the updatedOrder includes the correct store name
    const updatedOrder = {
        created_at: createdAt,
        store_name: store.trim(), // Trim in case of whitespace
        item_prices: items.map(item => ({
            item_name: item.item_name,
            price: parseFloat(item.price) // Ensure price is a float
        })),
    };

    try {
        const response = await fetch(`/api/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrder),
        });

        if (response.ok) {
            navigate('/orders');
        } else {
            const errorData = await response.json();
            console.error('Failed to update order:', errorData);
        }
    } catch (error) {
        console.error('Error updating order:', error);
    }
};

  

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Created At:
            <input
              type="date"
              value={createdAt}  
              onChange={(e) => setCreatedAt(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Store:
            <Autocomplete
              freeSolo
              options={storeSuggestions.map((option) => option.name)}
              value={store}  
              onChange={handleStoreChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Store"
                  onChange={(e) => handleStoreChange(e, e.target.value)}
                  required
                />
              )}
            />
          </label>
        </div>
        <h2>Items:</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <Autocomplete
                    freeSolo
                    options={itemSuggestions[index]?.map((option) => option.name) || []}
                    value={item.item_name}
                    onChange={(event, newValue) => handleItemNameChange(index, { target: { value: newValue } })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Item Name"
                        onChange={(event) => handleItemNameChange(index, event)}
                        required
                      />
                    )}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(event) => handleItemPriceChange(index, event)}
                    required
                  />
                </td>
                <td>
                  <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
};

export default EditOrdersPage;
