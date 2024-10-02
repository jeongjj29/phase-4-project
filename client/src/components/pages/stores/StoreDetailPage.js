import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PurchasesByStoreBlock from "./blocks/PurchasesByStoreBlock";
import ItemsByStoreBlock from "./blocks/ItemsByStoreBlock";

const StoreDetailPage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(() => {
    fetch(`/api/stores/${id}`)
      .then((response) => response.json())
      .then((data) => setStore(data))
      .catch((err) => console.error("Error fetching store:", err));
  }, [id]);



  if (!store) return <p>Loading...</p>;

  return (
    <div>
      <h1>Store: {store.name}</h1>
      <Link to={`/stores/${id}/edit`} className="btn">
        Edit
      </Link>
      <PurchasesByStoreBlock id={store.id} name={store.name} />
      <ItemsByStoreBlock id={store.id} name={store.name} />


    </div>
  );
};

export default StoreDetailPage;
