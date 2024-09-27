import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PurchasesByStoreBlock from "./blocks/PurchasesByStoreBlock";
import ItemsByStoreBlock from "./blocks/ItemsByStoreBlock";

const StoreDetailPage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/stores/${id}`)
      .then((response) => response.json())
      .then((data) => setStore(data))
      .catch((err) => console.error("Error fetching store:", err));
  }, [id]);

  const handleClick = () => {
    fetch(`http://localhost:3001/api/stores/${id}`, {
      method: "DELETE",
    })
      .catch((err) => console.error("Error deleting store:", err))
      .then(() => navigate("/stores"));
  };

  if (!store) return <p>Loading...</p>;

  return (
    <div>
      <h1>Store: {store.name}</h1>
      <PurchasesByStoreBlock />
      <ItemsByStoreBlock />
    </div>
  );
};

export default StoreDetailPage;
