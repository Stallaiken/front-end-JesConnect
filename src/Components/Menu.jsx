import { Link } from "react-router-dom";
import "../css/Menu.css";
import { useState } from "react";
import MenuFilho from "../Components/MenuFilho.jsx";

function Menu({ aoAbrir }) {
  return (
    <div className="menu">
      <div className="icone-mais-opcoes">
        <button 
          className="btn-mais-opcoes" 
          onClick={() => {
            aoAbrir(prev => !prev);
          }}
        >
          <div className="tres-tracinhos"></div>
        </button>
      </div>
    </div>
  );
}

export default Menu;
