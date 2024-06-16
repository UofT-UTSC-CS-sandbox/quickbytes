// src/pages/App.tsx
import React from 'react';
import './App.css';
import Navout from '../components/Navout';

const Firstpage: React.FC = () => {
  return (
    <>
      <Navout /> {/* Add Navbar component */}
      <div id="main-content" style={{ paddingTop: '10vh', backgroundColor: 'white' }}>
            hello
        </div>
    </>
  );
};

export default Firstpage;
