import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Horarios.css";

// Importação dinâmica de imagens de bandeiras
const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
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

      if (error) {
        console.error("Erro ao carregar modalidades:", error);
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

      try {
        // 1. Buscar times da modalidade
        const { data: times, error: erroTimes } = await supabase
          .from("time")
          .select("id, Nome, logo_URL, id_modalidade")
          .eq("id_modalidade", modalidadeSelecionada);

        if (erroTimes) throw erroTimes;

        if (!times || times.length === 0) {
          setRanking([]);
          return;
        }

        const teamIds = times.map((t) => t.id);

        // 2. Buscar confrontos finalizados apenas dos times da modalidade
        const { data: jogos, error: erroJogos } = await supabase
          .from("confronto")
          .select(`
            id,
            time1,
            time2,
            finalizado,
            detalhes ( pontuacao )
          `)
          .eq("finalizado", true)
          .or(`time1.in.(${teamIds.join(",")}),time2.in.(${teamIds.join(",")})`);

        if (erroJogos) throw erroJogos;

        // 3. Montar tabela base
        const tabela = times.map((time) => ({
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

        // 4. Processar resultados dos jogos
        (jogos || []).forEach((jogo) => {
          const t1 = tabela.find((t) => t.id === jogo.time1);
          const t2 = tabela.find((t) => t.id === jogo.time2);

          if (!t1 || !t2) return;

          const pontuacao = jogo.detalhes?.[0]?.pontuacao;
          const gols1 = Number(pontuacao?.[0] || 0);
          const gols2 = Number(pontuacao?.[1] || 0);

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

        // 5. Calcular saldo e ordenar por critérios de desempate
        tabela.forEach((time) => {
          time.saldo = time.golsPro - time.golsContra;
        });

        tabela.sort(
          (a, b) =>
            b.pontos - a.pontos ||
            b.saldo - a.saldo ||
            b.golsPro - a.golsPro ||
            b.vitorias - a.vitorias ||
            a.nome.localeCompare(b.nome)
        );

        setRanking(tabela);
      } catch (err) {
        console.error("Erro no cálculo do ranking:", err);
        setRanking([]);
      } finally {
        setLoading(false);
      }
    };

    calcularRanking();
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

      {/* SELETOR DE MODALIDADES */}
      <div style={{ marginBottom: "24px" }}>
        <select
          value={modalidadeSelecionada}
          onChange={(e) => setModalidadeSelecionada(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: "bold",
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
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
        <p className="horarios-mensagem-vazia">
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
            {/* 2º LUGAR */}
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
                <span style={{ color: "#1b52e0", fontWeight: "900" }}>
                  2º LUGAR
                </span>

                {/* Espaço reservado fixo para a bandeira */}
                <div
                  style={{
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getBandeira(segundo.logo) && (
                    <img
                      src={getBandeira(segundo.logo)}
                      alt={segundo.nome}
                      className="bandeira-img"
                      style={{
                        width: "45px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </div>

                <span className="nome-time">{segundo.nome}</span>

                <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>
                  {segundo.pontos} PTS
                </span>
              </div>
            )}

            {/* 1º LUGAR */}
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
                <span style={{ fontWeight: "900", fontSize: "1rem" }}>
                  1º LUGAR
                </span>

                {/* Espaço reservado fixo para a bandeira */}
                <div
                  style={{
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getBandeira(primeiro.logo) && (
                    <img
                      src={getBandeira(primeiro.logo)}
                      alt={primeiro.nome}
                      className="bandeira-img"
                      style={{
                        width: "50px",
                        height: "34px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </div>

                <span className="nome-time" style={{ fontSize: "0.85rem" }}>
                  {primeiro.nome}
                </span>

                <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                  {primeiro.pontos} PTS
                </span>
              </div>
            )}

            {/* 3º LUGAR */}
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
                <span style={{ fontWeight: "900", fontSize: "0.9rem" }}>
                  3º LUGAR
                </span>

                {/* Espaço reservado fixo para a bandeira */}
                <div
                  style={{
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getBandeira(terceiro.logo) && (
                    <img
                      src={getBandeira(terceiro.logo)}
                      alt={terceiro.nome}
                      className="bandeira-img"
                      style={{
                        width: "45px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </div>

                <span className="nome-time">{terceiro.nome}</span>

                <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>
                  {terceiro.pontos} PTS
                </span>
              </div>
            )}
          </div>

          {/* DEMAIS TIMES (4º LUGAR EM DIANTE) */}
          {resto.length > 0 && (
            <div
              className="lista-confrontos"
              style={{ maxWidth: "500px", width: "100%" }}
            >
              {resto.map((time, idx) => (
                <div
                  key={time.id}
                  className="card-confronto"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 20px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontWeight: "800", color: "#1b52e0" }}>
                      {idx + 4}º
                    </span>

                    {/* Container fixo para alinhar nomes com ou sem bandeira */}
                    <div
                      style={{
                        width: "40px",
                        height: "26px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getBandeira(time.logo) && (
                        <img
                          src={getBandeira(time.logo)}
                          alt={time.nome}
                          style={{
                            width: "40px",
                            height: "26px",
                            objectFit: "cover",
                            borderRadius: "3px",
                          }}
                        />
                      )}
                    </div>

                    <span className="nome-time" style={{ textAlign: "left" }}>
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
          )}
        </>
      )}
    </div>
  );
}

export default Ranking;