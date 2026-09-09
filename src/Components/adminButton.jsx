import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AdminButton({ isAdmin = true }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Converte a rota atual para minúsculas para evitar problemas com /Horarios ou /horarios
  const rotaAtual = location.pathname.toLowerCase().replace(/\/$/, "") || "/";

  // Rotas onde o botão DEVE aparecer
  const paginasPermitidas = ["/horarios", "/historico"];

  // Se não for admin ou não estiver em Horários/Histórico, ignora a renderização
  if (!isAdmin || !paginasPermitidas.includes(rotaAtual)) {
    return null;
  }

  const fecharENavegar = (rota) => {
    setMenuAberto(false);
    navigate(rota);
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000 }}>
      {menuAberto && (
        <div
          style={{
            position: "absolute",
            bottom: "72px",
            right: "0",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minWidth: "190px",
          }}
        >
          <button
            type="button"
            onClick={() => fecharENavegar("/adicionar-time")}
            style={btnMenuEstilo}
          >
             Adicionar Time
          </button>

          <button
            type="button"
            onClick={() => fecharENavegar("/editar-time")}
            style={btnMenuEstilo}
          >
             Editar Time
          </button>

          <button
            type="button"
            onClick={() => fecharENavegar("/adicionar-jogo")}
            style={btnMenuEstilo}
          >
             Adicionar Confronto
          </button>

          <button
            type="button"
            onClick={() => {
              setMenuAberto(false);
              alert("Para finalizar, clique diretamente no card da partida desejada.");
            }}
            style={btnMenuEstilo}
          >
             Finalizar Partida
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setMenuAberto((prev) => !prev)}
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#1b52e0",
          color: "#ffffff",
          fontSize: "26px",
          fontWeight: "bold",
          border: "none",
          boxShadow: "0 6px 18px rgba(27, 82, 224, 0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {menuAberto ? "✕" : "+"}
      </button>
    </div>
  );
}

const btnMenuEstilo = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.88rem",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  whiteSpace: "nowrap",
};

export default AdminButton;