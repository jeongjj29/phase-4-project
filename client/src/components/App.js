import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Outlet from "react-router-dom";

function App() {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <Outlet />
    </div>
  );
}

export default App;
