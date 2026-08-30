import { useNavigate } from "react-router-dom";
import "../css/Administrativo.css";

function Administrativo() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="admin-page">
      <div className="admin-titulo-container">
        <h1 className="admin-titulo">ADMINISTRATIVO</h1>
      </div>

      <div className="admin-card">
        <h2 className="admin-subtitulo">Login</h2>

        <form className="admin-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Usuário" 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              className="admin-input" 
              placeholder="Senha" 
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