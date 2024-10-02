import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateListPage = () => {
  const [listName, setListName] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [items, setItems] = useState([{ itemName: '', quantity: 0 }]);
  const [itemSuggestions, setItemSuggestions] = useState([[]]);
  const navigate = useNavigate();

  const handleItemNameChange = (index, event) => {
    const values = [...items];
    values[index].itemName = event.target.value;
    setItems(values);
    fetchItemSuggestions(index, event.target.value); 
  };

  const handleItemQuantityChange = (index, event) => {
    const values = [...items];
    values[index].quantity = event.target.value;
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
    setItems([...items, { itemName: '', quantity: 0 }]);
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

    const newList = {
      name: listName,
      created_at: createdAt,
      items: items,
    };

    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newList),
      });

      if (response.ok) {
        navigate('/lists');
      } else {
        const errorData = await response.json();
        console.error('Failed to create list:', errorData);
      }
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  return (
    <div>
      <h1>Create New List</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            List Name:
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
            />
          </label>
        </div>
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
        {items.map((item, index) => (
          <div key={index}>
            <label>
              Item Name:
              <input
                type="text"
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
              Quantity:
              <input
                type="number"
                value={item.quantity}
                onChange={(event) => handleItemQuantityChange(index, event)}
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <button type="submit">Create List</button>
      </form>
    </div>
  );
};

export default CreateListPage;
