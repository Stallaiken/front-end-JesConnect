import { useState, useEffect, useRef, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/Horarios.css";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  {
    eager: true,
  },
);
const BANDEIRAS = {};
for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];

  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

const PAGE_SIZE = 10;

function Horarios() {
  const navigate = useNavigate();

  const [jogos, setJogos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [erro, setErro] = useState(null);

  const [jaCarregou, setJaCarregou] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true",
  );



  const loaderRef = useRef(null);
  const isFetching = useRef(false);
  const pageRef = useRef(0);

  useEffect(() => {
    const verificarAdmin = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };

    verificarAdmin();

    window.addEventListener("admin-status-change", verificarAdmin);

    return () => {
      window.removeEventListener("admin-status-change", verificarAdmin);
    };
  }, []);

  const fetchJogos = useCallback(async (pageNumber, reset = false) => {
    if (isFetching.current) return;

    isFetching.current = true;

    setLoading(true);
    setErro(null);

    const from = pageNumber * PAGE_SIZE;

    const to = from + PAGE_SIZE - 1;

    try {
      const { data, error } = await supabase
        .from("confronto")
        .select(
          `
              id,
              horario,
              finalizado,

              time1:time1 (
                id,
                Nome,
                logo_URL,
                id_modalidade,

                modalidade:id_modalidade (
                  id,
                  nome,
                  genero
                )
              ),

              time2:time2 (
                id,
                Nome,
                logo_URL,
                id_modalidade
              )
            `,
        )
        .eq("finalizado", false)
        .order("horario", {
          ascending: true,
        })
        .range(from, to);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        setHasMore(false);

        if (pageNumber === 0 || reset) {
          setJogos([]);
        }
      } else {
        if (reset || pageNumber === 0) {
          setJogos(data);
        } else {
          setJogos((prev) => [...prev, ...data]);
        }

        setHasMore(data.length >= PAGE_SIZE);
      }
    } catch (err) {
      console.error("Erro ao buscar jogos:", err);

      setErro("Erro ao carregar os jogos.");

      setHasMore(false);
    } finally {
      setLoading(false);
      setJaCarregou(true);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchJogos(0, true);
  }, [fetchJogos]);


  useEffect(() => {
    const channel = supabase
      .channel("confrontos-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "confronto",
        },
        () => {
          pageRef.current = 0;
          setHasMore(true);

          fetchJogos(0, true);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJogos]);


  useEffect(() => {
    if (!hasMore || loading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching.current) {
          pageRef.current += 1;

          fetchJogos(pageRef.current);
        }
      },
      {
        threshold: 0.1,
      },
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

  // ======================================================
  // BANDEIRA
  // ======================================================

  const getBandeira = (logoURL) => {
    if (!logoURL) {
      return null;
    }

    return BANDEIRAS[logoURL] || null;
  };

  // ======================================================
  // HORÁRIO
  // ======================================================

  const formatarHorario = (horario) => {
    if (!horario) {
      return "--:--";
    }

    const date = new Date(horario);

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ======================================================
  // RENDER
  // ======================================================

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

        {jogos.map((jogo) => {
          const bandeira1 = getBandeira(jogo.time1?.logo_URL);

          const bandeira2 = getBandeira(jogo.time2?.logo_URL);

          return (
            <div
              key={jogo.id}
              className={`card-confronto ${isAdmin ? "card-editavel" : ""}`}
              onClick={() => {
                if (isAdmin) {
                  navigate("/finalizar", {
                    state: {
                      jogo,
                    },
                  });
                }
              }}
              style={{
                cursor: isAdmin ? "pointer" : "default",
              }}
            >
              <span className="modalidade-titulo">
                {jogo.time1?.modalidade?.nome || "Modalidade"}
              </span>

              <div className="conteudo-confronto">
                {/* TIME 1 */}

                <div className="time-box">
                  <div className="bandeira-container">
                    {bandeira1 && (
                      <img
                        src={bandeira1}
                        alt={jogo.time1?.Nome || "Time 1"}
                        className="bandeira-img"
                      />
                    )}
                  </div>

                  <span className="nome-time">
                    {jogo.time1?.Nome || "Time 1"}
                  </span>
                </div>

                {/* HORÁRIO */}

                <div className="horario-pill">
                  {formatarHorario(jogo.horario)}
                </div>

                {/* TIME 2 */}

                <div className="time-box">
                  <div className="bandeira-container">
                    {bandeira2 && (
                      <img
                        src={bandeira2}
                        alt={jogo.time2?.Nome || "Time 2"}
                        className="bandeira-img"
                      />
                    )}
                  </div>

                  <span className="nome-time">
                    {jogo.time2?.Nome || "Time 2"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div
          ref={loaderRef}
          style={{
            height: "30px",
            marginTop: "10px",
          }}
        >
          {loading && (
            <p
              style={{
                textAlign: "center",
                color: "#666",
              }}
            >
              Carregando...
            </p>
          )}
        </div>

        {erro && (
          <p
            style={{
              textAlign: "center",
              color: "red",
            }}
          >
            {erro}
          </p>
        )}
      </div>


     
    </div>
  );
}

export default Horarios;
