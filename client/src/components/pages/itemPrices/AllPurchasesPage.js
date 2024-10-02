import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CSSTransition } from 'react-transition-group';
import '../lists/AllListStyle.css';

const AllItemPricesPage = () => {
  const [itemPrices, setItemPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState({});
  const [showAllItems, setShowAllItems] = useState(false);
  const nodeRefs = useRef({});

  useEffect(() => {
    const fetchItemPrices = async () => {
      try {
        const response = await fetch('/api/purchases'); 
        const data = await response.json();
        setItemPrices(data);
      } catch (err) {
        setError("Error fetching item prices");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemPrices();
  }, []);

  const toggleItemsVisibility = (itemPriceId) => {
    setVisibleItems((prevState) => ({
      ...prevState,
      [itemPriceId]: !prevState[itemPriceId],
    }));
  };

  const toggleAllItemsVisibility = () => {
    setShowAllItems((prevState) => !prevState);
    const updatedVisibility = {};
    itemPrices.forEach((itemPrice) => {
      updatedVisibility[itemPrice.id] = !showAllItems;
    });
    setVisibleItems(updatedVisibility);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Purchases</h1>
      <table>
        <thead>
          <tr>
            <th>
              <button onClick={toggleAllItemsVisibility}>
                {showAllItems ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
              </button>
            </th>
            <th>Store</th>
            <th>Item</th>
            <th>Price</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {itemPrices.map((itemPrice) => {
            const itemPriceKey = itemPrice.id;

            if (!nodeRefs.current[itemPriceKey]) {
              nodeRefs.current[itemPriceKey] = React.createRef();
            }

            return (
              <React.Fragment key={itemPriceKey}>
                <tr>
                  <td>
                    <button onClick={() => toggleItemsVisibility(itemPriceKey)}>
                      {visibleItems[itemPriceKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </button>
                  </td>
                  <td>
                    <Link to={`/stores/${itemPrice.store.id}`}>
                      {itemPrice.store.name}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/items/${itemPrice.item.id}`}>
                      {itemPrice.item.name}
                    </Link>
                  </td>
                  <td>${itemPrice.price.toFixed(2)}</td>
                  <td>{new Date(itemPrice.created_at).toLocaleDateString()}</td>
                </tr>
                <CSSTransition
                  in={visibleItems[itemPriceKey]}
                  timeout={300}
                  classNames="list"
                  unmountOnExit
                  nodeRef={nodeRefs.current[itemPriceKey]}
                >
                  <tr ref={nodeRefs.current[itemPriceKey]}>
                    <td colSpan={5}>Additional details can go here.</td>
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

export default AllItemPricesPage;
