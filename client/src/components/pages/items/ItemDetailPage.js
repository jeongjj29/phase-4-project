import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/items/${id}`)
      .then(response => response.json())
      .then(data => setItem(data))
      .catch(err => console.error('Error fetching item:', err));
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h1>Item: {item.name}</h1>
      <p>Item ID: {item.id}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default ItemDetailPage;
