
import './App.css';
import Navbar from './components/Navbar'; // Import your new component
import Game from './components/Game'; // Import your new component
import React, { useState } from "react";

function App() {

  return (

    <div className="bg-light min-vh-100">
      <Navbar /> 

      <Game/>
      

      
      
      
    </div>
  );
}

export default App;
