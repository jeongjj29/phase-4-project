import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/pages/site/Home.js';
import About from './components/pages/site/About.js';
import ContactPage from './components/pages/site/ContactPage.js';
import Navigation from './components/navigation/Navigation';
import PageNotFound from './components/pages/site/PageNotFound.js';

import AllStoresPage from './components/pages/stores/AllStoresPage.js';
import CreateStorePage from './components/pages/stores/CreateStorePage.js';
import StoreDetailPage from './components/pages/stores/StoreDetailPage.js';

import AllItemsPage from './components/pages/items/AllItemsPage.js';
import CreateItemPage from './components/pages/items/CreateItemPage.js';
import ItemDetailPage from './components/pages/items/ItemDetailPage.js';

import CreateItemPricePage from './components/pages/itemPrices/CreateItemPricePage.js';
import AllPurchasesPage from './components/pages/itemPrices/AllPurchasesPage.js';
import PurchaseDetailPage from './components/pages/itemPrices/PurchaseDetailPage.js';

import OrderDetailsPage from './components/pages/orders/OrderDetailsPage.js';
import AllOrdersPage from './components/pages/orders/AllOrdersPage.js';

import AllListsPage from './components/pages/lists/AllListPages.js';
import ListDetailsPage from './components/pages/lists/ListDetailsPage.js';
import CreateOrderPage from './components/pages/orders/CreateOrderPage.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <div className="container-lg" style={{ maxWidth: '75%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            
            <Route path="/stores" element={<AllStoresPage />} />
            <Route path="/create-store" element={<CreateStorePage />} />
            <Route path="/stores/:id" element={<StoreDetailPage />} />

            <Route path="/items" element={<AllItemsPage />} />
            <Route path="/create-item" element={<CreateItemPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />

            <Route path="/create-order" element={<CreateOrderPage />} />
            <Route path="/orders" element={<AllOrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />

            <Route path="/purchases/:id" element={<PurchaseDetailPage />} />
            <Route path="/purchases" element={<AllPurchasesPage />} />
            
            <Route path="/create-item-price" element={<CreateItemPricePage />} />

            <Route path="/lists" element={<AllListsPage />} />
            <Route path="/lists/:id" element={<ListDetailsPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
