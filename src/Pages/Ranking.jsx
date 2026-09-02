import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Ranking.css";

// Bandeiras locais
const bandeirasModules = import.meta.glob("../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}", { eager: true });
const BANDEIRAS = {};
for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Ranking() {
  const [modalidade, setModalidade] = useState("QUEIMADO");
  const [generoFiltro, setGeneroFiltro] = useState("M");
  const [menuAberto, setMenuAberto] = useState(false);
  const [timesRanking, setTimesRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalidadesDisponiveis, setModalidadesDisponiveis] = useState([]);

  // Busca as modalidades do banco
  useEffect(() => {
    const carregarModalidades = async () => {
      const { data } = await supabase.from("modalidade").select("nome").order("nome");
      if (data && data.length > 0) {
        setModalidadesDisponiveis(data.map((m) => m.nome));
        setModalidade(data[0].nome); // pega a primeira como padrão
      }
    };
    carregarModalidades();
  }, []);

  // Calcula o ranking
  useEffect(() => {
    const calcularRanking = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("confronto")
        .select(`
          id,
          finalizado,
          time1 (
            id,
            Nome,
            logo_URL,
            modalidade:id_modalidade (
              nome,
              genero
            )
          ),
          time2 (
            id,
            Nome,
            logo_URL
          ),
          detalhes ( pontuacao )
        `)
        .eq("finalizado", true);

      if (error) {
        console.error("Erro ao carregar ranking:", error);
        setTimesRanking([]);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setTimesRanking([]);
        setLoading(false);
        return;
      }

      // Objeto para acumular pontos
      const pontuacao = {};

      data.forEach((jogo) => {
        const modNome = jogo.time1?.modalidade?.nome;
        const genero = jogo.time1?.modalidade?.genero;

        // Filtra pela modalidade e gênero selecionados
        if (modNome !== modalidade) return;
        if (genero && genero !== "Not" && genero !== generoFiltro) return;

        const placar = jogo.detalhes?.[0]?.pontuacao || [0, 0];
        const golsTime1 = placar[0] ?? 0;
        const golsTime2 = placar[1] ?? 0;

        const id1 = jogo.time1?.id;
        const id2 = jogo.time2?.id;
        const nome1 = jogo.time1?.Nome;
        const nome2 = jogo.time2?.Nome;
        const logo1 = jogo.time1?.logo_URL;
        const logo2 = jogo.time2?.logo_URL;

        // Inicializa os times se ainda não existirem
        if (id1 && !pontuacao[id1]) {
          pontuacao[id1] = { id: id1, nome: nome1, logo_URL: logo1, pontos: 0, jogos: 0 };
        }
        if (id2 && !pontuacao[id2]) {
          pontuacao[id2] = { id: id2, nome: nome2, logo_URL: logo2, pontos: 0, jogos: 0 };
        }

        if (id1) pontuacao[id1].jogos += 1;
        if (id2) pontuacao[id2].jogos += 1;

        // Regras simples de pontuação (pode ajustar depois)
        if (golsTime1 > golsTime2) {
          pontuacao[id1].pontos += 3; // vitória
        } else if (golsTime2 > golsTime1) {
          pontuacao[id2].pontos += 3; // vitória
        } else {
          // empate
          if (id1) pontuacao[id1].pontos += 1;
          if (id2) pontuacao[id2].pontos += 1;
        }
      });


      const ranking = Object.values(pontuacao).sort((a, b) => b.pontos - a.pontos);
      setTimesRanking(ranking);
      setLoading(false);
    };

    calcularRanking();
  }, [modalidade, generoFiltro]);

  const getBandeira = (logoURL) => {
    if (!logoURL) return null;
    return BANDEIRAS[logoURL] || null;
  };

  const ocultarBotaoGenero = modalidade === "FUTSETE";

  const primeiro = timesRanking[0];
  const segundo = timesRanking[1];
  const terceiro = timesRanking[2];
  const demaisTimes = timesRanking.slice(3);

  return (
    <div className="ranking-page">
      <div className="ranking-container">
        <h1 className="ranking-titulo">RANKING</h1>

        {/* Seletor de Modalidade */}
        <div className="modalidade-selector">
          <button
            className="modalidade-btn"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {modalidade}
            <span className="seta-dropdown">{menuAberto ? "▲" : "▼"}</span>
          </button>

          {menuAberto && (
            <div className="modalidade-dropdown">
              {modalidadesDisponiveis.map((mod) => (
                <div
                  key={mod}
                  className={`dropdown-item ${mod === modalidade ? "ativo" : ""}`}
                  onClick={() => {
                    setModalidade(mod);
                    setMenuAberto(false);
                  }}
                >
                  {mod}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filtro de Gênero */}
        {!ocultarBotaoGenero && (
          <div className="filtros-container">
            <div className="toggle-genero-container">
              <button
                className={`btn-genero ${generoFiltro === "M" ? "ativo" : ""}`}
                onClick={() => setGeneroFiltro("M")}
              >
                M
              </button>
              <button
                className={`btn-genero ${generoFiltro === "F" ? "ativo" : ""}`}
                onClick={() => setGeneroFiltro("F")}
              >
                F
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="mensagem-vazia">Carregando ranking...</p>
        ) : timesRanking.length === 0 ? (
          <p className="mensagem-vazia">
            Nenhuma partida foi finalizada ainda.
          </p>
        ) : (
          <>
            {/* Pódio */}
            <div className="podio-container">
              {/* 3º */}
              <div className="podio-coluna">
                <div className="bandeira-podio-wrapper">
                  {terceiro && getBandeira(terceiro.logo_URL) ? (
                    <img src={getBandeira(terceiro.logo_URL)} alt={terceiro.nome} className="bandeira-img" />
                  ) : (
                    <span className="bandeira-emoji">🏳️</span>
                  )}
                </div>
                <div className="bloco-podio bloco-terceiro">
                  <span className="posicao-numero">3</span>
                </div>
              </div>

              {/* 1º */}
              <div className="podio-coluna">
                <div className="bandeira-podio-wrapper">
                  {primeiro && getBandeira(primeiro.logo_URL) ? (
                    <img src={getBandeira(primeiro.logo_URL)} alt={primeiro.nome} className="bandeira-img" />
                  ) : (
                    <span className="bandeira-emoji">🏳️</span>
                  )}
                </div>
                <div className="bloco-podio bloco-primeiro">
                  <span className="posicao-numero">1</span>
                </div>
              </div>

              {/* 2º */}
              <div className="podio-coluna">
                <div className="bandeira-podio-wrapper">
                  {segundo && getBandeira(segundo.logo_URL) ? (
                    <img src={getBandeira(segundo.logo_URL)} alt={segundo.nome} className="bandeira-img" />
                  ) : (
                    <span className="bandeira-emoji">🏳️</span>
                  )}
                </div>
                <div className="bloco-podio bloco-segundo">
                  <span className="posicao-numero">2</span>
                </div>
              </div>
            </div>

        
            <div className="ranking-lista">
              {demaisTimes.length > 0 ? (
                demaisTimes.map((time, idx) => (
                  <div key={time.id} className="card-ranking-item">
                    <span className="posicao-lista">{idx + 4}</span>
                    <span className="nome-time-lista">{time.nome}</span>
                    <div className="bandeira-badge-lista">
                      {getBandeira(time.logo_URL) ? (
                        <img src={getBandeira(time.logo_URL)} alt={time.nome} className="bandeira-img" />
                      ) : (
                        <span className="bandeira-emoji">🏳️</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="mensagem-vazia">Sem mais times para esta modalidade.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Ranking;