import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ItemPricesByItemBlock from './blocks/ItemPricesByItemBlock.js';

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
      <h1>{itemPrice.item.name}</h1>
      <h1>${itemPrice.price}</h1>
      <p>Store:  <Link to={`/stores/${itemPrice.store.id}`}>{itemPrice.store.name}</Link></p>
      <ItemPricesByItemBlock item_id={itemPrice.item_id} />
    </div>
  );
};

export default ItemPriceDetailPage;
