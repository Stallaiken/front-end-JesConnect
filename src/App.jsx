import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Menu from "./Components/Menu.jsx";


import Administrativo from "./Pages/Administrativo.jsx";
import Erro404 from "./Pages/Erro404.jsx";
import Visitante from "./Pages/Visitante.jsx";
import Horarios from "./Pages/Horarios.jsx";
import Historico from "./Pages/Historico.jsx";
import Ranking from "./Pages/Ranking.jsx";

import AdicionarJogo from "./Pages/AdicionarJogo.jsx";
import EditarTime from "./Pages/EditarTime.jsx";
import Finalizar from "./Pages/Finalizar.jsx";
import ModalidadeFiltro from "./Pages/modalidadeFiltros.jsx";
import AdicionarTime from "./Pages/AdicionarTime.jsx";
function App() {

  return (
    <>
      <Menu/>

<<<<<<< HEAD
=======
      
      {/* Componente em PascalCase */}
   
>>>>>>> 12e0e74f237dfc52b76e41a7319f5c648fba3f6e

  
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