import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient.js";
import "../css/Chaveamento.css";
import Bracket from "./chaveamento/Bracket.jsx";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Chaveamento() {
  const [modalidades, setModalidades] = useState([]);
  const [modalidadeId, setModalidadeId] = useState("");
  const [times, setTimes] = useState([]);
  const [chave, setChave] = useState([]);
  const [campeonatoAtual, setCampeonatoAtual] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagemTimes, setMensagemTimes] = useState("");
  const [mensagemAcao, setMensagemAcao] = useState("");

  useEffect(() => {
    carregarModalidades();
  }, []);

  async function carregarModalidades() {
    const { data, error } = await supabase
      .from("modalidade")
      .select("id, nome, genero")
      .order("nome");

    if (error) {
      console.error("Erro ao carregar modalidades:", error);
      setMensagemAcao("Erro ao carregar modalidades.");
      return;
    }

    setModalidades(data || []);
  }

  async function carregarTimes() {
    if (!modalidadeId) {
      setMensagemAcao("Escolha uma modalidade.");
      return;
    }

    setCarregando(true);
    setMensagemAcao("");
    setMensagemTimes("");

    try {
      const { data, error } = await supabase
        .from("time")
        .select("*")
        .eq("id_modalidade", modalidadeId)
        .order("Nome");

      if (error) throw error;

      const listaTimes = data || [];
      setTimes(listaTimes);

      setMensagemTimes(
        listaTimes.length === 0
          ? "Nenhum time cadastrado nessa modalidade."
          : `${listaTimes.length} times encontrados.`
      );

      await carregarCampeonatoExistente(listaTimes);
    } catch (erro) {
      console.error("Erro ao carregar times:", erro);
      setMensagemTimes("Erro ao carregar os times: " + erro.message);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarCampeonatoExistente(listaTimes = times) {
    if (!modalidadeId) return;

    try {
      const { data: campeonato, error } = await supabase
        .from("campeonato")
        .select("*")
        .eq("id_modalidade", modalidadeId)
        .eq("status", "Em andamento")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!campeonato) {
        setCampeonatoAtual(null);
        setChave([]);
        setMensagemAcao("Nenhum chaveamento criado para essa modalidade.");
        return;
      }

      setCampeonatoAtual(campeonato);
      await carregarConfrontos(campeonato.id, listaTimes);
      setMensagemAcao("Chaveamento existente carregado.");
    } catch (erro) {
      console.error("Erro ao procurar campeonato:", erro);
      setMensagemAcao("Erro ao carregar o chaveamento.");
    }
  }

  async function carregarConfrontos(campeonatoId, listaTimes = times) {
    const { data, error } = await supabase
      .from("confronto")
      .select(`
        id, created_at, time1, time2, finalizado, horario, ao_vivo, id_campeonato,
        fase, ordem, proximo_confronto, lado_proximo, origem_time1, origem_time2,
        time1:time1 (id, Nome, logo_URL, id_modalidade),
        time2:time2 (id, Nome, logo_URL, id_modalidade),
        detalhes (id, confronto_id, ptn_time1, ptn_time2, local, vencedor)
      `)
      .eq("id_campeonato", campeonatoId)
      .order("fase")
      .order("ordem");

    if (error) {
      console.error("Erro ao carregar confrontos:", error);
      setMensagemAcao("Erro ao carregar os confrontos.");
      return;
    }

    const mapaTimes = {};
    listaTimes.forEach((time) => {
      mapaTimes[time.id] = time;
    });

    const confrontosComTimes = (data || []).map((confronto) => ({
      ...confronto,
      time1:
        typeof confronto.time1 === "object"
          ? confronto.time1
          : mapaTimes[confronto.time1] || null,
      time2:
        typeof confronto.time2 === "object"
          ? confronto.time2
          : mapaTimes[confronto.time2] || null,
      detalhes: Array.isArray(confronto.detalhes)
        ? confronto.detalhes[0] || null
        : confronto.detalhes || null,
    }));

    setChave(confrontosComTimes);
  }

  function descobrirFase(numeroTimes) {
    if (numeroTimes === 2) return "Final";
    if (numeroTimes === 4) return "Semifinal";
    if (numeroTimes === 8) return "Quartas de final";
    if (numeroTimes === 16) return "Oitavas de final";
    if (numeroTimes === 32) return "16-avos de final";
    if (numeroTimes === 64) return "32-avos de final";
    return `Fase de ${numeroTimes} times`;
  }

  function gerarEstruturaLocal() {
    const quantidade = times.length;
    if (quantidade < 2) {
      setMensagemAcao("É necessário ter pelo menos 2 times.");
      return null;
    }

    let totalVagas = 2;
    while (totalVagas < quantidade) {
      totalVagas *= 2;
    }

    let primeiraFase = [...times].sort(() => Math.random() - 0.5);

    while (primeiraFase.length < totalVagas) {
      primeiraFase.push(null);
    }

    const confrontos = [];
    let quantidadeTimesNaFase = totalVagas;

    while (quantidadeTimesNaFase >= 2) {
      const quantidadeJogos = quantidadeTimesNaFase / 2;
      const fase = descobrirFase(quantidadeTimesNaFase);

      for (let i = 0; i < quantidadeJogos; i++) {
        const time1 =
          quantidadeTimesNaFase === totalVagas ? primeiraFase[i * 2] : null;
        const time2 =
          quantidadeTimesNaFase === totalVagas
            ? primeiraFase[i * 2 + 1]
            : null;

        confrontos.push({
          id: `novo-${fase}-${i + 1}-${Date.now()}-${i}`,
          fase,
          ordem: i + 1,
          time1,
          time2,
          origem_time1: null,
          origem_time2: null,
          proximo_confronto: null,
          lado_proximo: null,
        });
      }

      quantidadeTimesNaFase = quantidadeTimesNaFase / 2;
    }

    const fases = [];
    confrontos.forEach((jogo) => {
      if (!fases.includes(jogo.fase)) fases.push(jogo.fase);
    });

    for (let i = 0; i < confrontos.length; i++) {
      const jogo = confrontos[i];
      const indiceFaseAtual = fases.indexOf(jogo.fase);

      if (indiceFaseAtual === fases.length - 1) continue;

      const proximaFase = fases[indiceFaseAtual + 1];
      const jogosProximaFase = confrontos.filter(
        (item) => item.fase === proximaFase
      );
      const jogosFaseAtual = confrontos.filter(
        (item) => item.fase === jogo.fase
      );

      const indiceDoJogo = jogosFaseAtual.indexOf(jogo);
      const proximoJogo = jogosProximaFase[Math.floor(indiceDoJogo / 2)];

      if (!proximoJogo) continue;

      jogo.proximo_confronto = proximoJogo.id;

      if (indiceDoJogo % 2 === 0) {
        jogo.lado_proximo = "time1";
        proximoJogo.origem_time1 = jogo.id;
      } else {
        jogo.lado_proximo = "time2";
        proximoJogo.origem_time2 = jogo.id;
      }
    }

    return confrontos;
  }

  async function gerarChaveamento() {
    if (!modalidadeId) {
      setMensagemAcao("Escolha uma modalidade.");
      return;
    }

    if (times.length < 2) {
      setMensagemAcao("É necessário ter pelo menos 2 times.");
      return;
    }

    if (campeonatoAtual) {
      setMensagemAcao(
        "Já existe um chaveamento em andamento. Use Reiniciar Chaveamento para criar outro."
      );
      return;
    }

    setCarregando(true);
    setMensagemAcao("Gerando chaveamento...");

    try {
      const estrutura = gerarEstruturaLocal();
      if (!estrutura) return;

      const { data: campeonato, error: erroCampeonato } = await supabase
        .from("campeonato")
        .insert({
          nome: `Campeonato ${new Date().getFullYear()}`,
          id_modalidade: modalidadeId,
          status: "Em andamento",
          quantidade_times: times.length,
        })
        .select()
        .single();

      if (erroCampeonato) throw erroCampeonato;

      const timesCampeonato = times.map((time, index) => ({
        id_campeonato: campeonato.id,
        id_time: time.id,
        posicao_chave: index + 1,
      }));

      const { error: erroTimes } = await supabase
        .from("campeonato_time")
        .insert(timesCampeonato);

      if (erroTimes) throw erroTimes;

      const dadosConfrontos = estrutura.map((jogo) => ({
        id_campeonato: campeonato.id,
        fase: jogo.fase,
        ordem: jogo.ordem,
        time1: jogo.time1?.id || null,
        time2: jogo.time2?.id || null,
        finalizado: false,
        ao_vivo: false,
        horario: null,
        proximo_confronto: null,
        lado_proximo: jogo.lado_proximo,
        origem_time1: null,
        origem_time2: null,
      }));

      const { data: confrontosSalvos, error: erroConfrontos } = await supabase
        .from("confronto")
        .insert(dadosConfrontos)
        .select();

      if (erroConfrontos) throw erroConfrontos;

      const mapaConfrontos = {};
      confrontosSalvos.forEach((confronto) => {
        mapaConfrontos[`${confronto.fase}-${confronto.ordem}`] = confronto;
      });

      for (const jogo of estrutura) {
        const confrontoAtual = mapaConfrontos[`${jogo.fase}-${jogo.ordem}`];
        if (!jogo.proximo_confronto) continue;

        const proximoOriginal = estrutura.find(
          (item) => item.id === jogo.proximo_confronto
        );

        if (!proximoOriginal) continue;

        const proximoConfronto =
          mapaConfrontos[`${proximoOriginal.fase}-${proximoOriginal.ordem}`];

        if (!proximoConfronto) continue;

        await supabase
          .from("confronto")
          .update({
            proximo_confronto: proximoConfronto.id,
            lado_proximo: jogo.lado_proximo,
          })
          .eq("id", confrontoAtual.id);

        if (jogo.lado_proximo === "time1") {
          await supabase
            .from("confronto")
            .update({ origem_time1: confrontoAtual.id })
            .eq("id", proximoConfronto.id);
        }

        if (jogo.lado_proximo === "time2") {
          await supabase
            .from("confronto")
            .update({ origem_time2: confrontoAtual.id })
            .eq("id", proximoConfronto.id);
        }
      }

      const detalhes = confrontosSalvos.map((confronto) => ({
        confronto_id: confronto.id,
        ptn_time1: 0,
        ptn_time2: 0,
        local: null,
        vencedor: null,
      }));

      const { error: erroDetalhes } = await supabase
        .from("detalhes")
        .insert(detalhes);

      if (erroDetalhes) throw erroDetalhes;

      setCampeonatoAtual(campeonato);
      await carregarConfrontos(campeonato.id, times);
      setMensagemAcao("Chaveamento criado com sucesso.");
    } catch (erro) {
      console.error("Erro ao gerar chaveamento:", erro);
      setMensagemAcao("Ocorreu um erro ao gerar o chaveamento.");
    } finally {
      setCarregando(false);
    }
  }

  async function moverTime(origemId, origemLado, destinoId, destinoLado) {
    const novaChave = chave.map((jogo) => ({ ...jogo }));
    const origem = novaChave.find((jogo) => jogo.id === origemId);
    const destino = novaChave.find((jogo) => jogo.id === destinoId);

    if (!origem || !destino) return;

    const timeOrigem = origemLado === "time1" ? origem.time1 : origem.time2;
    const timeDestino = destinoLado === "time1" ? destino.time1 : destino.time2;

    if (!timeOrigem) return;

    if (origemLado === "time1") origem.time1 = timeDestino;
    else origem.time2 = timeDestino;

    if (destinoLado === "time1") destino.time1 = timeOrigem;
    else destino.time2 = timeOrigem;

    setChave(novaChave);

    await atualizarTimesDoConfronto(origem.id, origem.time1, origem.time2);
    if (origem.id !== destino.id) {
      await atualizarTimesDoConfronto(destino.id, destino.time1, destino.time2);
    }
  }

  async function atualizarTimesDoConfronto(confrontoId, time1, time2) {
    const { error } = await supabase
      .from("confronto")
      .update({
        time1: time1?.id || null,
        time2: time2?.id || null,
      })
      .eq("id", confrontoId);

    if (error) {
      console.error("Erro ao salvar times:", error);
      return false;
    }
    return true;
  }

  async function alterarAoVivo(confrontoId, valor) {
    const { error } = await supabase
      .from("confronto")
      .update({ ao_vivo: valor })
      .eq("id", confrontoId);

    if (error) {
      console.error("Erro ao alterar ao vivo:", error);
      return;
    }

    setChave((anterior) =>
      anterior.map((jogo) =>
        jogo.id === confrontoId ? { ...jogo, ao_vivo: valor } : jogo
      )
    );
  }

  async function registrarVencedor(confronto, vencedorId) {
    if (!vencedorId) return;

    const timeVencedor =
      confronto.time1?.id === vencedorId
        ? confronto.time1
        : confronto.time2?.id === vencedorId
        ? confronto.time2
        : null;

    if (!timeVencedor) return;

    setCarregando(true);
    setMensagemAcao("Salvando vencedor...");

    try {
      let detalheId = confronto.detalhes?.id;

      if (detalheId) {
        const { error } = await supabase
          .from("detalhes")
          .update({ vencedor: vencedorId })
          .eq("id", detalheId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("detalhes").insert({
          confronto_id: confronto.id,
          ptn_time1: 0,
          ptn_time2: 0,
          local: null,
          vencedor: vencedorId,
        });

        if (error) throw error;
      }

      const { error: erroFinalizar } = await supabase
        .from("confronto")
        .update({ finalizado: true, ao_vivo: false })
        .eq("id", confronto.id);

      if (erroFinalizar) throw erroFinalizar;

      if (confronto.fase === "Final") {
        if (!campeonatoAtual) throw new Error("Campeonato não encontrado.");

        const { error: erroCampeao } = await supabase
          .from("campeonato")
          .update({ campeao: vencedorId, status: "Finalizado" })
          .eq("id", campeonatoAtual.id);

        if (erroCampeao) throw erroCampeao;

        setCampeonatoAtual({
          ...campeonatoAtual,
          campeao: vencedorId,
          status: "Finalizado",
        });

        setMensagemAcao(`${timeVencedor.Nome} é o campeão!`);
        await carregarConfrontos(campeonatoAtual.id, times);
        return;
      }

      if (confronto.proximo_confronto) {
        const proximo = chave.find((j) => j.id === confronto.proximo_confronto);
        if (proximo) {
          const campoUpdate = confronto.lado_proximo === "time1" ? "time1" : "time2";
          await supabase
            .from("confronto")
            .update({ [campoUpdate]: vencedorId })
            .eq("id", proximo.id);
        }
      }

      await carregarConfrontos(campeonatoAtual.id, times);
      setMensagemAcao(`${timeVencedor.Nome} avançou para a próxima fase.`);
    } catch (erro) {
      console.error("Erro ao registrar vencedor:", erro);
      setMensagemAcao("Erro ao registrar o vencedor.");
    } finally {
      setCarregando(false);
    }
  }

  async function reiniciarChaveamento() {
    if (!campeonatoAtual) {
      setMensagemAcao("Não existe chaveamento para reiniciar.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja reiniciar o chaveamento? O chaveamento atual será encerrado e um novo poderá ser criado."
    );

    if (!confirmar) return;

    setCarregando(true);
    setMensagemAcao("Reiniciando chaveamento...");

    try {
      const { error } = await supabase
        .from("campeonato")
        .update({ status: "Reiniciado" })
        .eq("id", campeonatoAtual.id);

      if (error) throw error;

      setCampeonatoAtual(null);
      setChave([]);
      setMensagemAcao("Chaveamento reiniciado. Agora você pode gerar um novo.");
    } catch (erro) {
      console.error("Erro ao reiniciar:", erro);
      setMensagemAcao("Erro ao reiniciar o chaveamento.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="chaveamento-container">
      <h1 className="chaveamento-titulo">CHAVEAMENTO</h1>

      <div className="chaveamento-filtros">
        <select
          className="chaveamento-select"
          value={modalidadeId}
          onChange={async (e) => {
            const novaModalidade = e.target.value;
            setModalidadeId(novaModalidade);
            setTimes([]);
            setChave([]);
            setCampeonatoAtual(null);
            setMensagemTimes("");
            setMensagemAcao("");

            if (!novaModalidade) return;

            setCarregando(true);
            try {
              const { data, error } = await supabase
                .from("time")
                .select("*")
                .eq("id_modalidade", novaModalidade)
                .order("Nome");

              if (error) throw error;

              const listaTimes = data || [];
              setTimes(listaTimes);

              setMensagemTimes(
                listaTimes.length === 0
                  ? "Nenhum time cadastrado nessa modalidade."
                  : `${listaTimes.length} times encontrados.`
              );

              const { data: campeonato, error: erroCampeonato } = await supabase
                .from("campeonato")
                .select("*")
                .eq("id_modalidade", novaModalidade)
                .eq("status", "Em andamento")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

              if (erroCampeonato) throw erroCampeonato;

              if (campeonato) {
                setCampeonatoAtual(campeonato);
                await carregarConfrontos(campeonato.id, listaTimes);
                setMensagemAcao("Chaveamento existente carregado.");
              } else {
                setMensagemAcao("Nenhum chaveamento criado para essa modalidade.");
              }
            } catch (erro) {
              console.error(erro);
              setMensagemAcao("Erro ao carregar a modalidade.");
            } finally {
              setCarregando(false);
            }
          }}
        >
          <option value="">Escolha modalidade</option>
          {modalidades.map((modalidade) => (
            <option key={modalidade.id} value={modalidade.id}>
              {modalidade.nome}
            </option>
          ))}
        </select>

        <button
          className="chaveamento-btn chaveamento-btn-carregar"
          onClick={carregarTimes}
          disabled={carregando}
        >
          {carregando ? "Carregando..." : "Carregar Times"}
        </button>

        <button
          className="chaveamento-btn chaveamento-btn-gerar"
          onClick={gerarChaveamento}
          disabled={
            carregando ||
            times.length < 2 ||
            campeonatoAtual !== null
          }
        >
          Gerar Chaveamento
        </button>

        {campeonatoAtual && (
          <button
            className="chaveamento-btn chaveamento-btn-reiniciar"
            onClick={reiniciarChaveamento}
            disabled={carregando}
          >
            Reiniciar Chaveamento
          </button>
        )}
      </div>

      {mensagemTimes && (
        <p className="chaveamento-mensagem">{mensagemTimes}</p>
      )}

      {mensagemAcao && (
        <p className="chaveamento-mensagem">{mensagemAcao}</p>
      )}

      {campeonatoAtual && (
        <p className="chaveamento-mensagem chaveamento-mensagem-info">
          Campeonato: {campeonatoAtual.nome}
        </p>
      )}

      {chave.length > 0 && (
        <Bracket
          jogos={chave}
          onMoverTime={moverTime}
          onAlterarAoVivo={alterarAoVivo}
          onRegistrarVencedor={registrarVencedor}
        />
      )}
    </div>
  );
}

export default Chaveamento;