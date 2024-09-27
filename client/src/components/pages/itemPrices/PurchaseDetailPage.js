import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PurchaseDetailPage = () => {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/purchases/${id}`
        );
        setPurchase(response.data);
      } catch (err) {
        setError("Error fetching purchase details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [id]);

  const handleClick = () => {
    fetch(`http://localhost:3001/api/purchases/${id}`, {
      method: "DELETE",
    })
      .catch((err) => console.error("Error deleting purchase:", err))
      .then(() => navigate("/purchases"));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Purchase: {purchase.item.name}</h1>
      {purchase && (
        <div>
          <p>
            <Link to={`/stores/${purchase.store.id}`}>
              {purchase.store.name}
            </Link>
          </p>
          <p>Price: ${purchase.price.toFixed(2)}</p>
          <p>Created At: {new Date(purchase.created_at).toLocaleString()}</p>
          <p>Store: {purchase.store.name}</p>
        </div>
      )}
      <button onClick={handleClick}>Delete</button>
    </div>
  );
};

export default PurchaseDetailPage;
