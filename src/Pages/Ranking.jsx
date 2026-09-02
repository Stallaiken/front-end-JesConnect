import { useState, useEffect } from "react";

import { supabase } from "../supabaseClient";
import "../css/Horarios.css";

// Importação dinâmica de imagens de bandeiras
const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  {
    eager: true,
  },
);

const BANDEIRAS = {};
for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];

  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

// Utilitário para resolver o caminho/URL da bandeira
const getBandeira = (logo) => {
  if (!logo) return null;
  if (logo.startsWith("http://") || logo.startsWith("https://")) {
    return logo;
  }
  const cleanName = logo.split("/").pop().split(".")[0];
  return BANDEIRAS[cleanName] || null;
};

function Ranking() {
  const [ranking, setRanking] = useState([]);

  const [modalidades, setModalidades] = useState([]);

  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarModalidades = async () => {
      const { data, error } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");
    const carregarModalidades = async () => {
      const { data, error } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (error) {
        console.error(error);
        return;
      }

      setModalidades(data || []);

      if (data?.length > 0) {
        setModalidadeSelecionada(data[0].id);
      }
    };

    carregarModalidades();
  }, []);

  useEffect(() => {
    if (!modalidadeSelecionada) return;

    const calcularRanking = async () => {
      setLoading(true);
    const calcularRanking = async () => {
      setLoading(true);

      try {
        // Times da modalidade
        const { data: times, error: erroTimes } = await supabase
          .from("time")
          .select("id, Nome, logo_URL, id_modalidade")
          .eq("id_modalidade", modalidadeSelecionada);

        if (erroTimes) {
          throw erroTimes;
        }

        // Confrontos finalizados
        const { data: jogos, error: erroJogos } = await supabase
          .from("confronto")
          .select(
            `
              id,
              time1,
              time2,
              finalizado,

              detalhes (
                pontuacao
              )
            `,
          )
          .eq("finalizado", true);

        if (erroJogos) {
          throw erroJogos;
        }

        const tabela = (times || []).map((time) => ({
          id: time.id,
          nome: time.Nome,
          logo: time.logo_URL,

          pontos: 0,

          jogos: 0,

          vitorias: 0,

          empates: 0,

          derrotas: 0,

          golsPro: 0,

          golsContra: 0,

          saldo: 0,
        }));

        (jogos || []).forEach((jogo) => {
          const t1 = tabela.find((time) => time.id === jogo.time1);

          const t2 = tabela.find((time) => time.id === jogo.time2);

          if (!t1 || !t2) {
            return;
          }

          const pontuacao = jogo.detalhes?.[0]?.pontuacao;

          const gols1 = Number(pontuacao?.[0] || 0);

          const gols2 = Number(pontuacao?.[1] || 0);

          t1.jogos += 1;
          t2.jogos += 1;
          t1.jogos += 1;
          t2.jogos += 1;

          t1.golsPro += gols1;

          t1.golsContra += gols2;

          t2.golsPro += gols2;

          t2.golsContra += gols1;

          if (gols1 > gols2) {
            t1.pontos += 3;
            t1.vitorias += 1;
            t2.derrotas += 1;
          } else if (gols2 > gols1) {
            t2.pontos += 3;
            t2.vitorias += 1;
            t1.derrotas += 1;
          } else {
            t1.pontos += 1;
            t2.pontos += 1;

            t1.empates += 1;
            t2.empates += 1;
          }
        });

        tabela.forEach((time) => {
          time.saldo = time.golsPro - time.golsContra;
        });


        tabela.sort(
          (a, b) =>
            b.pontos - a.pontos || b.saldo - a.saldo || b.golsPro - a.golsPro,
        );

        setRanking(tabela);
      } catch (err) {
        console.error("Erro no ranking:", err);

        setRanking([]);
      } finally {
        setLoading(false);
      }
    };

    calcularRanking();
  }, [modalidadeSelecionada]);
  }, [modalidadeSelecionada]);

  const primeiro = ranking[0];

  const segundo = ranking[1];

  const terceiro = ranking[2];

  const resto = ranking.slice(3);

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Ranking Oficial</h1>

        <p className="horarios-subtitulo">Classificação por Modalidade</p>
      </div>

      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <select
          value={modalidadeSelecionada}
          onChange={(e) => setModalidadeSelecionada(e.target.value)}
          value={modalidadeSelecionada}
          onChange={(e) => setModalidadeSelecionada(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: "bold",
            background: "#000",
            color: "#fff",
            border: "none",
          }}
        >
          {modalidades.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
              {m.genero && m.genero !== "Not" ? ` (${m.genero})` : ""}
            </option>
          ))}
          {modalidades.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
              {m.genero && m.genero !== "Not" ? ` (${m.genero})` : ""}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="horarios-mensagem-vazia">Calculando ranking...</p>
      )}

      {!loading && ranking.length === 0 && (
        <p className="horarios-mensagem-vazia">Calculando ranking...</p>
      )}

      {!loading && ranking.length === 0 && (
        <p className="horarios-mensagem-vazia">
          Nenhuma partida finalizada para esta modalidade.
          Nenhuma partida finalizada para esta modalidade.
        </p>
      )}

      {!loading && ranking.length > 0 && (
        <>
          {/* PÓDIO */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: "12px",
              marginBottom: "32px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            {/* 2º */}
            {segundo && (
              <div
                className="card-confronto"
                style={{
                  flex: 1,
                  padding: "14px 10px",
                  alignItems: "center",
                  height: "140px",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    color: "#1b52e0",
                    fontWeight: "900",
                  }}
                >
                  2º LUGAR
                </span>

                {segundo.logo && BANDEIRAS[segundo.logo] && (
                  <img
                    src={BANDEIRAS[segundo.logo]}
                    alt={segundo.nome}
                    className="bandeira-img"
                  />
                )}

                <span className="nome-time">{segundo.nome}</span>

                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {segundo.pontos} PTS
                </span>
              </div>
            )}

            {/* 1º */}
            {primeiro && (
              <div
                className="card-confronto"
                style={{
                  flex: 1.1,
                  padding: "14px 10px",
                  alignItems: "center",
                  height: "170px",
                  justifyContent: "space-between",
                  border: "2px solid #1b52e0",
                }}
              >
                <span
                  style={{
                    fontWeight: "900",
                    fontSize: "1rem",
                  }}
                >
                  1º LUGAR
                </span>

                {primeiro.logo && BANDEIRAS[primeiro.logo] && (
                  <img
                    src={BANDEIRAS[primeiro.logo]}
                    alt={primeiro.nome}
                    className="bandeira-img"
                  />
                )}

                <span
                  className="nome-time"
                  style={{
                    fontSize: "0.85rem",
                  }}
                >
                  {primeiro.nome}
                </span>

                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  {primeiro.pontos} PTS
                </span>
              </div>
            )}

            {/* 3º */}
            {terceiro && (
              <div
                className="card-confronto"
                style={{
                  flex: 1,
                  padding: "14px 10px",
                  alignItems: "center",
                  height: "120px",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontWeight: "900",
                    fontSize: "0.9rem",
                  }}
                >
                  3º LUGAR
                </span>

                {terceiro.logo && BANDEIRAS[terceiro.logo] && (
                  <img
                    src={BANDEIRAS[terceiro.logo]}
                    alt={terceiro.nome}
                    className="bandeira-img"
                  />
                )}

                <span className="nome-time">{terceiro.nome}</span>

                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {terceiro.pontos} PTS
                </span>
              </div>
            )}
          </div>

          {/* DEMAIS TIMES */}
          <div
            className="lista-confrontos"
            style={{
              maxWidth: "500px",
            }}
          >
            {resto.map((time, idx) => (
              <div
                key={time.id}
                className="card-confronto"
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "800",
                      color: "#1b52e0",
                    }}
                  >
                    {idx + 4}º
                  </span>

                  {time.logo && BANDEIRAS[time.logo] && (
                    <img
                      src={BANDEIRAS[time.logo]}
                      alt={time.nome}
                      style={{
                        width: "40px",
                        height: "28px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <span
                    className="nome-time"
                    style={{
                      textAlign: "left",
                    }}
                  >
                    {time.nome}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "0.85rem",
                  }}
                >
                  <span>
                    <b>{time.pontos}</b> PTS
                  </span>

                  <span>
                    <b>{time.saldo}</b> SG
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Ranking;
