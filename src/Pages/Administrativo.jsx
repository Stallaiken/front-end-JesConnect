import { useNavigate } from "react-router-dom";
import "../css/Administrativo.css";

function Administrativo() {

  const navigate = useNavigate();
  return (
    <div className="page-container">
     
     

     <main className="content">
    <h1><strong>ADMINISTRATIVO</strong></h1>

      <p>Login</p>
      <input type="text" placeholder="Usuário" />
      <br />
      <input type="password" placeholder="Senha" />
      <br />
      <button>Entrar</button>

     </main> 
    </div>
  )
}
export default Administrativo;