import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Administrativo.css";
import { MOCK_USUARIOS_ADMIN } from "../utils/mockAdministradores"; 

function Administrativo() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const usuarioValido = MOCK_USUARIOS_ADMIN.find(
      (u) => u.nome === usuario && u.senha === senha
    );

    if (usuarioValido) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("usuarioLogado", usuarioValido.nome);
      setErro("");
      navigate("/horarios"); 
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
              type="password" 
              className="admin-input" 
              placeholder="Senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required 
            />
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