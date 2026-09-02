import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Horarios.css";


const bandeirasModules = import.meta.glob("../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}", { eager: true });
const BANDEIRAS = {};
for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Historico() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      const { data, error } = await supabase
        .from("confronto")
        .select(`
          id,
          horario,
          finalizado,
          time1 (
            id,
            Nome,
            logo_URL,
            modalidade:id_modalidade ( nome )
          ),
          time2 (
            id,
            Nome,
            logo_URL
          ),
          detalhes ( pontuacao )
        `)
        .eq("finalizado", true)
        .order("horario", { ascending: false });

      if (error) {
        console.error("Erro ao carregar histórico:", error);
      } else {
        setJogos(data || []);
      }
      setLoading(false);
    };

    fetchHistorico();
  }, []);

  const getBandeira = (logoURL) => {
    if (!logoURL) return null;
    return BANDEIRAS[logoURL] || null;
  };

  const formatarHorario = (horario) => {
    if (!horario) return "--:--";
    return new Date(horario).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">HISTÓRICO DE JOGOS</h1>
      </div>

      <div className="lista-confrontos">
        {loading ? (
          <p className="horarios-mensagem-vazia">Carregando...</p>
        ) : jogos.length === 0 ? (
          <p className="horarios-mensagem-vazia">
            Nenhum jogo finalizado até o momento.
          </p>
        ) : (
          jogos.map((jogo) => {
            const placar = jogo.detalhes?.[0]?.pontuacao || [0, 0];

            return (
              <div key={jogo.id} className="card-confronto">
                <span className="modalidade-titulo">
                  {jogo.time1?.modalidade?.nome || "Modalidade"}
                </span>

                <div className="conteudo-confronto">
                  <div className="time-box">
                    <div className="bandeira-container">
                      {getBandeira(jogo.time1?.logo_URL) ? (
                        <img
                          src={getBandeira(jogo.time1?.logo_URL)}
                          alt={jogo.time1?.Nome}
                          className="bandeira-img"
                        />
                      ) : (
                        <span className="bandeira-fallback">🏳️</span>
                      )}
                    </div>
                    <span className="nome-time">{jogo.time1?.Nome || "Time 1"}</span>
                  </div>

                  <div className="horario-pill placar-pill">
                    {placar[0] ?? 0} - {placar[1] ?? 0}
                  </div>

                  <div className="time-box">
                    <div className="bandeira-container">
                      {getBandeira(jogo.time2?.logo_URL) ? (
                        <img
                          src={getBandeira(jogo.time2?.logo_URL)}
                          alt={jogo.time2?.Nome}
                          className="bandeira-img"
                        />
                      ) : (
                        <span className="bandeira-fallback">🏳️</span>
                      )}
                    </div>
                    <span className="nome-time">{jogo.time2?.Nome || "Time 2"}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Historico;