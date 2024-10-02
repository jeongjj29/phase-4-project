import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AllItemsPage = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [groupBy, setGroupBy] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });

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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedItems = [...items].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (direction === "descending") {
        return aValue < bValue ? 1 : -1;
      }
      return aValue < bValue ? -1 : 1;
    });

    setItems(sortedItems);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <KeyboardArrowUpIcon />
      ) : (
        <KeyboardArrowDownIcon />
      );
    }
    return null;
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

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%" }}>
        <h1>All Items</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>
                Add to Cart
              </th>
              <th>
                Image
              </th>
              <th onClick={() => handleSort("name")}>
                Item Name {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("category")}>
                Category {getSortIcon("category")}
              </th>
              <th onClick={() => handleSort("group")}>
                Group {getSortIcon("group")}
              </th>
              <th onClick={() => handleSort("form")}>
                Form {getSortIcon("form")}
              </th>
              <th onClick={() => handleSort("department")}>
                Department {getSortIcon("department")}
              </th>
              <th>Count</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td
                  style={{
                    
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
                <td>
                  <Link to={`/items/${item.id}`}>{item.name}</Link>
                </td>
                <td>
                  {item.category}
                </td>
                <td>
                  {item.group}
                </td>
                <td>
                  {item.form}
                </td>
                <td>
                  {item.department}
                </td>
                <td>
                  {item.count}
                </td>
                <td>
                  {item.size}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{ width: "30%", padding: "20px" }}
      >
        <h2>Shopping Cart</h2>

        <label htmlFor="groupBy">Group by:</label>
        <select
          id="groupBy"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          style={{ width: "100%",  marginBottom: "10px" }}
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
