import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { CSSTransition } from "react-transition-group";
import "./AllOrdersPage.css";

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState({});
  const [showAllItems, setShowAllItems] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [itemSortConfig, setItemSortConfig] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const groupedOrders = groupOrdersByStoreAndDate(data);
        setOrders(groupedOrders);
      } catch (err) {
        setError("Error fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const groupOrdersByStoreAndDate = (data) => {
    const ordersMap = {};

    data.forEach((price) => {
      const date = new Date(price.created_at);
      const formattedDate = `${
        date.getMonth() + 1
      }-${date.getDate()}-${date.getFullYear()}`;
      const storeId = price.store.id;

      const orderKey = `${storeId}_${formattedDate}`;

      if (!ordersMap[orderKey]) {
        ordersMap[orderKey] = {
          store: price.store,
          created_at: formattedDate,
          items: [],
        };
      }

      ordersMap[orderKey].items.push({
        id: price.item.id,
        name: price.item.name,
        price: price.price,
      });
    });

    return Object.values(ordersMap);
  };

  const toggleItemsVisibility = (orderKey) => {
    setVisibleItems((prevState) => ({
      ...prevState,
      [orderKey]: !prevState[orderKey],
    }));
  };

  const toggleAllItemsVisibility = () => {
    setShowAllItems((prevState) => !prevState);
    const updatedVisibility = {};
    orders.forEach((order) => {
      const orderKey = `${order.store.id}_${order.created_at}`;
      updatedVisibility[orderKey] = !showAllItems;
    });
    setVisibleItems(updatedVisibility);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedOrders = [...orders].sort((a, b) => {
      let aValue, bValue;

      if (key === "created_at") {
        const aDateParts = a[key].split("-").map(Number);
        const bDateParts = b[key].split("-").map(Number);
        aValue = new Date(aDateParts[2], aDateParts[0] - 1, aDateParts[1]);
        bValue = new Date(bDateParts[2], bDateParts[0] - 1, bDateParts[1]);
      } else {
        aValue = key === "store.name" ? a.store.name : a[key];
        bValue = key === "store.name" ? b.store.name : b[key];
      }

      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setOrders(sortedOrders);
  };

  const handleItemSort = (orderKey, key) => {
    const currentItemSort = itemSortConfig[orderKey] || {
      key: "",
      direction: "ascending",
    };
    let direction = "ascending";
    if (
      currentItemSort.key === key &&
      currentItemSort.direction === "ascending"
    ) {
      direction = "descending";
    }

    setItemSortConfig((prevState) => ({
      ...prevState,
      [orderKey]: { key, direction },
    }));

    const sortedOrders = [...orders].map((order) => {
      if (`${order.store.id}_${order.created_at}` === orderKey) {
        const sortedItems = [...order.items].sort((a, b) => {
          if (a[key] < b[key]) {
            return direction === "ascending" ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
        return { ...order, items: sortedItems };
      }
      return order;
    });

    setOrders(sortedOrders);
  };

  const getSortIcon = (key, config) => {
    if (config?.key === key) {
      return config.direction === "ascending" ? (
        <KeyboardArrowUpIcon />
      ) : (
        <KeyboardArrowDownIcon />
      );
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th className="order_toggle_th">
              <button onClick={toggleAllItemsVisibility}>
                {showAllItems ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
              </button>
            </th>
            <th
              className="order_store_th"
              onClick={() => handleSort("store.name")}
              style={{ cursor: "pointer" }}
            >
              Store {getSortIcon("store.name", sortConfig)}
            </th>
            <th
              className="order_date_th"
              onClick={() => handleSort("created_at")}
              style={{ cursor: "pointer" }}
            >
              Date {getSortIcon("created_at", sortConfig)}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            const orderKey = `${order.store.id}_${order.created_at}`;
            const itemSort = itemSortConfig[orderKey] || {
              key: "",
              direction: "ascending",
            };

            return (
              <React.Fragment key={index}>
                <tr>
                  <td>
                    <button onClick={() => toggleItemsVisibility(orderKey)}>
                      {visibleItems[orderKey] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </button>
                  </td>
                  <td className="store">
                    <Link to={`/stores/${order.store.id}`}>
                      {order.store.name}
                    </Link>
                  </td>
                  <td>{order.created_at}</td>
                  <td className="visit_order_btn">
                    <Link
                      to={`/order?store=${order.store.name}&date=${order.created_at}`}
                    >
                      View <KeyboardArrowRightIcon />
                    </Link>
                  </td>
                </tr>
                <CSSTransition
                  in={visibleItems[orderKey]}
                  timeout={300}
                  classNames="order"
                  unmountOnExit
                >
                  <tr className="order_purchases_lst">
                    <td colSpan={4}>
                      <table className="order_purchases_lst">
                        <thead>
                          <tr>
                            <th
                              onClick={() => handleItemSort(orderKey, "name")}
                              style={{ cursor: "pointer" }}
                            >
                              Item {getSortIcon("name", itemSort)}
                            </th>
                            <th
                              onClick={() => handleItemSort(orderKey, "price")}
                              style={{ cursor: "pointer" }}
                            >
                              Price {getSortIcon("price", itemSort)}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <Link to={`/items/${item.id}`}>
                                  {item.name}
                                </Link>
                              </td>
                              <td>${item.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </CSSTransition>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrdersPage;
