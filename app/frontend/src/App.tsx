import { useState } from 'react'
import SetDirectionsMap from './components/SetDirectionsMap'
import './App.css'

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
    <div style={{ width: "100%" }}>
      {!viewMap && (
        <button onClick={() => setViewMap(true)}>Select Pickup Location</button>
      )}
      {viewMap && (
        <div style={{ width: "100%", height: "100vh" }}>
          <SetDirectionsMap />
        </div>
      )}
    </div>
  );
}

export default App
