import "../css/Home.css";
import { Navigate, useNavigate } from "react-router-dom";



function Home() {
  const navigate = useNavigate()
  return (
    <div className="home">
      <img src="https://www.sesisp.org.br/wp-content/uploads/2021/06/logo-sesi.png" alt="Logo SeSi" />
      <h1>Jogos Esportivos SESI</h1>
      <p>Bem-vindo ao nosso site!</p>
      
      <button onClick={()=> useNavigate()}>Visitante</button>
      <br />
      <button onClick={()=> useNavigate()}>administrativo</button>
      
    </div>
  )
}
export default Home;