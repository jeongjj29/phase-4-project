import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const TopStoresBlock = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/stores/top5")
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.error("Error fetching stores:", err);
      });
  }, []);

  return (
    <div>
      <h2>Top 5 Stores</h2>
      <ul>
        {stores.map((store) => {
          return (
            <li key={store.id}>
              <Link to={`/stores/${store.id}`}>{store.name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopStoresBlock;
