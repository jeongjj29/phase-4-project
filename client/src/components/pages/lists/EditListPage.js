import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const EditListPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [list, setList] = useState({ title: '', items: [] });
    const [itemSuggestions, setItemSuggestions] = useState([[]]);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await fetch(`/api/lists/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setList(data);
                console.log('Fetched List Data:', data); 
            } catch (error) {
                console.error('Error fetching list:', error);
            }
        };

        fetchList();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log('Submitting:', list);
    
        try {
            const response = await fetch(`/api/lists/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: list.title, 
                    items: list.items.map(item => ({ name: item.name })), 
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            // Navigate to the updated list's details page
            navigate(`/lists/${id}`);
        } catch (error) {
            console.error('Error updating list:', error);
        }
    };

    const handleTitleChange = (e) => {
        setList(prevList => ({ ...prevList, title: e.target.value })); 
        console.log('Current Title Value:', e.target.value); 
    };

    const handleItemNameChange = (index, value) => {
        setList(prevList => {
            const updatedItems = [...prevList.items];
            updatedItems[index].name = value; 
            return { ...prevList, items: updatedItems };
        });
        fetchItemSuggestions(index, value); 
    };

    const fetchItemSuggestions = async (index, query) => {
        if (!query) {
            setItemSuggestions(prev => {
                const newSuggestions = [...prev];
                newSuggestions[index] = [];
                return newSuggestions;
            });
            return;
        }

        try {
            const response = await fetch(`/api/items/search?query=${query}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setItemSuggestions(prev => {
                const newSuggestions = [...prev];
                newSuggestions[index] = data; 
                return newSuggestions;
            });
        } catch (error) {
            console.error('Error fetching item suggestions:', error);
        }
    };

    const handleAddItem = () => {
        setList(prevList => ({
            ...prevList,
            items: [...prevList.items, { name: '', id: null }], 
        }));
        setItemSuggestions(prev => [...prev, []]); 
    };

    const handleRemoveItem = (index) => {
        setList(prevList => {
            const updatedItems = prevList.items.filter((_, i) => i !== index);
            return { ...prevList, items: updatedItems }; 
        });
        setItemSuggestions(prev => prev.filter((_, i) => i !== index)); 
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
                        value={list.title} 
                        onChange={handleTitleChange} 
                        required
                    />
                </div>
                <h3>Items:</h3>
                {list.items.map((item, index) => (
                    <div key={index}>
                        <Autocomplete
                            freeSolo
                            options={itemSuggestions[index]?.map(option => option.name) || []}
                            value={item.name}
                            onChange={(event, newValue) => handleItemNameChange(index, newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Item Name"
                                    required
                                    onChange={(event) => handleItemNameChange(index, event.target.value)}
                                />
                            )}
                        />
                        <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddItem}>Add Item</button>
                <button type="submit">Update List</button>
            </form>
        </div>
    );
};

export default EditListPage;
