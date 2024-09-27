import React, { useState, useEffect } from 'react';

const AllStoresPage = () => {

  const [stores, setStores] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:3001/api/stores') 
      .then(response => response.json())      
      .then(data => setStores(data))          
      .catch(error => console.error('Error fetching stores:', error));
  }, []); 

  return (
    <div>
      <h1>All Stores</h1>
      <p>Here you can find a list of all available stores.</p>

      <ul>
        {stores.length > 0 ? (
          stores.map(store => (
            <li key={store.id}>
              {store.name}
            </li>
          ))
        ) : (
          <li>No stores available</li>
        )}
      </ul>
    </div>
  );
};

export default AllStoresPage;
