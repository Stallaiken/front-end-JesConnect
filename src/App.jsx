import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Menu from "./Components/Menu.jsx";

// Páginas Públicas
import Visitante from "./Pages/Visitante.jsx";
import Horarios from "./Pages/Horarios.jsx";
import Historico from "./Pages/Historico.jsx";
import Ranking from "./Pages/Ranking.jsx";
import Times from "./Pages/Times.jsx";
import Chaveamento from "./Pages/Chaveamento.jsx";
import Erro404 from "./Pages/Erro404.jsx";

// Páginas Administrativas
import Administrativo from "./Pages/Administrativo.jsx";
import AdicionarJogo from "./Pages/admin/AdicionarJogo.jsx";
import EditarTime from "./Pages/admin/EditarTime.jsx";
import Finalizar from "./Pages/admin/Finalizar.jsx";
import CriarTime from "./Pages/admin/AdicionarTime.jsx";
import CriarModalidade from "./Pages/admin/CriarModalidade.jsx";
import DeletarTime from "./Pages/admin/DeletarTimeJEs.jsx";
import EditarJogo from "./Pages/admin/EditarJogo.jsx";
import ComecarJogo from "./Pages/admin/ComecarJogo.jsx";
import { supabase } from "./utils/supabaseClient.js";

function AppContent() {
  const [acaoSelecao, setAcaoSelecao] = useState(null);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const navigate = useNavigate();

  const iniciarSelecao = (acao) => {
    setJogoSelecionado(null);
    setAcaoSelecao((atual) => (atual === acao ? null : acao));
    navigate("/horarios");
  };

  const handleSelecionarJogo = async (jogo) => {
    setJogoSelecionado(jogo);

    const state = { jogo, id: jogo?.id, jogoId: jogo?.id };

    if (acaoSelecao === "editar") {
      setAcaoSelecao(null);
      navigate("/editar-jogo", { state });
      return;
    }

    if (acaoSelecao === "finalizar") {
      setAcaoSelecao(null);
      navigate("/finalizar", { state });
      return;
    }

    if (acaoSelecao === "comecar") {
      setAcaoSelecao(null);
      navigate("/comecar-jogo", { state });
      return;
    }

    if (acaoSelecao === "deletar") {
      const nome1 = jogo.time1?.Nome || "Time 1";
      const nome2 = jogo.time2?.Nome || "Time 2";
      if (!window.confirm(`Deseja realmente excluir ${nome1} x ${nome2}?`)) {
        setJogoSelecionado(null);
        return;
      }

      const { error: erroDetalhes } = await supabase
        .from("detalhes")
        .delete()
        .eq("confronto_id", jogo.id);

      if (erroDetalhes) {
        alert(`Não foi possível excluir os detalhes: ${erroDetalhes.message}`);
        return;
      }

      const { error } = await supabase
        .from("confronto")
        .delete()
        .eq("id", jogo.id);
      if (error) {
        alert(`Não foi possível excluir a partida: ${error.message}`);
        return;
      }

      alert("Partida excluída com sucesso.");
      setAcaoSelecao(null);
      setJogoSelecionado(null);
      navigate("/horarios", { replace: true });
      window.location.reload();
    }
  };

  return (
    <>
      <Menu acaoSelecao={acaoSelecao} onIniciarSelecao={iniciarSelecao} />

      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Visitante />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/times" element={<Times />} />
        <Route path="/chaveamento" element={<Chaveamento />} />

        {/* Rota Horários */}
        <Route
          path="/horarios"
          element={
            <Horarios
              acaoSelecao={acaoSelecao}
              jogoSelecionado={jogoSelecionado}
              onSelecionarJogo={handleSelecionarJogo}
            />
          }
        />

        {/* Rotas Administrativas */}
        <Route path="/administrativo" element={<Administrativo />} />
        <Route path="/adicionar-jogo" element={<AdicionarJogo />} />
        <Route path="/editar-jogo" element={<EditarJogo />} />
        <Route path="/editar-time" element={<EditarTime />} />
        <Route path="/finalizar" element={<Finalizar />} />
        <Route path="/comecar-jogo" element={<ComecarJogo />} />
        <Route path="/adicionar-time" element={<CriarTime />} />
        <Route path="/criar-modalidade" element={<CriarModalidade />} />
        <Route path="/deletar-time" element={<DeletarTime />} />

          {/*Outras rotas */}
        <Route path="/Horarios" element={<Navigate to="/horarios" replace />} />
        <Route
          path="/Historico"
          element={<Navigate to="/historico" replace />}
        />
        <Route path="/Ranking" element={<Navigate to="/ranking" replace />} />
        <Route path="/Times" element={<Navigate to="/times" replace />} />
        <Route
          path="/Chaveamento"
          element={<Navigate to="/chaveamento" replace />}
        />
        <Route
          path="/Administrativo"
          element={<Navigate to="/administrativo" replace />}
        />
        <Route
          path="/Finalizar"
          element={<Navigate to="/finalizar" replace />}
        />
        <Route
          path="/adicionarTime"
          element={<Navigate to="/adicionar-time" replace />}
        />
        <Route
          path="/criarModalidade"
          element={<Navigate to="/criar-modalidade" replace />}
        />

        {/* Rota 404 */}
        <Route path="*" element={<Erro404 />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
