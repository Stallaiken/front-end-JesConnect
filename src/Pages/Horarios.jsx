import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient"; // ajuste o caminho se necessário
import "../css/Horarios.css";

// Lista local de bandeiras (coloque os nomes exatos dos times)
const BANDEIRAS = {
  // Exemplo:
  // "Colégio São José": "🟢",
  // "Escola Municipal": "🔵",
};

const PAGE_SIZE = 10;

function Horarios() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [erro, setErro] = useState(null);
  const [jaCarregou, setJaCarregou] = useState(false);

  const loaderRef = useRef(null);
  const isFetching = useRef(false);

  const fetchJogos = useCallback(async (pageNumber) => {
    if (isFetching.current) return;
    isFetching.current = true;

    setLoading(true);
    setErro(null);

    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      const { data, error } = await supabase
        .from("confronto")
        .select(`
          id,
          horario,
          finalizado,
          time1 (
            id,
            Nome,
            id_modalidade,
            modalidade:id_modalidade (
              id,
              nome,
              genero
            )
          ),
          time2 (
            id,
            Nome
          )
        `)
        .eq("finalizado", false)
        .order("horario", { ascending: true })
        .range(from, to);

      if (error) {
        console.error("Erro ao buscar jogos:", error);
        setErro("Erro ao carregar os jogos.");
        setHasMore(false);
        return;
      }

      if (!data || data.length === 0) {
        setHasMore(false);
        if (pageNumber === 0) {
          setJogos([]);
        }
      } else {
        setJogos((prev) => (pageNumber === 0 ? data : [...prev, ...data]));

        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar os jogos.");
      setHasMore(false);
    } finally {
      setLoading(false);
      setJaCarregou(true);
      isFetching.current = false;
    }
  }, []);

  // Carrega a primeira página
  useEffect(() => {
    fetchJogos(0);
  }, [fetchJogos]);

  // Infinite Scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchJogos(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading, fetchJogos]);

  const getBandeira = (nomeTime) => {
    if (!nomeTime) return "🏳️";
    return BANDEIRAS[nomeTime] || "🏳️";
  };

  const formatarHorario = (horario) => {
    if (!horario) return "--:--";
    const date = new Date(horario);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horários de Início</h1>
      </div>

      <div className="lista-confrontos">
        {jaCarregou && jogos.length === 0 && !loading && (
          <p className="horarios-mensagem-vazia">
            Nenhuma competição encontrada.
          </p>
        )}

        {jogos.map((jogo) => (
          <div key={jogo.id} className="card-confronto">
            <span className="modalidade-titulo">
              {jogo.time1?.modalidade?.nome || "Modalidade"}
            </span>

            <div className="conteudo-confronto">
              <div className="time-box">
                <span className="bandeira">{getBandeira(jogo.time1?.Nome)}</span>
                <span className="nome-time">
                  {jogo.time1?.Nome || "Time 1"}
                </span>
              </div>

              <div className="horario-pill">
                {formatarHorario(jogo.horario)}
              </div>

              <div className="time-box">
                <span className="bandeira">{getBandeira(jogo.time2?.Nome)}</span>
                <span className="nome-time">
                  {jogo.time2?.Nome || "Time 2"}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div ref={loaderRef} style={{ height: "30px", marginTop: "10px" }}>
          {loading && (
            <p style={{ textAlign: "center", color: "#666" }}>Carregando...</p>
          )}
        </div>

        {erro && (
          <p style={{ textAlign: "center", color: "red" }}>{erro}</p>
        )}
      </div>
    </div>
  );
}

export default Horarios;