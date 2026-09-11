import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Administrativo.css";

function Administrativo() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setErro("");

    const usuarioLimpo = usuario.trim();

    // Validação direta das credenciais e salvamento no localStorage
    if (usuarioLimpo === "admin" && senha === "minhasenha123") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("usuarioLogado", usuarioLimpo);

      // Notifica os demais componentes (Menu.jsx, etc) sobre a mudança de status
      window.dispatchEvent(new Event("admin-status-change"));

      navigate("/Horarios");
    } else {
      setErro("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-titulo-container">
        <h1 className="admin-titulo">ADMINISTRATIVO</h1>
      </div>

      <div className="admin-card">
        <h2 className="admin-subtitulo">Login</h2>

        <form className="admin-form" onSubmit={handleLogin}>
          {erro && <p className="admin-erro">{erro}</p>}

          <div className="input-group">
            <input
              type="text"
              className="admin-input"
              placeholder="Usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={mostrarSenha ? "text" : "password"}
              className="admin-input"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setMostrarSenha((prev) => !prev)}
            >
              {mostrarSenha ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <button type="submit" className="admin-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Administrativo;