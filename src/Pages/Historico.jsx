import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Horarios.css";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  {
    eager: true,
  }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path
    .split("/")
    .pop()
    .split(".")[0];

  BANDEIRAS[fileName] =
    bandeirasModules[path].default;
}

function Historico() {
  const [historico, setHistorico] =
    useState([]);

  const [detalheModal, setDetalheModal] =
    useState(null);

  useEffect(() => {
    const carregarHistorico =
      async () => {

        const {
          data,
          error,
        } = await supabase
          .from("confronto")
          .select(`
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
          `)
          .eq(
            "finalizado",
            true
          )
          .order(
            "horario",
            {
              ascending: false,
            }
          );

        if (error) {
          console.error(
            "Erro histórico:",
            error
          );
          return;
        }

        setHistorico(
          data || []
        );
      };

    carregarHistorico();
  }, []);

  const pegarPontuacao = (
    jogo
  ) => {
    if (
      !jogo.detalhes ||
      jogo.detalhes.length === 0
    ) {
      return [0, 0, 0, 0, 0, 0];
    }

    return (
      jogo.detalhes[0]
        ?.pontuacao ||
      [0, 0, 0, 0, 0, 0]
    );
  };

  const getBandeira = (
    logoURL
  ) => {
    if (!logoURL) return null;

    return (
      BANDEIRAS[logoURL] ||
      null
    );
  };

  return (
    <div className="horarios-page">

      <div className="horarios-titulo-container">

        <h1 className="horarios-titulo">
          Histórico de Partidas
        </h1>

        <p className="horarios-subtitulo">
          Partidas Finalizadas
        </p>

      </div>

      <div className="lista-confrontos">

        {historico.length === 0 ? (
          <p className="horarios-mensagem-vazia">
            Nenhuma partida finalizada ainda.
          </p>
        ) : (

          historico.map((jogo) => {

            const pontuacao =
              pegarPontuacao(
                jogo
              );

            const gols1 =
              pontuacao[0] || 0;

            const gols2 =
              pontuacao[1] || 0;

            const bandeira1 =
              getBandeira(
                jogo.time1?.logo_URL
              );

            const bandeira2 =
              getBandeira(
                jogo.time2?.logo_URL
              );

            return (
              <div
                key={jogo.id}
                className="card-confronto card-editavel"
                onClick={() =>
                  setDetalheModal(
                    jogo
                  )
                }
              >

                <div className="conteudo-confronto">

                  <div className="time-box">

                    <div className="bandeira-container">

                      {bandeira1 && (
                        <img
                          src={bandeira1}
                          alt={
                            jogo.time1?.Nome
                          }
                          className="bandeira-img"
                        />
                      )}

                    </div>

                    <span className="nome-time">
                      {
                        jogo.time1?.Nome
                      }
                    </span>

                  </div>

                  <div
                    className="horario-pill"
                    style={{
                      backgroundColor:
                        "#222",
                    }}
                  >
                    {gols1} X {gols2}
                  </div>

                  <div className="time-box">

                    <div className="bandeira-container">

                      {bandeira2 && (
                        <img
                          src={bandeira2}
                          alt={
                            jogo.time2?.Nome
                          }
                          className="bandeira-img"
                        />
                      )}

                    </div>

                    <span className="nome-time">
                      {
                        jogo.time2?.Nome
                      }
                    </span>

                  </div>

                </div>

              </div>
            );
          })
        )}

      </div>

      {/* ==================================================
          MODAL
      ================================================== */}

      {detalheModal && (() => {

        const pontuacao =
          pegarPontuacao(
            detalheModal
          );

        return (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor:
                "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              zIndex: 1100,
              padding: "16px",
            }}
          >

            <div
              style={{
                backgroundColor:
                  "#000",
                color: "#fff",
                padding: "24px",
                borderRadius:
                  "20px",
                width: "100%",
                maxWidth:
                  "400px",
                boxSizing:
                  "border-box",
              }}
            >

              <h3
                style={{
                  color: "#1b52e0",
                  marginTop: 0,
                }}
              >
                Detalhes da Partida
              </h3>

              <p>
                <b>Placar:</b>{" "}
                {detalheModal
                  .time1?.Nome}{" "}
                {pontuacao[0] || 0}
                {" x "}
                {pontuacao[1] || 0}{" "}
                {detalheModal
                  .time2?.Nome}
              </p>

              <p>
                <b>
                  Cartões Amarelos:
                </b>{" "}
                {pontuacao[2] || 0}
                {" - "}
                {pontuacao[3] || 0}
              </p>

              <p>
                <b>
                  Cartões Vermelhos:
                </b>{" "}
                {pontuacao[4] || 0}
                {" - "}
                {pontuacao[5] || 0}
              </p>

              <button
                onClick={() =>
                  setDetalheModal(
                    null
                  )
                }
                className="horario-pill"
                style={{
                  width: "100%",
                  border: "none",
                  cursor: "pointer",
                  marginTop:
                    "16px",
                }}
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