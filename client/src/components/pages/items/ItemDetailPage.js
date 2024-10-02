import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemPricesByItemBlock from "../itemPrices/blocks/ItemPricesByItemBlock";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((response) => response.json())
      .then((data) => setItem(data))
      .catch((err) => console.error("Error fetching item:", err));
  }, [id]);

  const handleDelete = () => {
    fetch(`/api/items/${id}`, {
      method: "DELETE",
    })
      .catch((err) => console.error("Error deleting item:", err))
      .then(() => navigate("/items"));
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h1>Item: {item.name}</h1>
      <ItemPricesByItemBlock item_id={item.id} />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default ItemDetailPage;
