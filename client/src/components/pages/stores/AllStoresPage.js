import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AllStoresStyle.css"; // Assuming you have a CSS file for table styles

const AllStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/stores")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setStores(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching stores");
        console.error("Error fetching stores:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>All Stores</h1>
      <p>Here you can find a list of all available stores.</p>

      <table className="all_stores_table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>View Store</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <tr key={store.id}>
                <td>
                  <Link to={`/stores/${store.id}`}>{store.name}</Link>
                </td>
                <td>
                  <Link to={`/stores/${store.id}`}>View Details</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No stores available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllStoresPage;
