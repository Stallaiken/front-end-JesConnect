import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/Horarios.css";
import { supabase } from "../supabaseClient";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function ModalidadeFiltro() {
  const { nomeModalidade } = useParams();

  const modalidadeAtual = decodeURIComponent(
    nomeModalidade || ""
  ).toUpperCase();

  const possuiGenero =
    modalidadeAtual !== "FUTSETE" && modalidadeAtual !== "FUT 7";

  const [generoFiltro, setGeneroFiltro] = useState("M");
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarJogos = async () => {
      setLoading(true);
      setErro("");

      try {
        const { data, error } = await supabase
          .from("confronto")
          .select(
            `
              id,
              horario,
              finalizado,

              time1:time1 (
                id,
                Nome,
                logo_URL,

                modalidade:id_modalidade (
                  id,
                  nome,
                  genero
                )
              ),

              time2:time2 (
                id,
                Nome,
                logo_URL
              )
            `
          )
          .eq("finalizado", false);

        if (error) {
          throw error;
        }

        const filtrados = (data || []).filter((jogo) => {
          const modNome = jogo.time1?.modalidade?.nome?.toUpperCase() || "";
          const modGenero = jogo.time1?.modalidade?.genero?.toUpperCase() || "";

          const confereMod =
            modNome === modalidadeAtual ||
            modNome.includes(modalidadeAtual) ||
            modalidadeAtual.includes(modNome);

          const confereGenero = possuiGenero
            ? modGenero === generoFiltro
            : true;

          return confereMod && confereGenero;
        });

        setJogos(filtrados);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar os jogos.");
      } finally {
        setLoading(false);
      }
    };

    buscarJogos();
  }, [modalidadeAtual, generoFiltro, possuiGenero]);

  const renderBandeira = (logoURL) => {
    if (!logoURL) return null;

    const imgUrl = BANDEIRAS[logoURL];
    if (!imgUrl) return null;

    return <img src={imgUrl} alt="Bandeira" className="bandeira-img" />;
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
      <div className="horarios-titulo-container" style={{ marginBottom: "20px" }}>
        <h1 className="horarios-titulo">Horários de Início</h1>
        <h2 className="horarios-subtitulo">{modalidadeAtual}</h2>
      </div>

      {possuiGenero && (
        <div
          className="filtros-container"
          style={{ marginTop: "20px", marginBottom: "28px" }}
        >
          <div
            className={`genero-toggle ${
              generoFiltro === "F" ? "feminino" : "masculino"
            }`}
            onClick={() => setGeneroFiltro(generoFiltro === "M" ? "F" : "M")}
          >
            <div className="genero-toggle-bolinha"></div>
            <span className="genero-opcao">MASCULINO</span>
            <span className="genero-opcao">FEMININO</span>
          </div>
        </div>
      )}

      {erro && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {erro}
        </p>
      )}

      <div className="lista-confrontos">
        {loading ? (
          <p className="horarios-mensagem-vazia">Carregando jogos...</p>
        ) : jogos.length > 0 ? (
          jogos.map((jogo) => (
            <div key={jogo.id} className="card-confronto">
              <span className="modalidade-titulo">{modalidadeAtual}</span>

              <div className="conteudo-confronto">
                <div className="time-box">
                  <div className="bandeira-container">
                    {renderBandeira(jogo.time1?.logo_URL)}
                  </div>

                  <span className="nome-time">
                    {jogo.time1?.Nome || "Time 1"}
                  </span>
                </div>

                <div className="horario-pill">
                  {formatarHorario(jogo.horario)}
                </div>

                <div className="time-box">
                  <div className="bandeira-container">
                    {renderBandeira(jogo.time2?.logo_URL)}
                  </div>

                  <span className="nome-time">
                    {jogo.time2?.Nome || "Time 2"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="horarios-mensagem-vazia">Nenhum jogo encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default ModalidadeFiltro;