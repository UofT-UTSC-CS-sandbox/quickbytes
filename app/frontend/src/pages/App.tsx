import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import DirectionsMap from '../components/DirectionsMap'


function App() {
  const [count, setCount] = useState(0)
  const [viewMap, setViewMap] = useState(false);
  /* To reads from DB, for debugging */
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/'); // Assuming your server is running on the same host
      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);
        alert(data.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{width: "100%"}}>
      <button onClick={() => setViewMap(!viewMap)}>toggle view</button>
    {viewMap ? 
      <div style={{width: "100%", height: "100vh"}}>
        <DirectionsMap />
      </div>
        : 
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => {
            setCount((count) => count + 1)
            handleClick();
          }}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </>
    }
  </div>
  );
}

export default App