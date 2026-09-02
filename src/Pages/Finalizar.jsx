import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { supabase } from "../supabaseClient";
import "../css/Finalizar.css";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  {
    eager: true,
  },
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];

  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Finalizar() {
  const navigate = useNavigate();
  const location = useLocation();

  const jogo = location.state?.jogo;

  const [gols1, setGols1] = useState(0);

  const [gols2, setGols2] = useState(0);

  const [amarelos1, setAmarelos1] = useState(0);

  const [amarelos2, setAmarelos2] = useState(0);

  const [vermelhos1, setVermelhos1] = useState(0);

  const [vermelhos2, setVermelhos2] = useState(0);

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  if (!jogo) {
    return (
      <div className="finalizar-page">
        <p>Nenhum jogo selecionado.</p>

        <button
          className="btn-editar-estatisticas"
          onClick={() => navigate("/Horarios")}
        >
          Voltar para Horários
        </button>
      </div>
    );
  }

  const time1 = jogo.time1 || {};

  const time2 = jogo.time2 || {};

  const getBandeira = (logoURL) => {
    if (!logoURL) return null;

    return BANDEIRAS[logoURL] || null;
  };

  const alterarValor = (setter, delta) => {
    setter((valor) => Math.max(0, Number(valor) + delta));
  };

  const handleFinalizarJogo = async () => {
    setLoading(true);
    setErro("");

    try {
      const pontuacao = [
        Number(gols1),
        Number(gols2),
        Number(amarelos1),
        Number(amarelos2),
        Number(vermelhos1),
        Number(vermelhos2),
      ];

      const { data: detalheExistente, error: erroBusca } = await supabase
        .from("detalhes")
        .select("id")
        .eq("confronto_id", jogo.id)
        .maybeSingle();

      if (erroBusca) {
        throw erroBusca;
      }

      if (detalheExistente) {
        const { error } = await supabase
          .from("detalhes")
          .update({
            pontuacao,
          })
          .eq("confronto_id", jogo.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from("detalhes").insert({
          confronto_id: jogo.id,
          pontuacao,
        });

        if (error) {
          throw error;
        }
      }

      // ================================================
      // FINALIZA O CONFRONTO
      // ================================================

      const { error: erroConfronto } = await supabase
        .from("confronto")
        .update({
          finalizado: true,
        })
        .eq("id", jogo.id);

      if (erroConfronto) {
        throw erroConfronto;
      }

      navigate("/Historico");
    } catch (err) {
      console.error("Erro ao finalizar:", err);

      setErro("Erro ao salvar os dados da partida.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finalizar-page">
      <div className="finalizar-container">
        <button
          className="btn-fechar-finalizar"
          onClick={() => navigate("/Horarios")}
        >
          ✕
        </button>

        <h2 className="titulo-finalizar">FINALIZAR PARTIDA</h2>

        {/* TIMES */}

        <div className="card-finalizar">
          <div className="card-finalizar-header">
            <span className="modalidade-finalizar">
              {time1.modalidade?.nome || "MODALIDADE"}
            </span>

            <div className="status-pill-finalizar">EM ANDAMENTO</div>
          </div>

          <div className="times-finalizar-wrapper">
            {/* TIME 1 */}

            <div className="time-finalizar-item">
              <div className="bandeira-box-finalizar">
                {getBandeira(time1.logo_URL) && (
                  <img
                    src={getBandeira(time1.logo_URL)}
                    alt={time1.Nome}
                    className="bandeira-img-finalizar"
                  />
                )}
              </div>

              <span className="label-time-finalizar">
                {time1.Nome || "Time 1"}
              </span>
            </div>

            {/* TIME 2 */}

            <div className="time-finalizar-item">
              <div className="bandeira-box-finalizar">
                {getBandeira(time2.logo_URL) && (
                  <img
                    src={getBandeira(time2.logo_URL)}
                    alt={time2.Nome}
                    className="bandeira-img-finalizar"
                  />
                )}
              </div>

              <span className="label-time-finalizar">
                {time2.Nome || "Time 2"}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================
            GOLS
        ================================================== */}

        <h3>Gols</h3>

        <div className="placar-box">
          {gols1} X {gols2}
        </div>

        <div className="controles-placar-container">
          <div className="grupo-botoes-placar">
            <button
              className="btn-placar"
              onClick={() => alterarValor(setGols1, 1)}
            >
              +
            </button>

            <button
              className="btn-placar"
              onClick={() => alterarValor(setGols1, -1)}
            >
              -
            </button>
          </div>

          <div className="grupo-botoes-placar">
            <button
              className="btn-placar"
              onClick={() => alterarValor(setGols2, 1)}
            >
              +
            </button>

            <button
              className="btn-placar"
              onClick={() => alterarValor(setGols2, -1)}
            >
              -
            </button>
          </div>
        </div>

        {/* ==================================================
            CARTÕES
        ================================================== */}

        <h3>Cartões Amarelos</h3>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <p>{time1.Nome}</p>

            <button onClick={() => alterarValor(setAmarelos1, 1)}>+</button>

            <strong
              style={{
                margin: "0 15px",
              }}
            >
              {amarelos1}
            </strong>

            <button onClick={() => alterarValor(setAmarelos1, -1)}>-</button>
          </div>

          <div>
            <p>{time2.Nome}</p>

            <button onClick={() => alterarValor(setAmarelos2, 1)}>+</button>

            <strong
              style={{
                margin: "0 15px",
              }}
            >
              {amarelos2}
            </strong>

            <button onClick={() => alterarValor(setAmarelos2, -1)}>-</button>
          </div>
        </div>

        <h3>Cartões Vermelhos</h3>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <p>{time1.Nome}</p>

            <button onClick={() => alterarValor(setVermelhos1, 1)}>+</button>

            <strong
              style={{
                margin: "0 15px",
              }}
            >
              {vermelhos1}
            </strong>

            <button onClick={() => alterarValor(setVermelhos1, -1)}>-</button>
          </div>

          <div>
            <p>{time2.Nome}</p>

            <button onClick={() => alterarValor(setVermelhos2, 1)}>+</button>

            <strong
              style={{
                margin: "0 15px",
              }}
            >
              {vermelhos2}
            </strong>

            <button onClick={() => alterarValor(setVermelhos2, -1)}>-</button>
          </div>
        </div>

        {erro && (
          <p
            style={{
              color: "red",
              textAlign: "center",
            }}
          >
            {erro}
          </p>
        )}

        <button
          className="btn-editar-estatisticas"
          onClick={handleFinalizarJogo}
          disabled={loading}
        >
          {loading ? "SALVANDO..." : "FINALIZAR E SALVAR"}
        </button>
      </div>
    </div>
  );
}

export default Finalizar;
