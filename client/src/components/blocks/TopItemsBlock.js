import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const TopItemsBlock = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/items/top5")
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
        {items.map((item) => {
          return (
            <li key={item.id}>
              <Link to={`/items/${item.id}`}>{item.name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopItemsBlock;
