import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Historico.css";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Historico() {
  const [historico, setHistorico] = useState([]);
  const [detalheModal, setDetalheModal] = useState(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      const { data, error } = await supabase
        .from("confronto")
        .select(
          `
            id,
            horario,
            finalizado,

            time1:time1 (
              Nome,
              logo_URL
            ),

            time2:time2 (
              Nome,
              logo_URL
            ),

            detalhes:detalhes (
              pontuacao
            )
          `
        )
        .eq("finalizado", true)
        .order("horario", { ascending: false });

      if (error) {
        console.error("Erro histórico:", error);
        return;
      }

      setHistorico(data || []);
    };

    carregarHistorico();
  }, []);

  const pegarPontuacao = (jogo) => {
    if (!jogo.detalhes || jogo.detalhes.length === 0) {
      return [0, 0, 0, 0, 0, 0];
    }
    return jogo.detalhes[0]?.pontuacao || [0, 0, 0, 0, 0, 0];
  };

  const getBandeira = (logoURL) => {
    if (!logoURL) return null;
    return BANDEIRAS[logoURL] || null;
  };

  return (
    <div className="historico-page">
      <div className="historico-header">
        <h1 className="historico-titulo">Histórico de Partidas</h1>
        <p className="historico-subtitulo">Partidas Finalizadas</p>
      </div>

      <div className="historico-lista">
        {historico.length === 0 ? (
          <p className="historico-mensagem-vazia">
            Nenhuma partida finalizada ainda.
          </p>
        ) : (
          historico.map((jogo) => {
            const pontuacao = pegarPontuacao(jogo);
            const gols1 = pontuacao[0] || 0;
            const gols2 = pontuacao[1] || 0;

            const bandeira1 = getBandeira(jogo.time1?.logo_URL);
            const bandeira2 = getBandeira(jogo.time2?.logo_URL);

            return (
              <div
                key={jogo.id}
                className="historico-card historico-card-clicavel"
                onClick={() => setDetalheModal(jogo)}
              >
                <div className="historico-card-conteudo">
                  <div className="historico-time">
                    <div className="historico-bandeira-container">
                      {bandeira1 && (
                        <img
                          src={bandeira1}
                          alt={jogo.time1?.Nome}
                          className="historico-bandeira-img"
                        />
                      )}
                    </div>
                    <span className="historico-nome-time">
                      {jogo.time1?.Nome}
                    </span>
                  </div>

                  <div className="historico-placar">
                    {gols1} X {gols2}
                  </div>

                  <div className="historico-time">
                    <div className="historico-bandeira-container">
                      {bandeira2 && (
                        <img
                          src={bandeira2}
                          alt={jogo.time2?.Nome}
                          className="historico-bandeira-img"
                        />
                      )}
                    </div>
                    <span className="historico-nome-time">
                      {jogo.time2?.Nome}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {detalheModal &&
        (() => {
          const pontuacao = pegarPontuacao(detalheModal);

          return (
            <div className="historico-modal-overlay">
              <div className="historico-modal-container">
                <h3 className="historico-modal-titulo">Detalhes da Partida</h3>

                <p className="historico-modal-item">
                  <b>Placar:</b> {detalheModal.time1?.Nome} {pontuacao[0] || 0}
                  {" x "}
                  {pontuacao[1] || 0} {detalheModal.time2?.Nome}
                </p>

                <p className="historico-modal-item">
                  <b>Cartões Amarelos:</b> {pontuacao[2] || 0}
                  {" - "}
                  {pontuacao[3] || 0}
                </p>

                <p className="historico-modal-item">
                  <b>Cartões Vermelhos:</b> {pontuacao[4] || 0}
                  {" - "}
                  {pontuacao[5] || 0}
                </p>

                <button
                  onClick={() => setDetalheModal(null)}
                  className="historico-modal-btn"
                >
                  Fechar
                </button>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

export default Historico;