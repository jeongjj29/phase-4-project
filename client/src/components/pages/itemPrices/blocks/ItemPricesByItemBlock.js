import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link

const ItemPricesByItemBlock = ({ item_id }) => {
  const [itemPrices, setItemPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemPrices = async () => {
      try {
        const response = await axios.get(`/api/item_prices/item/${item_id}`);
        setItemPrices(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemPrices();
  }, [item_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Purchases</h3>
      <table>
        <thead>
          <tr>
            <th>Price</th>
            <th>Store</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {itemPrices.map((price) => (
            <tr key={price.id}>
              <td>${price.price}</td>
              <td>
                <Link to={`/stores/${price.store.id}`}>{price.store.name}</Link>
              </td>
              <td>{price.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemPricesByItemBlock;
