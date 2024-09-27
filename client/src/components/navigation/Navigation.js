import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav style={{ padding: '1rem', background: '#f8f8f8', borderBottom: '1px solid #ddd' }}>
      <h1 style={{ display: 'inline', marginRight: '2rem' }}>Grocery App</h1>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex' }}>
        <li style={{ margin: '0 1rem' }}><Link to="/">Home</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/about">About</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/contact">Contact</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/stores">All Stores</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/create-store">Create Store</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/items">All Items</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/create-item">Create Item</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/item-prices">All Item Prices</Link></li>
        <li style={{ margin: '0 1rem' }}><Link to="/create-item-price">Create Item Price</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
