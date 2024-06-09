import { Route, Routes } from 'react-router-dom';
import './App.css'
import Menu from './pages/Menu';

function App() {
  return (
    <Routes>
      <Route path='/restaurant/:id' element={<Menu />}/>
    </Routes>
  )
}

export default App
