import axios from "axios";
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
          return <li key={store.id}>{store.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default TopStoresBlock;
