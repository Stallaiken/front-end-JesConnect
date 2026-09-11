import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "../../css/admin/Finalizar.css";

const bandeirasModules = import.meta.glob(
  "../../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const BANDEIRAS = {};
for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Finalizar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [jogosAbertos, setJogosAbertos] = useState([]);
  const [jogoSelecionado, setJogoSelecionado] = useState(
    location.state?.jogo || null
  );

  const [gols1, setGols1] = useState(0);
  const [gols2, setGols2] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingJogos, setLoadingJogos] = useState(true);
  const [erro, setErro] = useState("");

  // Busca somente confrontos que realmente estão ao vivo.
  useEffect(() => {
    carregarJogosAbertos();
  }, []);

  const carregarJogosAbertos = async () => {
    setLoadingJogos(true);
    try {
      const { data, error } = await supabase
        .from("confronto")
        .select(`
          id,
          finalizado,
          time1:time!confronto_time1_fkey (id, Nome, logo_URL, id_modalidade, modalidade:modalidade(id, nome)),
          time2:time!confronto_time2_fkey (id, Nome, logo_URL, id_modalidade, modalidade:modalidade(id, nome))
        `)
        .eq("finalizado", false)
        .eq("ao_vivo", true);

      if (error) throw error;
      setJogosAbertos(data || []);
    } catch (err) {
      console.error("Erro ao buscar jogos em andamento:", err);
      setErro("Erro ao carregar partidas.");
    } finally {
      setLoadingJogos(false);
    }
  };

  // Clique no jogo: define o jogo selecionado no estado local sem mudar de página
  const handleSelecionarJogo = (jogo) => {
    setJogoSelecionado(jogo);
    setGols1(0);
    setGols2(0);
    setErro("");
  };

  const getBandeira = (logoURL) => {
    if (!logoURL) return null;
    return BANDEIRAS[logoURL] || null;
  };

  const alterarGols = (setter, delta) => {
    setter((valor) => Math.max(0, Number(valor) + delta));
  };

  const handleFinalizar = async () => {
    if (!jogoSelecionado) return;

    setLoading(true);
    setErro("");

    try {
      const ptnTime1 = Number(gols1);
      const ptnTime2 = Number(gols2);
      const vencedor =
        ptnTime1 === ptnTime2
          ? null
          : ptnTime1 > ptnTime2
            ? jogoSelecionado.time1?.id
            : jogoSelecionado.time2?.id;

      // Salva ou atualiza a pontuação na tabela 'detalhes'
      const { data: detalheExistente } = await supabase
        .from("detalhes")
        .select("id")
        .eq("confronto_id", jogoSelecionado.id)
        .maybeSingle();

      if (detalheExistente) {
        const { error } = await supabase
          .from("detalhes")
          .update({
            ptn_time1: ptnTime1,
            ptn_time2: ptnTime2,
            vencedor,
          })
          .eq("confronto_id", jogoSelecionado.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("detalhes")
          .insert({
            confronto_id: jogoSelecionado.id,
            ptn_time1: ptnTime1,
            ptn_time2: ptnTime2,
            vencedor,
          });
        if (error) throw error;
      }

      // Marca o confronto como finalizado
      const { error: erroConfronto } = await supabase
        .from("confronto")
        .update({ finalizado: true, ao_vivo: false })
        .eq("id", jogoSelecionado.id);

      if (erroConfronto) throw erroConfronto;

      // Finalizado com sucesso -> vai para o Historico
      navigate("/historico");
    } catch (err) {
      console.error("Erro ao finalizar:", err);
      setErro("Erro ao salvar os dados da partida.");
    } finally {
      setLoading(false);
    }
  };

  const time1 = jogoSelecionado?.time1 || {};
  const time2 = jogoSelecionado?.time2 || {};

  return (
    <div className="finalizar-container-page">
      {!jogoSelecionado ? (
        /* SELEÇÃO DO JOGO (EM ANDAMENTO) */
        <div className="lista-selecao-box">
          <h2 className="titulo-selecao">SELECIONE UMA PARTIDA EM ANDAMENTO</h2>

          {loadingJogos ? (
            <p className="texto-status">Carregando partidas...</p>
          ) : jogosAbertos.length === 0 ? (
            <p className="texto-status">Nenhum jogo em andamento encontrado.</p>
          ) : (
            <div className="cards-jogos-grid">
              {jogosAbertos.map((j) => (
                <div
                  key={j.id}
                  className="card-jogo-andamento"
                  onClick={() => handleSelecionarJogo(j)}
                >
                  <span className="modalidade-label">
                    {j.time1?.modalidade?.nome || "MODALIDADE"}
                  </span>
                  <div className="times-confronto">
                    <span>{j.time1?.Nome || "Time 1"}</span>
                    <strong className="vs-divisor">x</strong>
                    <span>{j.time2?.Nome || "Time 2"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* PAINEL DE CONTROLE DO PLACAR (LAYOUT DA IMAGEM) */
        <div className="painel-jogo-ativo">
          <button
            type="button"
            className="btn-voltar-selecao"
            onClick={() => setJogoSelecionado(null)}
          >
            ← Voltar para lista de jogos
          </button>

          {/* CARD PRETO DO PLACAR */}
          <div className="placar-card-fundo">
            {/* TIME 1 */}
            <div className="time-coluna">
              <div className="square-logo">
                {getBandeira(time1.logo_URL) ? (
                  <img src={getBandeira(time1.logo_URL)} alt={time1.Nome} />
                ) : null}
              </div>
              <span className="nome-turma">{time1.Nome || "nome da turma"}</span>
            </div>

            {/* PLACAR CENTRO */}
            <div className="placar-texto">
              {gols1} : {gols2}
            </div>

            {/* TIME 2 */}
            <div className="time-coluna">
              <div className="square-logo">
                {getBandeira(time2.logo_URL) ? (
                  <img src={getBandeira(time2.logo_URL)} alt={time2.Nome} />
                ) : null}
              </div>
              <span className="nome-turma">{time2.Nome || "nome da turma"}</span>
            </div>
          </div>

          {/* CONTROLES + - */}
          <div className="botoes-controles-row">
            {/* Botoes Time 1 */}
            <div className="botoes-time">
              <button
                type="button"
                className="btn-quadrado"
                onClick={() => alterarGols(setGols1, 1)}
              >
                +
              </button>
              <button
                type="button"
                className="btn-quadrado"
                onClick={() => alterarGols(setGols1, -1)}
              >
                −
              </button>
            </div>

            {/* Botoes Time 2 */}
            <div className="botoes-time">
              <button
                type="button"
                className="btn-quadrado"
                onClick={() => alterarGols(setGols2, 1)}
              >
                +
              </button>
              <button
                type="button"
                className="btn-quadrado"
                onClick={() => alterarGols(setGols2, -1)}
              >
                −
              </button>
            </div>
          </div>

          {erro && <p className="msg-erro">{erro}</p>}

          {/* BOTÃO FINALIZAR */}
          <button
            type="button"
            className="btn-finalizar-laranja"
            onClick={handleFinalizar}
            disabled={loading}
          >
            {loading ? "SALVANDO..." : "FINALIZAR"}
          </button>
        </div>
      )}

      {/* BOTÃO VOLTAR AO TOPO */}
      <button
        type="button"
        className="btn-topo-laranja"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Voltar ao topo"
      >
        ↑
      </button>
    </div>
  );
}

export default Finalizar;
