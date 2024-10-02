import axios from "axios";
import React, { useEffect, useState } from "react";

const TopItemsBlock = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("/api/items/top5")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
      });
  }, []);

  return (
    <div>
      <h2>Top 5 Items</h2>
      <ul>
        {items.map((store) => {
          return <li key={store.id}>{store.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default TopItemsBlock;
