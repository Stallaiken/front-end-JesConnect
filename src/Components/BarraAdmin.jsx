import "../css/BarraAdmin.css";

function BarraAdmin() {
  return (
    <div className="admin-painel-bar">
      {/* GERENCIADOR DE PARTIDAS */}
      <div className="admin-secao-grupo">
        <h4 className="admin-secao-titulo">GERENCIADOR DE PARTIDAS</h4>
        <div className="admin-botoes-container">
          <button type="button" className="admin-btn-acao">CRIAR PARTIDA</button>
          <button type="button" className="admin-btn-acao">EDITAR PARTIDA</button>
          <button type="button" className="admin-btn-acao">DELETAR PARTIDA</button>
          <button type="button" className="admin-btn-acao">COMEÇAR</button>
          <button type="button" className="admin-btn-acao">FINALIZAR</button>
        </div>
      </div>

      {/* GERENCIADOR DE TIMES */}
      <div className="admin-secao-grupo">
        <h4 className="admin-secao-titulo">GERENCIADOR DE TIMES</h4>
        <div className="admin-botoes-container">
          <button type="button" className="admin-btn-acao">CRIAR TIME</button>
          <button type="button" className="admin-btn-acao">DELETAR TIME</button>
          <button type="button" className="admin-btn-acao">EDITAR TIME</button>
        </div>
      </div>

      {/* GERENCIADOR DE RANKING */}
      <div className="admin-secao-grupo">
        <h4 className="admin-secao-titulo">GERENCIADOR DE RANKING</h4>
        <div className="admin-botoes-container">
          <button type="button" className="admin-btn-acao">EDITAR PONTOS</button>
        </div>
      </div>
    </div>
  );
}

export default BarraAdmin;