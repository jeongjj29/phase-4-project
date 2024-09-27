import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PurchasesByStoreBlock from './blocks/PurchasesByStoreBlock';
import ItemsByStoreBlock from './blocks/ItemsByStoreBlock';

const StoreDetailPage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/stores/${id}`)
      .then(response => response.json())
      .then(data => setStore(data))
      .catch(err => console.error('Error fetching store:', err));
  }, [id]);

  if (!store) return <p>Loading...</p>;

  return (
    <div>
      <h1>Store: {store.name}</h1>
      <p>Store ID: {store.id}</p>
      <PurchasesByStoreBlock />  
      <ItemsByStoreBlock />  
    </div>
  );
};

export default StoreDetailPage;
