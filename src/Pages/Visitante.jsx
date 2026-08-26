import "../css/Visitante.css";
import Sesi_Logo from "../assets/Sesi logo nova.png"
function Visitante() {
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
