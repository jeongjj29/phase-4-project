import axios from "axios";
import React, { useEffect, useState } from "react";

const PurchasesByStoreBlock = ({ id, name }) => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/stores/${id}/purchases`)
      .then((res) => {
        setPurchases(res.data);
      })
      .catch((err) => {
        console.error("Error fetching purchases:", err);
      });
  }, [id]);

  return (
    <div>
      <h2>Purchases at {name}:</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.item.name}</td>
              <td>{purchase.price}</td>
              <td>{purchase.created_at.split(" ")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasesByStoreBlock;
