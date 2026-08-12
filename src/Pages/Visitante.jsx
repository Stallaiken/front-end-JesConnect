import {useNavigate} from 'react-router-dom';
import "../css/Visitante.css"

function Visitante() {
  const navigate = useNavigate();
  return (
    <div>
      <h5>Modalidades</h5>
      <nav className='Modalidades'>

       <ul>
        <img src="" alt="" />
         <button>Futebol</button>
       </ul>
          
        <ul>

          <img src="" alt="" />
          <button>Volei</button>

        </ul>

        <ul>

          <img src="" alt="" />
          <button>Queimado</button>

        </ul>
      </nav>
     
      <h1>Visitante</h1>
      <p>Bem-vindo ao nosso site!</p>

      <button onClick={() => navigate(-1)}>Voltar</button>

      
    </div>
  )
}
export default Visitante;