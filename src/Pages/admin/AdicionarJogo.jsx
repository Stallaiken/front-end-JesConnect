import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "../../css/admin/AdicionarJogo.css";

const supabaseUrl = "https://hneubqtpksfndtmfwgzi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZXVicXRwa3NmbmR0bWZ3Z3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzg5NDcsImV4cCI6MjEwMjkxNDk0N30.PWQpqBc0Lxfg05-wN3B4jrLtaJnXxjdW-4Wu3ugJ49I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function AdicionarConfronto() {
  const navigate = useNavigate();

  const [times, setTimes] = useState([]);
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [modalidadeId, setModalidadeId] = useState("");
  const [modalidades, setModalidades] = useState([]);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      const { data: modData, error: modError } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (modError) {
        console.error(modError);
        setErro("Erro ao carregar modalidades.");
        return;
      }

      setModalidades(modData || []);

      const { data: timeData, error: timeError } = await supabase
        .from("time")
        .select("id, Nome, id_modalidade")
        .order("Nome");

      if (timeError) {
        console.error(timeError);
        setErro("Erro ao carregar times.");
        return;
      }

      setTimes(timeData || []);
    };

    carregarDados();
  }, []);

  const handleSalvarConfronto = async (e) => {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (!time1 || !time2 || !modalidadeId) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (time1 === time2) {
      setErro("O time 1 não pode ser igual ao time 2.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("confronto").insert({
        time1: time1,
        time2: time2,
        finalizado: false,
      });

      if (error) throw error;

      setSucesso("Confronto adicionado com sucesso!");
      setTimeout(() => {
        navigate("/horarios");
      }, 1500);
    } catch (err) {
      console.error(err);
      setErro("Erro ao salvar o confronto.");
    } finally {
      setLoading(false);
    }
  };

  const timesFiltrados = times.filter(
    (time) =>
      !modalidadeId || String(time.id_modalidade) === String(modalidadeId)
  );

  return (
    <div className="add-jogo-page">
      <div className="add-jogo-container">
        <div className="add-jogo-header">
          <h2 className="add-jogo-titulo">Novo Confronto</h2>

          <button
            type="button"
            className="btn-fechar"
            onClick={() => navigate(-1)}
            title="Fechar"
          >
            ✕
          </button>
        </div>

        {/* MODALIDADE */}
        <div className="input-card">
          <label>MODALIDADE</label>

          <select
            value={modalidadeId}
            onChange={(e) => {
              setModalidadeId(e.target.value);
              setTime1("");
              setTime2("");
              setErro("");
              setSucesso("");
            }}
          >
            <option value="">Selecione a modalidade...</option>

            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
                {m.genero && m.genero !== "Not" ? ` (${m.genero})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* TIME 1 */}
        <div className="input-card">
          <label>TIME 1</label>

          <select
            value={time1}
            onChange={(e) => {
              setTime1(e.target.value);
              setErro("");
            }}
            disabled={!modalidadeId}
          >
            <option value="">Selecione o Time 1</option>

            {timesFiltrados.map((time) => (
              <option key={time.id} value={time.id}>
                {time.Nome}
              </option>
            ))}
          </select>
        </div>

        {/* TIME 2 */}
        <div className="input-card">
          <label>TIME 2</label>

          <select
            value={time2}
            onChange={(e) => {
              setTime2(e.target.value);
              setErro("");
            }}
            disabled={!modalidadeId}
          >
            <option value="">Selecione o Time 2</option>

            {timesFiltrados
              .filter((time) => String(time.id) !== String(time1))
              .map((time) => (
                <option key={time.id} value={time.id}>
                  {time.Nome}
                </option>
              ))}
          </select>
        </div>

        {erro && <p className="error-msg">{erro}</p>}
        {sucesso && <p className="success-msg">{sucesso}</p>}

        <button
          type="button"
          onClick={handleSalvarConfronto}
          disabled={loading}
          className="btn-salvar-principal"
        >
          {loading ? "Salvando..." : "Salvar Confronto"}
        </button>
      </div>
    </div>
  );
}

export default AdicionarConfronto;