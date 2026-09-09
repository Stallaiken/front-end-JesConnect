import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Horarios.css";

// Mapeamento dinâmico das bandeiras
// Mapeamento dinâmico das bandeiras
const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
  { eager: true }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Horarios() {
  const [generoFiltro, setGeneroFiltro] = useState("M");

  // Guarda o ID da modalidade selecionada no SELECT
  const [modalidadeId, setModalidadeId] = useState("");

  const [modalidades, setModalidades] = useState([]);
  const [confrontos, setConfrontos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erroSupabase, setErroSupabase] = useState("");
  const [mostrarSeta, setMostrarSeta] = useState(false);

  // ============================================================
  // BOTÃO VOLTAR AO TOPO
  // ============================================================

  useEffect(() => {
    const handleScroll = () => {
      setMostrarSeta(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ============================================================
  // CARREGAR MODALIDADES
  // ============================================================

  useEffect(() => {
    async function carregarModalidades() {
      const { data, error } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (error) {
        console.error("Erro ao carregar modalidades:", error);
        setErroSupabase(error.message);
        return;
      }

      setModalidades(data || []);
    }

    carregarModalidades();
  }, []);

  // ============================================================
  // CARREGAR CONFRONTOS
  // ============================================================

  useEffect(() => {
    async function buscarConfrontos() {
      setLoading(true);
      setErroSupabase("");

      try {
        const { data, error } = await supabase
          .from("confronto")
          .select(`
            id,
            horario,
            finalizado,

            time1:time1 (
              id,
              Nome,
              logo_URL,
              id_modalidade
            ),

            time2:time2 (
              id,
              Nome,
              logo_URL,
              id_modalidade
            )
          `);

        if (error) {
          console.error("Erro no Supabase:", error);
          setErroSupabase(error.message);
          return;
        }

        setConfrontos(data || []);
      } catch (err) {
        console.error("Erro de requisição:", err);
        setErroSupabase("Erro ao conectar ao banco de dados.");
      } finally {
        setLoading(false);
      }
    }

    buscarConfrontos();

    buscarConfrontos();
  }, []);

  // ============================================================
  // RENDERIZAR BANDEIRA
  // ============================================================

  const renderBandeira = (logoURL, nomeAlt) => {
    if (!logoURL) return null;

    const imgUrl = BANDEIRAS[logoURL] || logoURL;

    return (
      <img
        src={imgUrl}
        alt={nomeAlt || "Bandeira"}
        className="bandeira-img"
      />
    );
  };

  // ============================================================
  // VOLTAR AO TOPO
  // ============================================================

  const subirParaTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // FILTRAR CONFRONTOS
  // ============================================================

  const confrontosFiltrados = confrontos.filter((jogo) => {
    // Não mostrar confrontos finalizados
    if (jogo.finalizado === true) {
      return false;
    }

    // ------------------------------------------------------------
    // ID DA MODALIDADE SELECIONADA
    // ------------------------------------------------------------

    // Exemplo:
    // modalidadeId = "550e8400-e29b-41d4-a716-446655440000"

    const idModalidadeSelecionada = modalidadeId;

    // ------------------------------------------------------------
    // ID DA MODALIDADE DO TIME
    // ------------------------------------------------------------

    // O confronto aponta para o time através de:
    //
    // confronto.time1 -> time.id
    //
    // E o time possui:
    //
    // time.id_modalidade -> modalidade.id

    const idModalidadeTime1 = jogo.time1?.id_modalidade;

    // ------------------------------------------------------------
    // COMPARAÇÃO
    // ------------------------------------------------------------

    // Se o usuário selecionou uma modalidade,
    // compara:
    //
    // modalidade.id
    //       =
    // time.id_modalidade

    if (idModalidadeSelecionada) {
      const mesmaModalidade =
        String(idModalidadeTime1) === String(idModalidadeSelecionada);

      // Se não for a modalidade selecionada,
      // não mostra o confronto.
      if (!mesmaModalidade) {
        return false;
      }
    }

    // ------------------------------------------------------------
    // FILTRO DE GÊNERO
    // ------------------------------------------------------------

    // O gênero vem da modalidade escolhida.
    //
    // Para isso encontramos a modalidade correspondente
    // ao id_modalidade do time.

    const modalidadeDoTime = modalidades.find(
      (modalidade) =>
        String(modalidade.id) === String(idModalidadeTime1)
    );

    const modGenero = (
      modalidadeDoTime?.genero || ""
    ).toUpperCase();

    // Modalidades "Not" não possuem filtro de gênero
    if (
      modGenero &&
      modGenero !== "NOT" &&
      modGenero !== "N"
    ) {
      if (modGenero !== generoFiltro) {
        return false;
      }
    }

    return true;
  });

  // ============================================================
  // TELA
  // ============================================================

  return (
    <div className="horarios-container">

      {/* ========================================================
          FILTROS
      ======================================================== */}

      <div className="filtros-wrapper">

        {/* FILTRO DE GÊNERO */}

        <div className="genero-toggle">

          <button
            type="button"
            className={`btn-genero ${
              generoFiltro === "M" ? "active" : ""
            }`}
            onClick={() => setGeneroFiltro("M")}
          >
            MASC
          </button>

          <button
            type="button"
            className={`btn-genero ${
              generoFiltro === "F" ? "active" : ""
            }`}
            onClick={() => setGeneroFiltro("F")}
          >
            FEM
          </button>

        </div>

        {/* FILTRO DE MODALIDADE */}

        <div className="select-modalidade-wrapper">

          <select
            value={modalidadeId}
            onChange={(e) => setModalidadeId(e.target.value)}
            className="select-modalidade"
          >

            <option value="">
              MODALIDADE ↓
            </option>

            {modalidades.map((modalidade) => (
              <option
                key={modalidade.id}
                value={modalidade.id}
              >
                {modalidade.nome.toUpperCase()}

                {modalidade.genero &&
                modalidade.genero !== "Not"
                  ? ` (${modalidade.genero})`
                  : ""}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* ========================================================
          CARD AO VIVO
      ======================================================== */}

      <div className="lista-cards">

        <div className="card-partida live">

          <span className="badge-status-live">
            AO VIVO <span className="dot">•</span>
          </span>

          <div className="conteudo-partida">

            <div className="col-time">
              <div className="box-logo" />

              <span className="nome-turma">
                nome da turma
              </span>
            </div>

            <div className="placar-box">
              0 : 0
            </div>

            <div className="col-time">

              <div className="box-logo" />

              <span className="nome-turma">
                nome da turma
              </span>

            </div>

          </div>

          <div className="badge-quadra">
            QUADRA 4
          </div>

        </div>

      </div>

      {/* ========================================================
          DIVISOR
      ======================================================== */}

      <div className="divisor-em-breve">

        <div className="linha-laranja" />

        <span className="badge-divisor">
          EM BREVE
        </span>

      </div>

      {/* ========================================================
          CONFRONTOS DO BANCO
      ======================================================== */}

      <div className="lista-cards">

        {loading ? (

          <p className="loading-text">
            Carregando horários...
          </p>

        ) : erroSupabase ? (

          <p
            className="loading-text"
            style={{ color: "red" }}
          >
            {erroSupabase}
          </p>

        ) : confrontosFiltrados.length > 0 ? (

          confrontosFiltrados.map((jogo) => (

            <div
              key={jogo.id}
              className="card-partida"
            >

              <span className="badge-status-upcoming">
                EM BREVE •
              </span>

              <div className="conteudo-partida">

                {/* TIME 1 */}

                <div className="col-time">

                  <div className="box-logo">

                    {renderBandeira(
                      jogo.time1?.logo_URL,
                      jogo.time1?.Nome
                    )}

                  </div>

                  <span className="nome-turma">
                    {jogo.time1?.Nome || "Time 1"}
                  </span>

                </div>

                {/* PLACAR */}

                <div className="placar-box">
                  0 : 0
                </div>

                {/* TIME 2 */}

                <div className="col-time">

                  <div className="box-logo">

                    {renderBandeira(
                      jogo.time2?.logo_URL,
                      jogo.time2?.Nome
                    )}

                  </div>

                  <span className="nome-turma">
                    {jogo.time2?.Nome || "Time 2"}
                  </span>

                </div>

              </div>

              <div className="badge-quadra">
                QUADRA 2
              </div>

            </div>

          ))

        ) : (

          <p className="loading-text">
            Nenhum confronto encontrado.
          </p>

        )}

      </div>

      {/* ========================================================
          BOTÃO VOLTAR AO TOPO
      ======================================================== */}

      {mostrarSeta && (

        <button
          type="button"
          className="btn-scroll-top"
          onClick={subirParaTopo}
          aria-label="Voltar ao topo"
        >
          ↑
        </button>

      )}

    </div>
  );
}

export default Horarios;