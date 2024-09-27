import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemPriceDetailPage = () => {
  const { id } = useParams();
  const [itemPrice, setItemPrice] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/item_prices/${id}`)
      .then(response => response.json())
      .then(data => setItemPrice(data))
      .catch(err => console.error('Error fetching item price:', err));
  }, [id]);

  if (!itemPrice) return <p>Loading...</p>;

  return (
    <div>
      <h1>Item Price: {itemPrice.price}</h1>
      <p>Item ID: {itemPrice.item_id}</p>
      <p>Store ID: {itemPrice.store_id}</p>
      <p>Price: ${itemPrice.price}</p>
    </div>
  );
};

export default ItemPriceDetailPage;
