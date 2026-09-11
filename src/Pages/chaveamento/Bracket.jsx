import Match from "./Match";

function Bracket({
  jogos,
  onMoverTime,
  onAlterarAoVivo,
  onRegistrarVencedor,
}) {
  const fases = [];

  jogos.forEach((jogo) => {
    if (!fases.includes(jogo.fase)) {
      fases.push(jogo.fase);
    }
  });

  const ordemFases = [
    "32-avos de final",
    "16-avos de final",
    "Oitavas de final",
    "Quartas de final",
    "Semifinal",
    "Final",
  ];

  fases.sort((a, b) => {
    const posA =
      ordemFases.indexOf(a);

    const posB =
      ordemFases.indexOf(b);

    /*
      Caso exista uma fase diferente
      da lista, ela fica no final.
    */
    return (
      (posA === -1
        ? 999
        : posA) -
      (posB === -1
        ? 999
        : posB)
    );
  });

  return (
    <div className="bracket">
      {fases.map((fase) => {
        const jogosDaFase =
          jogos
            .filter(
              (jogo) =>
                jogo.fase === fase
            )
            .sort(
              (a, b) =>
                (a.ordem || 0) -
                (b.ordem || 0)
            );

        return (
          <div
            className="fase"
            key={fase}
          >
            <h2>{fase}</h2>

            <div className="jogos-fase">
              {jogosDaFase.map(
                (jogo) => (
                  <Match
                    key={jogo.id}
                    jogo={jogo}
                    onMoverTime={
                      onMoverTime
                    }
                    onAlterarAoVivo={
                      onAlterarAoVivo
                    }
                    onRegistrarVencedor={
                      onRegistrarVencedor
                    }
                  />
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Bracket;