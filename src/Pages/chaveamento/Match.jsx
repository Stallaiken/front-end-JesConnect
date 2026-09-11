const bandeirasModules = import.meta.glob(
  "../../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];

  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Match({ jogo, onMoverTime, onAlterarAoVivo, onRegistrarVencedor }) {
  /*
    Quando começa a arrastar um time.
  */
  function iniciarArraste(event, lado) {
    if (!jogo[lado]) {
      return;
    }

    event.dataTransfer.setData("confrontoId", jogo.id);

    event.dataTransfer.setData("lado", lado);
  }

  /*
    Permite soltar.
  */
  function permitirSoltar(event) {
    event.preventDefault();
  }

  /*
    Quando um time é solto em outro espaço.
  */
  function soltarTime(event, ladoDestino) {
    event.preventDefault();

    const origemId = event.dataTransfer.getData("confrontoId");

    const origemLado = event.dataTransfer.getData("lado");

    if (!origemId || !origemLado) {
      return;
    }

    onMoverTime(origemId, origemLado, jogo.id, ladoDestino);
  }

  /*
    Mostra a bandeira.
  */
  function renderBandeira(logoURL, nomeAlt) {
    if (!logoURL) {
      return <div className="logo-vazia">?</div>;
    }

    const imgUrl = BANDEIRAS[logoURL] || logoURL;

    return (
      <img src={imgUrl} alt={nomeAlt || "Bandeira"} className="logo-time" />
    );
  }

  const time1 = jogo.time1;

  const time2 = jogo.time2;

  const finalizado = jogo.finalizado === true;

  const aoVivo = jogo.ao_vivo === true;

  const vencedor = jogo.detalhes?.vencedor;

  return (
    <div
      className={`match ${finalizado ? "match-finalizado" : ""} ${
        aoVivo ? "match-ao-vivo" : ""
      }`}
    >
      <div className="match-status">
        {aoVivo ? (
          <span>🔴 AO VIVO</span>
        ) : finalizado ? (
          <span>FINALIZADO</span>
        ) : (
          <span>EM BREVE</span>
        )}
      </div>

      {/* TIME 1 */}
      <div
        className={`time ${vencedor === time1?.id ? "time-vencedor" : ""}`}
        draggable={!finalizado && !!time1}
        onDragStart={(event) => iniciarArraste(event, "time1")}
        onDragOver={permitirSoltar}
        onDrop={(event) => soltarTime(event, "time1")}
      >
        {renderBandeira(time1?.logo_URL, time1?.Nome)}

        <span>{time1?.Nome || "A definir"}</span>

        {vencedor === time1?.id && <strong>✓</strong>}
      </div>

      <div className="vs">VS</div>

      {/* TIME 2 */}
      <div
        className={`time ${vencedor === time2?.id ? "time-vencedor" : ""}`}
        draggable={!finalizado && !!time2}
        onDragStart={(event) => iniciarArraste(event, "time2")}
        onDragOver={permitirSoltar}
        onDrop={(event) => soltarTime(event, "time2")}
      >
        {renderBandeira(time2?.logo_URL, time2?.Nome)}

        <span>{time2?.Nome || "A definir"}</span>

        {vencedor === time2?.id && <strong>✓</strong>}
      </div>

      {/* CONTROLES */}
      {!finalizado && (
        <div className="match-acoes">
          {time1 && time2 && (
            <>
              <button
                type="button"
                onClick={() => onRegistrarVencedor(jogo, time1.id)}
              >
                {time1.Nome} venceu
              </button>

              <button
                type="button"
                onClick={() => onRegistrarVencedor(jogo, time2.id)}
              >
                {time2.Nome} venceu
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => onAlterarAoVivo(jogo.id, !aoVivo)}
          >
            {aoVivo ? "Encerrar ao vivo" : "Colocar ao vivo"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Match;
