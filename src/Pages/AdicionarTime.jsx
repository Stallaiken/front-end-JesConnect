import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/AdicionarJogo.css";

// ======================================================
// CARREGA AUTOMATICAMENTE TODAS AS BANDEIRAS DA PASTA
// ======================================================

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  {
    eager: true,
  }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path
    .split("/")
    .pop()
    .split(".")[0];

  BANDEIRAS[fileName] =
    bandeirasModules[path].default;
}

function AdicionarTime() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [modalidadeId, setModalidadeId] = useState("");
  const [bandeira, setBandeira] = useState("");

  const [modalidades, setModalidades] = useState([]);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // ======================================================
  // CARREGAR MODALIDADES
  // ======================================================

  useEffect(() => {
    const carregarModalidades = async () => {
      const { data, error } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (error) {
        console.error(error);
        setErro("Erro ao carregar modalidades.");
        return;
      }

      setModalidades(data || []);
    };

    carregarModalidades();
  }, []);

  // ======================================================
  // SALVAR TIME
  // ======================================================

  const handleSalvar = async (e) => {
    e.preventDefault();

    setErro("");
    setSucesso(false);

    if (!nome.trim()) {
      setErro("Digite o nome do time.");
      return;
    }

    if (!modalidadeId) {
      setErro("Selecione a modalidade.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("time")
        .insert({
          Nome: nome.trim(),
          id_modalidade: modalidadeId,

          // Pode ser NULL caso nenhuma bandeira
          // seja escolhida.
          logo_URL: bandeira || null,
        });

      if (error) {
        throw error;
      }

      setSucesso(true);

      setTimeout(() => {
        navigate("/Horarios");
      }, 1000);

    } catch (err) {
      console.error(err);

      if (err.code === "23505") {
        setErro("Esse nome de time já existe.");
      } else {
        setErro("Erro ao salvar o time.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-jogo-page">
      <div
        className="add-jogo-container"
        style={{ maxWidth: "520px" }}
      >

        {/* CABEÇALHO */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.4rem",
            }}
          >
            Novo Time
          </h2>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* ==================================================
            PRÉVIA
        ================================================== */}

        <div
          style={{
            background: "#f8fafc",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "28px",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "44px",
              borderRadius: "8px",
              overflow: "hidden",
              background: "#e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {bandeira &&
              BANDEIRAS[bandeira] && (
                <img
                  src={BANDEIRAS[bandeira]}
                  alt="Bandeira selecionada"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
          </div>

          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.1rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {nome || "Nome do Time"}
            </div>

            <div
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                marginTop: "2px",
              }}
            >
              {modalidades.find(
                (m) => m.id === modalidadeId
              )?.nome || "Modalidade"}
            </div>
          </div>
        </div>

        {/* ==================================================
            NOME
        ================================================== */}

        <div
          className="input-card config-card"
          style={{ marginBottom: "16px" }}
        >
          <label>NOME DO TIME</label>

          <input
            type="text"
            placeholder="Ex: Colégio Santa Mônica"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={40}
          />
        </div>

        {/* ==================================================
            MODALIDADE
        ================================================== */}

        <div
          className="input-card config-card"
          style={{ marginBottom: "24px" }}
        >
          <label>MODALIDADE</label>

          <select
            value={modalidadeId}
            onChange={(e) =>
              setModalidadeId(e.target.value)
            }
          >
            <option value="">
              Selecione...
            </option>

            {modalidades.map((mod) => (
              <option
                key={mod.id}
                value={mod.id}
              >
                {mod.nome}

                {mod.genero &&
                mod.genero !== "Not"
                  ? ` (${mod.genero})`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* ==================================================
            BANDEIRAS
        ================================================== */}

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            SELECIONE A BANDEIRA
          </label>

          <p
            style={{
              fontSize: "0.8rem",
              color: "#64748b",
              marginBottom: "12px",
            }}
          >
            Clique em uma das bandeiras abaixo.
            Não é necessário digitar o nome do arquivo.
          </p>

          {/* OPÇÃO SEM BANDEIRA */}

          <button
            type="button"
            onClick={() => setBandeira("")}
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "10px",
              borderRadius: "10px",
              border:
                bandeira === ""
                  ? "2px solid #2563eb"
                  : "2px solid #e2e8f0",
              background:
                bandeira === ""
                  ? "#eff6ff"
                  : "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sem bandeira
          </button>

          {/* TODAS AS BANDEIRAS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(76px, 1fr))",
              gap: "10px",
              maxHeight: "260px",
              overflowY: "auto",
              padding: "4px",
            }}
          >
            {Object.entries(BANDEIRAS).map(
              ([key, src]) => {
                const selecionada =
                  bandeira === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setBandeira(key)
                    }
                    title={key}
                    style={{
                      border: selecionada
                        ? "3px solid #2563eb"
                        : "2px solid #e2e8f0",

                      borderRadius: "12px",

                      padding: "8px",

                      background:
                        selecionada
                          ? "#eff6ff"
                          : "white",

                      cursor: "pointer",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      minHeight: "50px",
                    }}
                  >
                    <img
                      src={src}
                      alt={key}
                      style={{
                        width: "52px",
                        height: "34px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* ==================================================
            MENSAGENS
        ================================================== */}

        {erro && (
          <p
            style={{
              color: "#dc2626",
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            {erro}
          </p>
        )}

        {sucesso && (
          <p
            style={{
              color: "#16a34a",
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            Time cadastrado com sucesso!
          </p>
        )}

        {/* ==================================================
            SALVAR
        ================================================== */}

        <button
          type="button"
          onClick={handleSalvar}
          disabled={loading}
          className="btn-salvar-principal"
          style={{
            width: "100%",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? "Salvando..."
            : "Salvar Time"}
        </button>
      </div>
    </div>
  );
}

export default AdicionarTime;