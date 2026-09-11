import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "../css/Horarios.css";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function BandeiraImg({ logoURL, nomeAlt }) {
  const [erroImg, setErroImg] = useState(false);
  const imgUrl = logoURL ? BANDEIRAS[logoURL] || logoURL : null;

  if (!imgUrl || erroImg) {
    return <span className="time-logo-x">X</span>;
  }

  return (
    <img
      src={imgUrl}
      alt={nomeAlt || "Bandeira"}
      className="bandeira-img"
      onError={() => setErroImg(true)}
    />
  );
}

function Horarios({
  acaoSelecao = null,
  jogoSelecionado = null,
  onSelecionarJogo,
}) {
  const [generoFiltro, setGeneroFiltro] = useState("M");
  const [modalidadeId, setModalidadeId] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [confrontos, setConfrontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroSupabase, setErroSupabase] = useState("");
  const [mostrarSeta, setMostrarSeta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarSeta(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErroSupabase("");

      const { data: mods, error: errMods } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (errMods) {
        console.error("Erro modalidades:", errMods);
      }

      setModalidades(mods || []);

      const { data: confs, error: errConfs } = await supabase
        .from("confronto")
        .select(`
          id,
          finalizado,
          ao_vivo,
          horario,

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

      if (errConfs) {
        console.error("Erro confrontos:", errConfs);
        setErroSupabase(errConfs.message);
      } else {
        setConfrontos(confs || []);
      }

      setLoading(false);
    }

    carregarDados();
  }, []);

  const subirParaTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSelecao = (evento, jogo) => {
    evento?.stopPropagation();

    if (typeof onSelecionarJogo === "function") {
      onSelecionarJogo(jogo);
    }
  };

  const jogoPodeSerSelecionado = (jogo) => {
    if (!acaoSelecao) {
      return false;
    }

    if (acaoSelecao === "comecar") {
      return jogo.ao_vivo !== true;
    }

    if (acaoSelecao === "editar" || acaoSelecao === "finalizar") {
      return jogo.ao_vivo === true;
    }

    return acaoSelecao === "deletar";
  };

  const textoSelecao = {
    editar: "Selecione uma partida ao vivo para editar",
    deletar: "Selecione a partida que deseja excluir",
    comecar: "Selecione uma partida em breve para começar",
    finalizar: "Selecione uma partida ao vivo para finalizar",
  }[acaoSelecao];

  const confrontosFiltrados = confrontos.filter((jogo) => {
    // 1. Não mostra partidas finalizadas
    if (jogo.finalizado === true) {
      return false;
    }

    // 2. Não mostra partidas que ainda não possuem os dois times
    if (!jogo.time1?.id || !jogo.time2?.id) {
      return false;
    }

    const idModalidadeTime1 = jogo.time1.id_modalidade;

    // 3. Filtro de modalidade
    if (modalidadeId) {
      const mesmaModalidade =
        String(idModalidadeTime1) === String(modalidadeId);

      if (!mesmaModalidade) {
        return false;
      }
    }

    // 4. Descobre a modalidade do time
    const modalidadeDoTime = modalidades.find(
      (modalidade) =>
        String(modalidade.id) === String(idModalidadeTime1),
    );

    const modGenero = (modalidadeDoTime?.genero || "").toUpperCase();

    // 5. Filtro masculino/feminino
    if (modGenero && modGenero !== "NOT" && modGenero !== "N") {
      if (modGenero !== generoFiltro) {
        return false;
      }
    }

    return true;
  });

  const aoVivoFiltrados = confrontosFiltrados.filter(
    (jogo) => jogo.ao_vivo === true,
  );

  const emBreveFiltrados = confrontosFiltrados.filter(
    (jogo) => jogo.ao_vivo !== true,
  );

  const renderizarCard = (jogo, aoVivo) => {
    const selecionado = jogoSelecionado?.id === jogo.id;
    const selecionavel = jogoPodeSerSelecionado(jogo);

    return (
      <div key={jogo.id} className="card-item-wrapper">
        <div
          className={`card-partida ${aoVivo ? "live" : ""} ${
            selecionado ? "card-selecionado" : ""
          }`}
          onClick={(evento) => {
            if (selecionavel) {
              handleSelecao(evento, jogo);
            }
          }}
          style={{
            cursor: selecionavel ? "pointer" : "default",
          }}
        >
          <span
            className={
              aoVivo
                ? "badge-status-live"
                : "badge-status-upcoming"
            }
          >
            {aoVivo ? (
              <>
                AO VIVO <span className="dot">•</span>
              </>
            ) : (
              "EM BREVE •"
            )}
          </span>

          <div className="conteudo-partida">
            <div className="col-time">
              <div className="box-logo">
                <BandeiraImg
                  logoURL={jogo.time1.logo_URL}
                  nomeAlt={jogo.time1.Nome}
                />
              </div>

              <span className="nome-turma">
                {jogo.time1.Nome}
              </span>
            </div>

            <div className="placar-box">VS</div>

            <div className="col-time">
              <div className="box-logo">
                <BandeiraImg
                  logoURL={jogo.time2.logo_URL}
                  nomeAlt={jogo.time2.Nome}
                />
              </div>

              <span className="nome-turma">
                {jogo.time2.Nome}
              </span>
            </div>
          </div>

          <div className="badge-quadra">QUADRA</div>
        </div>

        {selecionavel && (
          <button
            type="button"
            className="btn-selecionar-editar"
            onClick={(evento) => handleSelecao(evento, jogo)}
          >
            {selecionado ? "SELECIONADO" : "SELECIONAR"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="horarios-container">
      {textoSelecao && (
        <div className="aviso-selecao">
          {textoSelecao}
        </div>
      )}

      <div className="filtros-wrapper">
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

        <div className="select-modalidade-wrapper">
          <select
            value={modalidadeId}
            onChange={(evento) =>
              setModalidadeId(evento.target.value)
            }
            className="select-modalidade"
          >
            <option value="">MODALIDADE ↓</option>

            {modalidades.map((modalidade) => (
              <option key={modalidade.id} value={modalidade.id}>
                {modalidade.nome?.toUpperCase()}
                {modalidade.genero &&
                modalidade.genero !== "Not"
                  ? ` (${modalidade.genero})`
                  : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

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
      ) : (
        <>
          <div className="lista-cards">
            {aoVivoFiltrados.length > 0 ? (
              aoVivoFiltrados.map((jogo) =>
                renderizarCard(jogo, true),
              )
            ) : (
              <p className="loading-text">
                Nenhuma partida ao vivo no momento.
              </p>
            )}
          </div>

          <div className="divisor-em-breve">
            <div className="linha-laranja" />
            <span className="badge-divisor">
              EM BREVE
            </span>
          </div>

          <div className="lista-cards">
            {emBreveFiltrados.length > 0 ? (
              emBreveFiltrados.map((jogo) =>
                renderizarCard(jogo, false),
              )
            ) : (
              <p className="loading-text">
                Nenhum confronto agendado em breve.
              </p>
            )}
          </div>
        </>
      )}

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