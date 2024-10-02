import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";

const AllItemsPage = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [groupBy, setGroupBy] = useState("");
  const [sortedField, setSortedField] = useState(null);
  const [isReversedSort, setIsReversedSort] = useState(false);

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }

    axios
      .get("/api/items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCheckboxChange = (item) => {
    if (cartItems.some((i) => i.id === item.id)) {
      setCartItems(cartItems.filter((i) => i.id !== item.id));
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const groupCartItems = (items, groupBy) => {
    if (!groupBy) return { "": items };

    return items.reduce((grouped, item) => {
      const key = item[groupBy.toLowerCase()];
      if (key) {
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
      }
      return grouped;
    }, {});
  };

  const groupedCartItems = groupCartItems(cartItems, groupBy);

  const handleSortClick = (field) => {
    if (sortedField === field) {
      setIsReversedSort(!isReversedSort);
    } else {
      setSortedField(field);
      setIsReversedSort(false);
    }
  };

  const sortedItems = [...items];
  if (sortedField !== null) {
    sortedItems.sort((a, b) => {
      if (a[sortedField] < b[sortedField]) {
        return -1;
      }
      if (a[sortedField] > b[sortedField]) {
        return 1;
      }
      return 0;
    });

    if (isReversedSort) {
      sortedItems.reverse();
    }
  }

  const sortButton = (field) => {
    return (
      <button onClick={() => handleSortClick(field)}>
        {sortedField === field && isReversedSort ? "▾" : "▴"}
      </button>
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%" }}>
        <h1>All Items</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Add to Cart
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Image
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Item Name {sortButton("name")}
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Category
                {sortButton("category")}
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Group
                {sortButton("group")}
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Form
                {sortButton("form")}
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Department
                {sortButton("department")}
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Count
              </th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                Size
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={item.id}>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={cartItems.some((i) => i.id === item.id)}
                    onChange={() => handleCheckboxChange(item)}
                  />
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {item.image_url && item.image_url.trim() !== "" ? (
                    <img
                      src={`/assets/item_images/${item.image_url}`}
                      alt={item.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  <Link to={`/items/${item.id}`}>{item.name}</Link>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {item.category}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {item.group}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {item.form}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {item.department}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {item.count}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                  {item.size}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{ width: "30%", padding: "20px", borderLeft: "1px solid #ccc" }}
      >
        <h2>Shopping Cart</h2>

        <label htmlFor="groupBy">Group by:</label>
        <select
          id="groupBy"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="">None</option>
          <option value="Category">Category</option>
          <option value="Group">Group</option>
          <option value="Form">Form</option>
          <option value="Department">Department</option>
        </select>

        {Object.keys(groupedCartItems).map((group) => (
          <div key={group}>
            {group && <h2>{group}</h2>}
            <ul>
              {groupedCartItems[group].map((item) => (
                <li key={item.id}>
                  {item.name}
                  <button onClick={() => handleRemoveFromCart(item.id)}>
                    <ClearIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllItemsPage;
