import axios from "axios";
import React, { useEffect, useState } from "react";

const PurchaseHistoryBlock = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/item_prices/most_recent5")
      .then((res) => {
        setPurchases(res.data);
      })
      .catch((err) => {
        console.error("Error fetching purchases:", err);
      });
  }, []);

  return (
    <div>
      <h2>Most Recent Purchases</h2>
      <table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Item</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.store_name}</td>
              <td>{purchase.item_name}</td>
              <td>${purchase.price}</td>
              <td>{purchase.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistoryBlock;
