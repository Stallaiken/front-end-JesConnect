import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import "../../css/admin/EditarJogo.css";

const bandeirasModules = import.meta.glob(
  "../../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);

const BANDEIRAS = {};
for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

// Componente para a Bandeira 100% seguro contra erros no DOM do React
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

function EditarJogo() {
  const location = useLocation();
  const navigate = useNavigate();

  const jogoOriginal = location.state?.jogo || null;
  const jogoId = location.state?.id || jogoOriginal?.id;

  const [modalidades, setModalidades] = useState([]);
  const [times, setTimes] = useState([]);

  const [modalidadeId, setModalidadeId] = useState("");
  const [time1Id, setTime1Id] = useState("");
  const [time2Id, setTime2Id] = useState("");
  const [local, setLocal] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // 1. Carrega as Modalidades e Times do Supabase
  useEffect(() => {
    async function carregarDados() {
      const { data: dataMod } = await supabase
        .from("modalidade")
        .select("*")
        .order("nome");
      setModalidades(dataMod || []);

      const { data: dataTimes } = await supabase
        .from("time")
        .select("*")
        .order("Nome");
      setTimes(dataTimes || []);
    }
    carregarDados();
  }, []);

  // Preenche o formulário consultando o registro atual no banco.
  useEffect(() => {
    async function inicializarFormulario() {
      if (!jogoId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("confronto")
        .select(
          `
          id,
          time1:time!confronto_time1_fkey ( id, id_modalidade ),
          time2:time!confronto_time2_fkey ( id ),
          detalhes:detalhes ( id, local )
        `,
        )
        .eq("id", jogoId)
        .single();

      setLoading(false);

      if (error) {
        setErro(`Erro ao carregar o jogo: ${error.message}`);
        return;
      }

      setTime1Id(data.time1?.id || "");
      setTime2Id(data.time2?.id || "");
      setModalidadeId(data.time1?.id_modalidade || "");
      setLocal(data.detalhes?.[0]?.local || "");
    }

    inicializarFormulario();
  }, [jogoId]);

  const timesFiltrados = modalidadeId
    ? times.filter((t) => String(t.id_modalidade) === String(modalidadeId))
    : times;

  const objectTime1 = times.find((t) => String(t.id) === String(time1Id));
  const objectTime2 = times.find((t) => String(t.id) === String(time2Id));

  const handleSalvar = async (e) => {
    e.preventDefault();

    if (!jogoId) {
      setErro("Nenhum jogo selecionado para edição.");
      return;
    }
    if (!time1Id || !time2Id) {
      setErro("Selecione ambos os times.");
      return;
    }
    if (time1Id === time2Id) {
      setErro("Os times do confronto precisam ser diferentes.");
      return;
    }

    setLoading(true);
    setErro("");

    const { error } = await supabase
      .from("confronto")
      .update({
        time1: time1Id,
        time2: time2Id,
      })
      .eq("id", jogoId);

    if (error) {
      setLoading(false);
      setErro("Erro ao atualizar o jogo: " + error.message);
      return;
    }

    const { data: detalheExistente, error: erroBuscaDetalhe } = await supabase
      .from("detalhes")
      .select("id")
      .eq("confronto_id", jogoId)
      .maybeSingle();

    if (erroBuscaDetalhe) {
      setLoading(false);
      setErro(
        `Times atualizados, mas houve erro ao consultar o local: ${erroBuscaDetalhe.message}`,
      );
      return;
    }

    const operacaoDetalhe = detalheExistente
      ? supabase
          .from("detalhes")
          .update({ local })
          .eq("id", detalheExistente.id)
      : supabase.from("detalhes").insert({
          confronto_id: jogoId,
          ptn_time1: 0,
          ptn_time2: 0,
          local,
        });

    const { error: erroDetalhe } = await operacaoDetalhe;
    setLoading(false);

    if (erroDetalhe) {
      setErro(
        `Times atualizados, mas não foi possível salvar o local: ${erroDetalhe.message}`,
      );
      return;
    }

    alert("Jogo atualizado com sucesso!");
    navigate("/horarios");
  };

  return (
    <div className="editar-jogo-container">
      <form onSubmit={handleSalvar} className="editar-jogo-form">
        {/* FILTRO DE MODALIDADE */}
        <div className="select-modalidade-wrapper">
          <select
            value={modalidadeId}
            onChange={(e) => {
              setModalidadeId(e.target.value);
              setTime1Id("");
              setTime2Id("");
            }}
            className="select-modalidade-figma"
          >
            <option value="">MODALIDADE</option>
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* LINHA DOS CONFRONTOS */}
        <div className="confronto-row">
          {/* CARD TIME 1 */}
          <div className="card-input-dark">
            <span className="card-input-label">time 1</span>
            <div className="card-input-body">
              <div className="box-logo-preview">
                <BandeiraImg
                  logoURL={objectTime1?.logo_URL}
                  nomeAlt={objectTime1?.Nome}
                />
              </div>
              <select
                value={time1Id}
                onChange={(e) => setTime1Id(e.target.value)}
                className="select-time-pill"
              >
                <option value="">nome do time/turma 1</option>
                {timesFiltrados.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.Nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="vs-text">VS</div>

          {/* CARD TIME 2 */}
          <div className="card-input-dark">
            <span className="card-input-label">time 2</span>
            <div className="card-input-body">
              <div className="box-logo-preview">
                <BandeiraImg
                  logoURL={objectTime2?.logo_URL}
                  nomeAlt={objectTime2?.Nome}
                />
              </div>
              <select
                value={time2Id}
                onChange={(e) => setTime2Id(e.target.value)}
                className="select-time-pill"
              >
                <option value="">nome do time/turma 2</option>
                {timesFiltrados.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.Nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* INPUT DE LOCAL */}
        <div className="local-row">
          <div className="card-input-dark card-local">
            <span className="card-input-label">LOCAL</span>
            <input
              type="text"
              placeholder=""
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="input-local-pill"
            />
          </div>
        </div>

        {erro && <p className="erro-texto">{erro}</p>}

        {/* DIVISOR DE PRÉVIA */}
        <div className="divisor-previa">
          <div className="linha-laranja" />
          <span className="badge-previa">PREVIA</span>
        </div>

        {/* CARD DE PRÉVIA */}
        <div className="previa-container">
          <div className="card-previa">
            <div className="previa-times-row">
              <div className="previa-col-time">
                <div className="box-logo-preview">
                  <BandeiraImg
                    logoURL={objectTime1?.logo_URL}
                    nomeAlt={objectTime1?.Nome}
                  />
                </div>
                <span className="previa-nome-turma">
                  {objectTime1?.Nome || "nome da turma"}
                </span>
              </div>

              <div className="previa-placar">0 : 0</div>

              <div className="previa-col-time">
                <div className="box-logo-preview">
                  <BandeiraImg
                    logoURL={objectTime2?.logo_URL}
                    nomeAlt={objectTime2?.Nome}
                  />
                </div>
                <span className="previa-nome-turma">
                  {objectTime2?.Nome || "nome da turma"}
                </span>
              </div>
            </div>

            <div className="badge-quadra-previa">
              {local ? local.toUpperCase() : "LOCAL"}
            </div>
          </div>
        </div>

        {/* BOTÃO SALVAR */}
        <div className="btn-salvar-wrapper">
          <button type="submit" className="btn-salvar-jogo" disabled={loading}>
            {loading ? "SALVANDO..." : "SALVAR"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarJogo;
