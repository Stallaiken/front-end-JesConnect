import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Menu from "./Components/Menu.jsx";

import BarraAdmin from "./Components/BarraAdmin.jsx";
import Administrativo from "./Pages/Administrativo.jsx";
import Erro404 from "./Pages/Erro404.jsx";
import Visitante from "./Pages/Visitante.jsx";
import Horarios from "./Pages/Horarios.jsx";
import Historico from "./Pages/Historico.jsx";
import Ranking from "./Pages/Ranking.jsx";
import Times from "./Pages/Times.jsx";
import AdicionarJogo from "./Pages/AdicionarJogo.jsx";
import EditarTime from "./Pages/EditarTime.jsx";
import Finalizar from "./Pages/Finalizar.jsx";
import AdicionarTime from "./Pages/AdicionarTime.jsx";
import Chaveamento from "./Pages/Chavemanento.jsx";
function App() {

  return (
    <>
      <Menu/>


  
      <Routes>
        <Route path="/" element={<Visitante />} />
        <Route path="/Horarios" element={<Horarios />} />
        <Route path="/Historico" element={<Historico />} />
        <Route path="/Ranking" element={<Ranking />} />
        <Route path="/Times" element={<Times />} />
        <Route path="/Chaveamento" element={<Chaveamento />} />
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