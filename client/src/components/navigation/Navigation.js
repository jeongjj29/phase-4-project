import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav >
      <ul >
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/stores">Stores</Link></li>
        <li><Link to="/create-store">Create Store</Link></li>
        <li><Link to="/items">Items</Link></li>
        <li><Link to="/create-item">Create Item</Link></li>
        <li><Link to="/item-prices">Item Prices</Link></li>
        <li><Link to="/create-item-price">Create Item Price</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
