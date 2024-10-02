import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditListPage = () => {
    const { id } = useParams(); // Get the list ID from the URL parameters
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [itemSuggestions, setItemSuggestions] = useState([]);

    // Fetch the list details and all items for the dropdown
    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get(`/api/lists/${id}`);
                setList(response.data);
                setTitle(response.data.title);
                setItems(response.data.items);
            } catch (error) {
                console.error('Error fetching list:', error);
            }
        };

        const fetchAllItems = async () => {
            try {
                const response = await axios.get('/api/items');
                setAllItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchList();
        fetchAllItems();
    }, [id]);

    // Handle form submission to update the list
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/lists/${id}`, {
                title,
                items,
            });
            navigate('/lists'); // Redirect to lists page after updating
        } catch (error) {
            console.error('Error updating list:', error);
        }
    };

    const handleAddItem = (itemId) => {
        if (!items.some(item => item.id === itemId)) {
            const itemToAdd = allItems.find(item => item.id === itemId);
            if (itemToAdd) {
                setItems([...items, itemToAdd]);
            }
        }
    };

    const handleRemoveItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const handleItemSearchChange = async (query) => {
        if (!query) {
            setItemSuggestions([]);
            return;
        }
        
        try {
            const response = await axios.get(`/api/items/search?query=${query}`);
            setItemSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching item suggestions:', error);
        }
    };

    if (!list) return <div>Loading...</div>;

    return (
        <div>
            <h1>Edit List</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <h3>Items:</h3>
                    <input
                        type="text"
                        placeholder="Search items..."
                        onChange={(e) => handleItemSearchChange(e.target.value)}
                    />
                    <ul>
                        {itemSuggestions.map(item => (
                            <li key={item.id}>
                                {item.name}
                                <button type="button" onClick={() => handleAddItem(item.id)}>
                                    Add
                                </button>
                            </li>
                        ))}
                    </ul>
                    <ul>
                        {items.map(item => (
                            <li key={item.id}>
                                {item.name}
                                <button type="button" onClick={() => handleRemoveItem(item.id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Update List</button>
            </form>
        </div>
    );
};

export default EditListPage;
