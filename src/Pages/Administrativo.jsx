import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Administrativo.css";

function Administrativo() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const statusAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(statusAdmin);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setErro("");

    const usuarioLimpo = usuario.trim();

    if (usuarioLimpo === "admin" && senha === "minhasenha123") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("usuarioLogado", usuarioLimpo);

      // Dispara o evento para atualizar o Menu.jsx instantaneamente
      window.dispatchEvent(new Event("admin-status-change"));

      navigate("/Horarios");
    } else {
      setErro("Usuário ou senha incorretos.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("usuarioLogado");
    setIsAdmin(false);

    window.dispatchEvent(new Event("admin-status-change"));
  };

  return (
    <div className="admin-page">
      <div className="admin-titulo-container">
        <h1 className="admin-titulo">ADMINISTRATIVO</h1>
      </div>

      <div className="admin-card">
        {isAdmin ? (
          <div style={{ textAlign: "center" }}>
            <h2 className="admin-subtitulo">Sessão Ativa</h2>
            <p style={{ color: "#aaa", marginBottom: "20px" }}>
              Você está autenticado como administrador.
            </p>
            <button
              type="button"
              className="admin-button"
              onClick={handleLogout}
              style={{ backgroundColor: "#d9534f" }}
            >
              Sair do Painel
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Administrativo;