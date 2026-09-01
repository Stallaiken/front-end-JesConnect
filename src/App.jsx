import { useState } from 'react';
import { Routes, Route} from 'react-router-dom'; 
import Menu from './Components/Menu.jsx';
import Administrativo from './Pages/Administrativo.jsx';
import Erro404 from './Pages/Erro404.jsx';
import Visitante from './Pages/Visitante.jsx';
import MenuFilho from './Components/MenuFilho.jsx';
import Horarios from './Pages/Horarios.jsx';
import Futsete from './Pages/jogos/Futsete.jsx';
import Queimado from './Pages/jogos/Queimado.jsx';
import Futsal from './Pages/jogos/Futsal.jsx';
import Vollei from './Pages/jogos/Vollei.jsx';
import Historico from './Pages/Historico.jsx';
import Ranking from './Pages/Ranking.jsx';
import AdicionarJogo from './Pages/AdicionarJogo.jsx';
import SalvarJogo from './Pages/SalvarJogo.jsx';
import Finalizar from './Pages/Finalizar.jsx';
function App() {
 const [MenuAberto,setMenuAberto] = useState(false)

  return (
    <>
    <Menu aoAbrir={setMenuAberto}></Menu>
    {MenuAberto && <MenuFilho aoAbrir={setMenuAberto}></MenuFilho>}
      <Routes>
        <Route path="/" element={<Visitante />} />
        <Route path="/Administrativo" element={<Administrativo />} />
        <Route path="*" element={<Erro404 />} />
        <Route path='/Horarios' element={<Horarios/>}/>
        <Route path='/Futsete' element={<Futsete/>}/>
        <Route path='/Queimado' element={<Queimado/>}/>
        <Route path='/Futsal' element={<Futsal/>}/>
        <Route path='/Vollei' element={<Vollei/>}/>
        <Route path='/Historico' element={<Historico/>}/>
        <Route path='/Ranking' element={<Ranking/>}/>
        <Route path='/adicionar-jogo' element={<AdicionarJogo/>}/>
        <Route path='/salvar-jogo' element={<SalvarJogo/>}/>
        <Route path='/Finalizar' element={<Finalizar/>}/>
      </Routes>
    </>
  );
}

export default App;
