import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditOrdersPage = () => {
  const [order, setOrder] = useState(null);
  const [createdAt, setCreatedAt] = useState('');
  const [store, setStore] = useState('');
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
        setCreatedAt(data.created_at);
        setStore(data.store_name);
        setItems(data.item_prices || []);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

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

  const handleItemSuggestionClick = (itemName, index) => {
    const updatedItems = [...items];
    updatedItems[index].item_name = itemName;
    setItems(updatedItems);
    setItemSuggestions((prev) => {
      const newSuggestions = [...prev];
      newSuggestions[index] = [];
      return newSuggestions;
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedOrder = {
      created_at: createdAt,
      store_name: store,
      item_prices: items,
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
            <input
              type="text"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              required
            />
          </label>
        </div>
        <h2>Items:</h2>
        {items.map((item, index) => (
          <div key={index}>
            <label>
              Item Name:
              <input
                type="text"
                value={item.item_name}
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
                value={item.price}
                onChange={(event) => handleItemPriceChange(index, event)}
                required
              />
            </label>
            <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <button type="submit">Update Order</button>
      </form>
    </div>
  );
};

export default EditOrdersPage;
