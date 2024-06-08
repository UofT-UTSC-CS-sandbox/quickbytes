import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './pages/App.tsx'
import OrderTracking from './pages/OrderTracking.tsx';
import Settings from './pages/Settings.tsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tracking" element={<OrderTracking />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
