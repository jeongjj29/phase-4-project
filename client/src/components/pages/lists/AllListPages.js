import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CSSTransition } from 'react-transition-group';
import './AllListStyle.css';

const AllListsPage = () => {
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState({}); // To store fetched items by ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState({});
  const [showAllItems, setShowAllItems] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
  const [itemSortConfig, setItemSortConfig] = useState({});

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/lists');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLists(data);
      } catch (err) {
        setError('Error fetching lists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/items');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const itemsMap = {};
        data.forEach(item => {
          itemsMap[item.id] = item;
        });
        setItems(itemsMap);
      } catch (err) {
        setError('Error fetching items');
        console.error(err);
      }
    };

    fetchItems();
  }, []);

  const toggleItemsVisibility = (listId) => {
    setVisibleItems((prevState) => ({
      ...prevState,
      [listId]: !prevState[listId],
    }));
  };

  const toggleAllItemsVisibility = () => {
    setShowAllItems((prevState) => !prevState);
    const updatedVisibility = {};
    lists.forEach((list) => {
      updatedVisibility[list.id] = !showAllItems;
    });
    setVisibleItems(updatedVisibility);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedLists = [...lists].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (direction === 'descending') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue < bValue ? -1 : 1;
    });

    setLists(sortedLists);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />;
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Lists</h1>
      <table>
        <thead>
          <tr>
            <th className='list_toggle_th'>
              <button onClick={toggleAllItemsVisibility}>
                {showAllItems ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
              </button>
            </th>
            <th className='list_title_th' onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
              Title {getSortIcon('title')}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => {
            const itemIds = list.items || [];
            const listKey = list.id;

            return (
              <React.Fragment key={listKey}>
                <tr>
                  <td>
                    <button onClick={() => toggleItemsVisibility(listKey)}>
                      {visibleItems[listKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </button>
                  </td>
                  <td className='list-title'>
                    <Link to={`/lists/${list.id}`}>{list.title}</Link>
                  </td>
                  <td className="view-list-btn">
                    <Link to={`/list/${list.id}`}>
                      View <KeyboardArrowRightIcon />
                    </Link>
                  </td>
                </tr>
                <CSSTransition
                  in={visibleItems[listKey]}
                  timeout={300}
                  classNames="list"
                  unmountOnExit
                >
                  <tr className='list_items'>
                    <td colSpan={3}>
                      <table className="list_items_table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemIds.map((itemId) => {
                            const item = items[itemId];
                            return item ? (
                              <tr key={item.id}>
                                <td>
                                  <Link to={`/items/${item.id}`}>{item.name}</Link>
                                </td>
                                <td>${item.price ? item.price.toFixed(2) : 'N/A'}</td>
                                </tr>
                            ) : (
                              <tr key={itemId}>
                                <td colSpan={2}>Item not found</td>
                              </tr>
                            );
                          })}
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

export default AllListsPage;
