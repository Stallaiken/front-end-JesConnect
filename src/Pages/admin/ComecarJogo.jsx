import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../css/admin/ComecarJogo.css";

function ComecarJogo() {
  const location = useLocation();
  const navigate = useNavigate();
  const jogo = location.state?.jogo || null;
  const jogoId = location.state?.jogoId || location.state?.id || jogo?.id;
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleComecar = async () => {
    if (!jogoId) {
      setErro("Nenhuma partida foi selecionada.");
      return;
    }

    setLoading(true);
    setErro("");

    const { error } = await supabase
      .from("confronto")
      .update({ ao_vivo: true, finalizado: false })
      .eq("id", jogoId);

    setLoading(false);

    if (error) {
      setErro(`Não foi possível começar a partida: ${error.message}`);
      return;
    }

    alert("Partida iniciada. O confronto agora está ao vivo.");
    navigate("/horarios", { replace: true });
  };

  if (!jogoId) {
    return (
      <main className="comecar-jogo-page">
        <section className="comecar-jogo-card">
          <h1>COMEÇAR PARTIDA</h1>
          <p>Nenhuma partida selecionada.</p>
          <button type="button" onClick={() => navigate("/horarios")}>
            SELECIONAR PARTIDA
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="comecar-jogo-page">
      <section className="comecar-jogo-card">
        <h1>COMEÇAR PARTIDA</h1>
        <p>Confirme o início deste confronto:</p>
        <div className="comecar-jogo-confronto">
          <span>{jogo?.time1?.Nome || "Time 1"}</span>
          <strong>VS</strong>
          <span>{jogo?.time2?.Nome || "Time 2"}</span>
        </div>

        {erro && <p className="comecar-jogo-erro">{erro}</p>}

        <div className="comecar-jogo-acoes">
          <button type="button" className="secundario" onClick={() => navigate("/horarios")}>
            CANCELAR
          </button>
          <button type="button" onClick={handleComecar} disabled={loading}>
            {loading ? "INICIANDO..." : "COMEÇAR AGORA"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default ComecarJogo;
