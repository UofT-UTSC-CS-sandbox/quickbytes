// src/pages/App.tsx
import React from 'react';
import { useState } from 'react'
import './App.css';
import NavBar2 from '../components/Navbar2';
import DirectionsMap from '../components/DirectionsMap'

const App: React.FC = () => {
  const [count, setCount] = useState(0)
  const [viewMap, setViewMap] = useState(false);
  /* To reads from DB, for debugging */
  return (

    <div style={{width: "100%"}}>
      <button onClick={() => setViewMap(!viewMap)}>toggle view</button>
    {viewMap ? 
      <div style={{width: "100%", height: "100vh"}}>
        <DirectionsMap />
      </div>
        : 
      <>
      <NavBar2 />
      <div id="main-content" style={{ paddingTop: '10vh', backgroundColor: 'white' }}>
        </div>
      </>
    }
  </div>
  );
};

export default App;
