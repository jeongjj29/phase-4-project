import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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
                <HomeIcon /> Home
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseMainMenu}>
              <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
                About
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseMainMenu}>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                <InfoIcon /> Contact
              </Link>
            </MenuItem>
          </Menu>
        </li>

        <li>
          <Link to="/stores">
            <StorefrontIcon /> Stores
          </Link>
        </li>
        <li>
          <Link to="/items">
            <ViewModuleIcon /> Items
          </Link>
        </li>
        <li>
          <Link to="/item-prices">
            <ReceiptLongIcon /> Purchases
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
                Create Store
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseAddMenu}>
              <Link to="/create-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                Create Item
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseAddMenu}>
              <Link to="/create-item-price" style={{ textDecoration: 'none', color: 'inherit' }}>
                Create Item Price
              </Link>
            </MenuItem>
          </Menu>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
