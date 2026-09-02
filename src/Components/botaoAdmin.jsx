import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BotaoAdmin() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
      {aberto && (
        <div style={{ position: "absolute", bottom: "60px", right: "0", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#000", padding: "12px", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", width: "190px" }}>
          <button onClick={() => navigate("/adicionar-time")} style={estiloBotaoMenu}>🛡️ Adicionar Time</button>
          <button onClick={() => navigate("/adicionar-confronto")} style={estiloBotaoMenu}>⚽ Adicionar Jogo</button>
          <button onClick={() => navigate("/editar-time")} style={estiloBotaoMenu}>✏️ Editar Time</button>
          <button onClick={() => navigate("/finalizar")} style={estiloBotaoMenu}>🏁 Finalizar Partida</button>
        </div>
      )}

      <button onClick={() => setAberto(!aberto)} style={{ backgroundColor: "#1b52e0", color: "#fff", border: "none", borderRadius: "50%", width: "56px", height: "56px", fontSize: "1.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(27, 82, 224, 0.4)" }}>
        {aberto ? "✕" : "+"}
      </button>
    </div>
  );
}

const estiloBotaoMenu = {
  background: "transparent",
  color: "#fff",
  border: "none",
  padding: "10px",
  textAlign: "left",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "0.9rem",
  transition: "background 0.2s"
};

export default BotaoAdmin;