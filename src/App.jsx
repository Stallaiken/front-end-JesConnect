import { useState, useEffect } from 'react'; 
import { Routes, Route, useLocation } from 'react-router-dom'; 
import Menu from './Components/Menu.jsx';
import Home from './Pages/Home.jsx';
import Administrativo from './Pages/Administrativo.jsx';
import Erro404 from './Pages/Erro404.jsx';
import Visitante from './Pages/Visitante.jsx';
import MenuFilho from './Components/MenuFilho.jsx';
function App() {
 const [MenuAberto,setMenuAberto] = useState(false)

  return (
    <>
    <Menu aoAbrir={setMenuAberto}></Menu>
    {MenuAberto && <MenuFilho></MenuFilho>}
      <Routes>
        <Route path="/" element={<Visitante />} />
        <Route path="/Administrativo" element={<Administrativo />} />
        <Route path="*" element={<Erro404 />} />
      </Routes>
    </>
  );
}

export default App;
