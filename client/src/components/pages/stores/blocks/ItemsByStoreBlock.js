import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ItemsByStoreBlock = ({ id, name }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/stores/${id}/items`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
      });
  }, [id]);

  return (
    <div>
      <h2>Items sold in {name}:</h2>
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

export default ItemsByStoreBlock;
