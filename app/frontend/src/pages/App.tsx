// src/pages/App.tsx
import React from 'react';
import './App.css';
import NavBar from '../components/Navbar';

const App: React.FC = () => {
  return (
    <>
      <NavBar /> {/* Add Navbar component */}
      <div id="main-content" style={{ paddingTop: '10vh', backgroundColor: 'white' }}>
            hello
        </div>
    </>
  );
};

export default App;
