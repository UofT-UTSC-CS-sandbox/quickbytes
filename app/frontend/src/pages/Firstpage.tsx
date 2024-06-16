// src/pages/App.tsx
import React from 'react';
import './App.css';
import NavBar2 from '../components/Navbar2';

const Firstpage: React.FC = () => {
  return (
    <>
      <NavBar2 /> {/* Add Navbar component */}
      <div id="main-content" style={{ paddingTop: '10vh', backgroundColor: 'white' }}>
            hello
        </div>
    </>
  );
};

export default Firstpage;
