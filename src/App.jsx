import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Menu from "./Components/Menu.jsx";
import MenuFilho from "./Components/MenuFilho.jsx";

import Administrativo from "./Pages/Administrativo.jsx";
import Erro404 from "./Pages/Erro404.jsx";
import Visitante from "./Pages/Visitante.jsx";
import Horarios from "./Pages/Horarios.jsx";
import Historico from "./Pages/Historico.jsx";
import Ranking from "./Pages/Ranking.jsx";
import AdminButton from "./Components/adminButton.jsx"; // Renomeado para PascalCase
import AdicionarJogo from "./Pages/AdicionarJogo.jsx";
import EditarTime from "./Pages/EditarTime.jsx";
import Finalizar from "./Pages/Finalizar.jsx";
import ModalidadeFiltro from "./Pages/modalidadeFiltros.jsx";
import AdicionarTime from "./Pages/AdicionarTime.jsx";
function App() {
  const [MenuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <Menu aoAbrir={setMenuAberto} />

      {MenuAberto && <MenuFilho aoAbrir={setMenuAberto} />}
      
      {/* Componente em PascalCase */}
      <AdminButton />

      <Routes>
        <Route path="/" element={<Visitante />} />
        <Route path="/Horarios" element={<Horarios />} />
        <Route path="/modalidade/:nomeModalidade" element={<ModalidadeFiltro />} />
        <Route path="/Historico" element={<Historico />} />
        <Route path="/Ranking" element={<Ranking />} />

        {/* Área administrativa */}
        <Route path="/adicionar-jogo" element={<AdicionarJogo />} />
        <Route path="/editar-time" element={<EditarTime />} />
        <Route path="/Finalizar" element={<Finalizar />} />
        <Route path="/Administrativo" element={<Administrativo />} />
        <Route path="*" element={<Erro404 />} />
        <Route path="/adicionar-time" element={<AdicionarTime />} />
      </Routes>
    </>
  );
}

export default App;