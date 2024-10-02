import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ItemPricesByItemBlock from "../itemPrices/blocks/ItemPricesByItemBlock";

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);


  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then((response) => response.json())
      .then((data) => setItem(data))
      .catch((err) => console.error("Error fetching item:", err));
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h1>Item: {item.name}</h1>
      <Link to={`/items/${id}/edit`} className="btn">
        Edit
      </Link>
      <ItemPricesByItemBlock item_id={item.id} />


    </div>
  );
};

export default ItemDetailPage;
