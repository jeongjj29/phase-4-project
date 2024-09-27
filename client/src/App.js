import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/pages/site/Home.js';
import About from './components/pages/site/About.js';
import ContactPage from './components/pages/site/ContactPage.js';
import Navigation from './components/navigation/Navigation';
import PageNotFound from './components/pages/site/PageNotFound.js';

// Store and Item components
import AllStoresPage from './components/pages/stores/AllStoresPage.js';
import CreateStorePage from './components/pages/stores/CreateStorePage.js';
import AllItemsPage from './components/pages/items/AllItemsPage';
import CreateItemPage from './components/pages/items/CreateItemPage.js';
import AllItemPricesPage from './components/pages/itemPrices/AllItemPricesPage.js';
import CreateItemPricePage from './components/pages/itemPrices/CreateItemPricePage.js';

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
            
            {/* Store routes */}
            <Route path="/stores" element={<AllStoresPage />} />
            <Route path="/create-store" element={<CreateStorePage />} />

            {/* Item routes */}
            <Route path="/items" element={<AllItemsPage />} />
            <Route path="/create-item" element={<CreateItemPage />} />

            {/* Item Price routes */}
            <Route path="/item-prices" element={<AllItemPricesPage />} />
            <Route path="/create-item-price" element={<CreateItemPricePage />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
