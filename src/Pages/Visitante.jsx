import "../css/Visitante.css";
import Sesi_Logo from "../assets/Sesi logo nova.png"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Visitante() {
   const navigate = useNavigate();

   useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/horarios"); 
    }, 2000); 

    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container-visitante"> 
      <div className="container-logo">
       <img className="logo-sesi" src={Sesi_Logo} alt="" />
        <p className="sublogo-jes">JES CONNECT</p>
      </div>
    </div>
  );
}

export default Visitante;