// App.tsx
//import React from 'react';
import { BrowserRouter as Router, Routes , Route} from 'react-router-dom';
import './App.css';
import SignUp from './SignUp';
import Login from './Login';
import UserPage from './UserPage';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './privateRoute';
import VerificationInstructions from './verificationInstructions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <div>
                <a href="https://vitejs.dev" target="_blank">
                  <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src="/react.svg" className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Vite + React</h1>
              <div className="card">
                <button onClick={() => console.log('Count clicked')}>
                  count is 0
                </button>
                <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
                </p>
              </div>
              <p className="read-the-docs">
                Click on the Vite and React logos to learn more
              </p>
            </>
          } />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-page" element={<PrivateRoute><UserPage /></PrivateRoute>} />
          <Route path="/verification-instructions" element={<VerificationInstructions />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
