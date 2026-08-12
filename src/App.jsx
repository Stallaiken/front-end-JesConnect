import { useState, useEffect } from 'react'; 
import { Routes, Route, useLocation } from 'react-router-dom'; 
import Menu from './Components/Menu.jsx';
import './App.css';
import Home from './Pages/Home.jsx';
import Administrativo from './Pages/Administrativo.jsx';
import Erro404 from './Pages/Erro404.jsx';
import Visitante from './Pages/Visitante.jsx';

function App() {
  const [mostrarMenu, setMostrarMenu] = useState(true);
  const location = useLocation(); 

  
  useEffect(() => {
    const rotasSemMenu = ['/administrativo', '/visitante'];
    

    if (rotasSemMenu.includes(location.pathname.toLowerCase())) {
      setMostrarMenu(false);
    } else {
      setMostrarMenu(true); 
    }
  }, [location]); 

  return (
    <>
      
      {mostrarMenu && <Menu />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Visitante" element={<Visitante />} />
        <Route path="/Administrativo" element={<Administrativo />} />
        <Route path="*" element={<Erro404 />} />
      </Routes>
    </>
  );
}

export default App;
