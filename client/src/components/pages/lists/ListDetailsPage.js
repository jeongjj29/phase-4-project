import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ListDetailsPage = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const response = await fetch(`/api/lists/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setList(data);
      } catch (err) {
        setError("Error fetching list details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>List: {list?.title || "List Details"}</h1>
      {list?.items?.length === 0 ? (
        <div>No items found in this list.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/items/${item.id}`}>{item.name}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListDetailsPage;
