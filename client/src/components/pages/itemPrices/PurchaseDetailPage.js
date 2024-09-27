import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PurchaseDetailPage = () => {
  const { id } = useParams(); // Get the id from the URL
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/purchases/${id}`);
        setPurchase(response.data);
      } catch (err) {
        setError('Error fetching purchase details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Purchase Details</h1>
      {purchase && (
        <div>
          <h2>Purchase ID: {purchase.id}</h2>
          <p>Price: ${purchase.price.toFixed(2)}</p>
          <p>Created At: {new Date(purchase.created_at).toLocaleString()}</p>
          <p>Store: {purchase.store.name}</p>
          <p>Item: {purchase.item.name}</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseDetailPage;
