import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
const Navigation = () => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(null);

  const handleAddMenuClick = (event) => {
    setIsAddMenuOpen(event.currentTarget);
  };

  const handleMainMenuClick = (event) => {
    setIsMainMenuOpen(event.currentTarget);
  };

  const handleCloseAddMenu = () => {
    setIsAddMenuOpen(null);
  };

  const handleCloseMainMenu = () => {
    setIsMainMenuOpen(null);
  };

  return (
    <nav>
      <ul>
        <li>
          <Button onClick={handleMainMenuClick} variant="text">
            <MenuIcon />
          </Button>
          <Menu
            anchorEl={isMainMenuOpen}
            open={Boolean(isMainMenuOpen)}
            onClose={handleCloseMainMenu}
          >
            <MenuItem onClick={handleCloseMainMenu}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Home
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseMainMenu}>
              <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                About
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseMainMenu}>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                Contact
              </Link>
            </MenuItem>
          </Menu>
        </li>

        <li>
          <Link to="/stores">
            Stores
          </Link>
        </li>
        <li>
          <Link to="/items">
            Items
          </Link>
        </li>
        <li>
          <Link to="/purchases">
            Purchases
          </Link>
        </li>
        <li>
          <Link to="/orders">
            Orders
          </Link>
        </li>
        <li>
          <Button onClick={handleAddMenuClick} variant="text">
            <AddIcon /> Add
          </Button>
          <Menu
            anchorEl={isAddMenuOpen}
            open={Boolean(isAddMenuOpen)}
            onClose={handleCloseAddMenu}
          >
            <MenuItem onClick={handleCloseAddMenu}>
              <Link to="/create-store" style={{ textDecoration: 'none', color: 'inherit' }}>
                Store
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseAddMenu}>
              <Link to="/create-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                Item
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseAddMenu}>
              <Link to="/create-item-price" style={{ textDecoration: 'none', color: 'inherit' }}>
                Purchase
              </Link>
            </MenuItem>
          </Menu>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
