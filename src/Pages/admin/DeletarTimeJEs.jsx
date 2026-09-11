import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import "../../css/admin/DeletarTime.css";

function DeletarTime() {
  const navigate = useNavigate();
  const [times, setTimes] = useState([]);
  const [busca, setBusca] = useState("");
  const [timeParaDeletar, setTimeParaDeletar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const carregarTimes = async () => {
    setCarregandoLista(true);
    const { data, error } = await supabase
      .from("time")
      .select("*, modalidade(nome, genero)")
      .order("Nome");

    if (error) {
      console.error("Erro ao carregar times:", error);
      setMensagem({
        tipo: "erro",
        texto: "Erro ao carregar a lista de times.",
      });
    } else {
      setTimes(data || []);
    }
    setCarregandoLista(false);
  };

  useEffect(() => {
    carregarTimes();
  }, []);

  const handleConfirmarDeletar = async () => {
    if (!timeParaDeletar) return;

    setLoading(true);
    setMensagem({ tipo: "", texto: "" });

    try {
      const { error } = await supabase
        .from("time")
        .delete()
        .eq("id", timeParaDeletar.id);

      if (error) throw error;

      setMensagem({
        tipo: "sucesso",
        texto: `Time "${timeParaDeletar.Nome}" removido com sucesso!`,
      });
      setTimes(times.filter((t) => t.id !== timeParaDeletar.id));
      setTimeParaDeletar(null);
    } catch (err) {
      console.error("Erro ao deletar time:", err);
      setMensagem({
        tipo: "erro",
        texto:
          "Não foi possível deletar o time. Verifique se ele possui jogos vinculados.",
      });
    } finally {
      setLoading(false);
    }
  };

  const timesFiltrados = times.filter((t) =>
    t.Nome?.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="add-time-screen">
      <header className="sesi-app-header">
        <button type="button" className="menu-btn" onClick={() => navigate(-1)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="sesi-brand-badge">
          <span className="sesi-title">SESI</span>
          <span className="sesi-sub">DELETAR TIME</span>
        </div>
      </header>

      <main className="add-time-container">
        <div className="add-time-form">
          {mensagem.texto && (
            <p
              className={
                mensagem.tipo === "erro" ? "error-text-msg" : "success-text-msg"
              }
            >
              {mensagem.texto}
            </p>
          )}

          <div className="black-card-input">
            <span className="field-caption">BUSCAR TIME PARA REMOVER</span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite o nome do time..."
            />
          </div>

          <div className="black-card-input multi-card">
            <span className="field-caption">
              TIMES CADASTRADOS ({timesFiltrados.length})
            </span>

            {carregandoLista ? (
              <p className="texto-informativo">Carregando times...</p>
            ) : timesFiltrados.length === 0 ? (
              <p className="texto-informativo">Nenhum time encontrado.</p>
            ) : (
              <div className="deletar-times-lista">
                {timesFiltrados.map((t) => (
                  <div key={t.id} className="deletar-time-card">
                    <div className="deletar-time-info">
                      <strong className="deletar-time-nome">{t.Nome}</strong>
                      {t.modalidade && (
                        <small className="deletar-time-modalidade">
                          Modalidade: {t.modalidade.nome}{" "}
                          {t.modalidade.genero
                            ? `(${t.modalidade.genero})`
                            : ""}
                        </small>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-deletar-card"
                      onClick={() => setTimeParaDeletar(t)}
                    >
                      Deletar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {timeParaDeletar && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-titulo">Confirmar Exclusão</h3>
            <p className="modal-texto">
              Tem certeza que deseja apagar o time{" "}
              <strong>"{timeParaDeletar.Nome}"</strong>? Esta ação não pode ser
              desfeita.
            </p>

            <div className="modal-botoes">
              <button
                type="button"
                className="btn-modal-cancelar"
                onClick={() => setTimeParaDeletar(null)}
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-modal-confirmar"
                onClick={handleConfirmarDeletar}
                disabled={loading}
              >
                {loading ? "Deletando..." : "Sim, Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeletarTime;
