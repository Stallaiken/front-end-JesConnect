import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ajuste o caminho
import "../css/Administrativo.css";

function Administrativo() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const { data, error } = await supabase.rpc("verificar_admin", {
        p_usuario: usuario,
        p_senha: senha,
      });

      if (error) {
        console.error(error);
        setErro("Erro ao tentar fazer login.");
        return;
      }

      if (data === true) {
  localStorage.setItem("isAdmin", "true");
  localStorage.setItem("usuarioLogado", usuario);

  window.dispatchEvent(
    new Event("admin-status-change")
  );

  navigate("/horarios");
} else {
        setErro("Usuário ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao tentar fazer login.");
    } finally {
      setLoading(false);
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

          <button type="submit" className="admin-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Administrativo;