
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../css/Chaveamento.css";

function Chaveamento() {
  const [modalidades, setModalidades] = useState([]);
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState("");

  const [genero, setGenero] = useState("M");

  const [times, setTimes] = useState([]);
  const [jogos, setJogos] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarModalidades = async () => {
      const { data, error } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (error) {
        console.error(error);
        return;
      }

      setModalidades(data || []);

      if (data && data.length > 0) {
        setModalidadeSelecionada(data[0].id);
      }
    };

    carregarModalidades();
  }, []);

  useEffect(() => {
    if (!modalidadeSelecionada) return;

    const carregarChave = async () => {
      setLoading(true);

      try {
        /*
         * Busca todos os times da modalidade.
         */
        const { data: timesData, error: erroTimes } =
          await supabase
            .from("time")
            .select(`
              id,
              Nome,
              logo_URL,
              id_modalidade,
              modalidade:id_modalidade(
                id,
                nome,
                genero
              )
            `)
            .eq("id_modalidade", modalidadeSelecionada)
            .order("Nome");

        if (erroTimes) throw erroTimes;

        /*
         * Para modalidades que possuem gênero,
         * filtramos masculino/feminino.
         */
        const modalidade = modalidades.find(
          (m) => m.id === modalidadeSelecionada
        );

        let timesFiltrados = timesData || [];

        if (
          modalidade &&
          modalidade.genero &&
          modalidade.genero !== "Not"
        ) {
          timesFiltrados = timesFiltrados.filter(
            (time) =>
              time.modalidade?.genero === genero
          );
        }

        setTimes(timesFiltrados);

        /*
         * Jogos finalizados.
         */
        const { data: jogosData, error: erroJogos } =
          await supabase
            .from("confronto")
            .select(`
              id,
              time1,
              time2,
              finalizado,
              horario
            `)
            .eq("finalizado", true);

        if (erroJogos) throw erroJogos;

        /*
         * Detalhes guardam:
         *
         * [gols1, gols2,
         *  amarelos1, amarelos2,
         *  vermelhos1, vermelhos2]
         */
        const { data: detalhesData, error: erroDetalhes } =
          await supabase
            .from("detalhes")
            .select(`
              confronto_id,
              pontuacao
            `);

        if (erroDetalhes) throw erroDetalhes;

        const jogosComDetalhes = (jogosData || [])
          .map((jogo) => {
            const detalhe = detalhesData?.find(
              (d) =>
                d.confronto_id === jogo.id
            );

            if (!detalhe) return null;

            return {
              ...jogo,
              pontuacao: detalhe.pontuacao || [],
            };
          })
          .filter(Boolean);

        setJogos(jogosComDetalhes);
      } catch (erro) {
        console.error(
          "Erro ao carregar chaveamento:",
          erro
        );
      } finally {
        setLoading(false);
      }
    };

    carregarChave();
  }, [
    modalidadeSelecionada,
    genero,
    modalidades
  ]);

  /*
   * Descobre a próxima potência de 2.
   *
   * Exemplo:
   *
   * 2 -> 2
   * 3 -> 4
   * 5 -> 8
   * 8 -> 8
   * 10 -> 16
   */
  const proximaPotenciaDeDois = (quantidade) => {
    if (quantidade <= 1) return 2;

    let resultado = 2;

    while (resultado < quantidade) {
      resultado *= 2;
    }

    return resultado;
  };

  /*
   * Quantidade de rodadas.
   */
  const quantidadeRodadas = (quantidade) => {
    const total = proximaPotenciaDeDois(
      quantidade
    );

    return Math.log2(total);
  };

  /*
   * Nome da fase.
   */
  const nomeFase = (rodada, totalRodadas) => {
    const numeroJogos = Math.pow(
      2,
      totalRodadas - rodada
    );

    if (numeroJogos === 1) return "FINAL";
    if (numeroJogos === 2) return "SEMIFINAIS";
    if (numeroJogos === 4) return "QUARTAS DE FINAL";
    if (numeroJogos === 8) return "OITAVAS DE FINAL";

    return `FASE DE ${numeroJogos}`;
  };

  /*
   * Descobre vencedor de um confronto finalizado.
   */
  const descobrirVencedor = (jogo) => {
    if (!jogo?.pontuacao) return null;

    const gols1 = Number(
      jogo.pontuacao[0] || 0
    );

    const gols2 = Number(
      jogo.pontuacao[1] || 0
    );

    if (gols1 === gols2) {
      return null;
    }

    return gols1 > gols2
      ? jogo.time1
      : jogo.time2;
  };

  /*
   * Cria a primeira rodada automaticamente
   * usando os times cadastrados.
   */
  const criarPrimeiraRodada = () => {
    const quantidade = proximaPotenciaDeDois(
      times.length
    );

    const lista = [...times];

    /*
     * Completa espaços vazios.
     */
    while (lista.length < quantidade) {
      lista.push(null);
    }

    const partidas = [];

    for (
      let i = 0;
      i < lista.length;
      i += 2
    ) {
      partidas.push({
        time1: lista[i],
        time2: lista[i + 1],
      });
    }

    return partidas;
  };

  /*
   * Procura se existe um confronto real entre
   * dois times da chave.
   */
  const procurarJogo = (time1, time2) => {
    if (!time1 || !time2) return null;

    return jogos.find((jogo) => {
      return (
        (jogo.time1 === time1.id &&
          jogo.time2 === time2.id) ||
        (jogo.time1 === time2.id &&
          jogo.time2 === time1.id)
      );
    });
  };

  const primeiraRodada = criarPrimeiraRodada();

  const totalRodadas =
    quantidadeRodadas(times.length);

  const rodadas = [];

  let partidasAtuais = primeiraRodada;

  for (
    let rodada = 1;
    rodada <= totalRodadas;
    rodada++
  ) {
    rodadas.push({
      nome: nomeFase(
        rodada,
        totalRodadas
      ),
      partidas: partidasAtuais,
    });

    if (partidasAtuais.length === 1) {
      break;
    }

    const proximas = [];

    for (
      let i = 0;
      i < partidasAtuais.length;
      i += 2
    ) {
      proximas.push({
        time1: null,
        time2: null,

        origem1:
          partidasAtuais[i],

        origem2:
          partidasAtuais[i + 1],
      });
    }

    partidasAtuais = proximas;
  }

  /*
   * Tenta preencher vencedores das rodadas.
   */
  const descobrirTimeDaPartida = (partida) => {
    if (partida.time1 || partida.time2) {
      return partida;
    }

    let time1 = null;
    let time2 = null;

    if (partida.origem1) {
      const jogo1 = procurarJogo(
        partida.origem1.time1,
        partida.origem1.time2
      );

      if (jogo1) {
        const vencedor = descobrirVencedor(jogo1);

        time1 = times.find(
          (time) => time.id === vencedor
        );
      }
    }

    if (partida.origem2) {
      const jogo2 = procurarJogo(
        partida.origem2.time1,
        partida.origem2.time2
      );

      if (jogo2) {
        const vencedor = descobrirVencedor(jogo2);

        time2 = times.find(
          (time) => time.id === vencedor
        );
      }
    }

    return {
      ...partida,
      time1,
      time2,
    };
  };

  /*
   * Faz várias passagens para preencher
   * vencedores automaticamente.
   */
  for (let i = 0; i < rodadas.length; i++) {
    rodadas[i].partidas =
      rodadas[i].partidas.map(
        descobrirTimeDaPartida
      );
  }

  const getNomeTime = (time) => {
    return time?.Nome || "A definir";
  };

  if (loading) {
    return (
      <div className="chaveamento-page">
        <p>Carregando chaveamento...</p>
      </div>
    );
  }

  return (
    <div className="chaveamento-page">

      <div className="chaveamento-header">
        <h1>Chaveamento</h1>

        <p>
          Acompanhe a evolução da competição
        </p>
      </div>

      <div className="chaveamento-filtros">

        <select
          value={modalidadeSelecionada}
          onChange={(e) =>
            setModalidadeSelecionada(
              e.target.value
            )
          }
        >
          {modalidades.map((modalidade) => (
            <option
              key={modalidade.id}
              value={modalidade.id}
            >
              {modalidade.nome}
            </option>
          ))}
        </select>

        <div
          className={`genero-toggle ${
            genero === "F"
              ? "feminino"
              : "masculino"
          }`}
          onClick={() =>
            setGenero(
              genero === "M"
                ? "F"
                : "M"
            )
          }
        >
          <div className="genero-toggle-bolinha" />

          <span className="genero-opcao">
            MASCULINO
          </span>

          <span className="genero-opcao">
            FEMININO
          </span>
        </div>

      </div>

      {times.length < 2 ? (
        <div className="chaveamento-vazio">
          <h2>Chaveamento indisponível</h2>

          <p>
            É necessário ter pelo menos 2 times
            cadastrados para montar a chave.
          </p>
        </div>
      ) : (
        <div className="chaveamento-scroll">

          <div className="chaveamento">

            {rodadas.map(
              (rodada, rodadaIndex) => (

                <div
                  className="chave-coluna"
                  key={rodadaIndex}
                >

                  <h2>
                    {rodada.nome}
                  </h2>

                  <div className="chave-partidas">

                    {rodada.partidas.map(
                      (partida, partidaIndex) => {

                        const jogo =
                          procurarJogo(
                            partida.time1,
                            partida.time2
                          );

                        const placar =
                          jogo?.pontuacao;

                        return (
                          <div
                            className="chave-partida"
                            key={partidaIndex}
                          >

                            <div className="chave-time">
                              <span>
                                {getNomeTime(
                                  partida.time1
                                )}
                              </span>

                              {placar && (
                                <strong>
                                  {placar[0]}
                                </strong>
                              )}
                            </div>

                            <div className="chave-time">
                              <span>
                                {getNomeTime(
                                  partida.time2
                                )}
                              </span>

                              {placar && (
                                <strong>
                                  {placar[1]}
                                </strong>
                              )}
                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Chaveamento;
