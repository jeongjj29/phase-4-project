import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CSSTransition } from 'react-transition-group';
import '../lists/AllListStyle.css';

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState({});
  const [showAllItems, setShowAllItems] = useState(false);
  const nodeRefs = useRef({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError('Error fetching orders');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleItemsVisibility = (orderId) => {
    setVisibleItems((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const toggleAllItemsVisibility = () => {
    setShowAllItems((prevState) => !prevState);
    const updatedVisibility = {};
    orders.forEach((order) => {
      updatedVisibility[order.id] = !showAllItems;
    });
    setVisibleItems(updatedVisibility);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>All Orders</h1>
      <table>
        <thead>
          <tr>
            <th>
              <button onClick={toggleAllItemsVisibility}>
                {showAllItems ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
              </button>
            </th>
            <th>Order ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const orderKey = order.id;

            if (!nodeRefs.current[orderKey]) {
              nodeRefs.current[orderKey] = React.createRef();
            }

            return (
              <React.Fragment key={orderKey}>
                <tr>
                  <td>
                    <button onClick={() => toggleItemsVisibility(orderKey)}>
                      {visibleItems[orderKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </button>
                  </td>
                  <td>
                    <Link to={`/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
                <CSSTransition
                  in={visibleItems[orderKey]}
                  timeout={300}
                  classNames="list"
                  unmountOnExit
                  nodeRef={nodeRefs.current[orderKey]}
                >
                  <tr ref={nodeRefs.current[orderKey]}>
                    <td colSpan={3}>
                      <table className="list_items_table">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Store</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.item_prices.map(itemPrice => (
                            <tr key={itemPrice.id}>
                              <td>
                                <Link to={`/items/${itemPrice.item_id}`}>
                                  {itemPrice.item_name}
                                </Link>
                              </td>
                              <td>${itemPrice.price}</td>
                              <td>
                                <Link to={`/stores/${itemPrice.store_id}`}>
                                  {itemPrice.store_name}
                                </Link>
                              </td>
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
