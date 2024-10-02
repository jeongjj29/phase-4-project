import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateOrderPage = () => {
  const [createdAt, setCreatedAt] = useState('');
  const [store, setStore] = useState('');
  const [storeSuggestions, setStoreSuggestions] = useState([]);
  const [items, setItems] = useState([{ itemName: '', price: 0 }]);
  const [itemSuggestions, setItemSuggestions] = useState([[]]);
  const navigate = useNavigate();

  const handleItemNameChange = (index, event) => {
    const values = [...items];
    values[index].itemName = event.target.value;
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

  const fetchStoreSuggestions = async (query) => {
    if (!query) {
      setStoreSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/stores/search?query=${query}`);
      const data = await response.json();
      setStoreSuggestions(data);
    } catch (error) {
      console.error('Error fetching store suggestions:', error);
    }
  };

  const handleStoreChange = (event) => {
    setStore(event.target.value);
    fetchStoreSuggestions(event.target.value);
  };

  const handleStoreSuggestionClick = (storeName) => {
    setStore(storeName);
    setStoreSuggestions([]);
  };

  const handleAddItem = () => {
    setItems([...items, { itemName: '', price: 0 }]);
    setItemSuggestions((prev) => [...prev, []]); 
  };

  const handleItemSuggestionClick = (itemName, index) => {
    const updatedItems = [...items];
    updatedItems[index].itemName = itemName;
    setItems(updatedItems);
    setItemSuggestions((prev) => {
      const newSuggestions = [...prev];
      newSuggestions[index] = [];
      return newSuggestions;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedCreatedAt = createdAt;

    const newOrder = {
        created_at: formattedCreatedAt,
        store_name: store,
        items: items,
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
            navigate('/orders');
        } else {
            const errorData = await response.json();
            console.error('Failed to create order:', errorData);
        }
    } catch (error) {
        console.error('Error creating order:', error);
    }
};



  return (
    <div>
      <h1>Create New Order</h1>
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
            <input
              type="text"
              value={store}
              onChange={handleStoreChange}
              required
            />
            <ul>
              {storeSuggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleStoreSuggestionClick(suggestion.name)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          </label>
        </div>
        {items.map((item, index) => (
          <div key={index}>
            <label>
              Item Name:
              <input
                type="text"
                name="itemName"
                value={item.itemName}
                onChange={(event) => handleItemNameChange(index, event)}
                required
              />
              <ul>
                {itemSuggestions[index]?.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleItemSuggestionClick(suggestion.name, index)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={item.price}
                onChange={(event) => handleItemPriceChange(index, event)}
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
