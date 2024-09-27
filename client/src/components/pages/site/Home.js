import React from 'react';
import TopStoresBlock from '../../blocks/TopStoresBlock.js'
import TopItemsBlock from '../../blocks/TopItemsBlock.js'
import PurchaseHistory from '../../blocks/PurchaseHistoryBlock.js'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Grocery App!</p>
      <TopStoresBlock />
      <TopItemsBlock />
      <PurchaseHistory />
    </div>
  );
};

export default Home;
