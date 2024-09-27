import axios from "axios";
import React, { useEffect, useState } from "react";

const ItemPricesByItem = ({ item_id }) => {
  const [itemPrices, setItemPrices] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/items/${item_id}/item_prices`)
      .then((res) => {
        setItemPrices(res.data);
      });
  });
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {itemPrices.map((itemPrice) => (
            <tr key={itemPrice.id}>
              <td>{itemPrice.store_name}</td>
              <td>${itemPrice.price}</td>
              <td>{itemPrice.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemPricesByItem;
