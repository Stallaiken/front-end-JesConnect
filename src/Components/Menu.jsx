import {Link} from "react-router-dom";
import "../css/Menu.css"
import { useState } from "react";
import MenuFilho from "../Components/MenuFilho.jsx"


function Menu() {
 const [MenuAberto, setMenuAberto] = useState(false)

  return (
    <div className="menu">
      
      <div className="icone-mais-opcoes">
        <button className="btn-mais-opcoes" onClick={()=>{

        }}>
           <span className="texto-menu-jogos">☰</span>
        </button>
      </div>
    </div>
  );
} 
export default Menu;