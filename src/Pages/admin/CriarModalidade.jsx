import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import "../../css/admin/CriarModalidade.css";

function CriarModalidade() {
  const [modalidades, setModalidades] = useState([]);
  const [nome, setNome] = useState("");
  const [genero, setGenero] = useState("Not"); // 'M', 'F', 'Not'
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(true);

  // Buscar modalidades existentes
  const buscarModalidades = async () => {
    setCarregandoLista(true);
    const { data, error } = await supabase
      .from("modalidade")
      .select("*")
      .order("nome", { ascending: true });

    if (!error && data) {
      setModalidades(data);
    } else {
      console.error("Erro ao buscar modalidades:", error);
    }
    setCarregandoLista(false);
  };

  useEffect(() => {
    buscarModalidades();
  }, []);

  // Criar nova modalidade com verificação de duplicidade
  const handleCriarModalidade = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: "", texto: "" });

    const nomeFormatado = nome.trim();

    if (!nomeFormatado) {
      setMensagem({ tipo: "erro", texto: "Informe o nome da modalidade." });
      return;
    }

    setLoading(true);

    try {
      // 1. Verifica no banco se já existe uma modalidade com esse nome (ilike = case-insensitive)
      const { data: jaExiste, error: errorBusca } = await supabase
        .from("modalidade")
        .select("id")
        .ilike("nome", nomeFormatado);

      if (errorBusca) {
        throw new Error("Erro ao verificar duplicidade de nome.");
      }

      if (jaExiste && jaExiste.length > 0) {
        setMensagem({
          tipo: "erro",
          texto: `A modalidade "${nomeFormatado}" já está cadastrada!`,
        });
        setLoading(false);
        return;
      }

      // 2. Insere a nova modalidade no banco
      const { error: errorInsert } = await supabase.from("modalidade").insert([
        {
          nome: nomeFormatado,
          genero: genero || "Not",
        },
      ]);

      if (errorInsert) {
        throw errorInsert;
      }

      setMensagem({
        tipo: "sucesso",
        texto: `Modalidade "${nomeFormatado}" criada com sucesso!`,
      });

      // Limpa os campos
      setNome("");
      setGenero("Not");

      // Atualiza a listagem
      await buscarModalidades();
    } catch (err) {
      console.error("Erro ao salvar modalidade:", err);
      setMensagem({
        tipo: "erro",
        texto: "Erro ao cadastrar modalidade. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Deletar modalidade
  const handleDeletarModalidade = async (id, nomeModalidade) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar a modalidade "${nomeModalidade}"?`,
    );

    if (!confirmacao) return;

    try {
      const { error } = await supabase.from("modalidade").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setMensagem({
        tipo: "sucesso",
        texto: `Modalidade "${nomeModalidade}" removida com sucesso!`,
      });

      setModalidades((prev) => prev.filter((mod) => mod.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      setMensagem({
        tipo: "erro",
        texto:
          "Erro ao deletar modalidade. Verifique se existem times ou partidas associadas.",
      });
    }
  };

  return (
    <div className="admin-modalidades-page">
      <div className="admin-card-modalidades">
        <h2 className="admin-titulo-secao">CRIAR MODALIDADE</h2>

        {/* FEEDBACK DE STATUS */}
        {mensagem.texto && (
          <p className={`mensagem-status ${mensagem.tipo}`}>{mensagem.texto}</p>
        )}

        {/* FORMULÁRIO DE CRIAÇÃO */}
        <form className="form-modalidade" onSubmit={handleCriarModalidade}>
          <div className="campo-grupo">
            <label htmlFor="nomeModalidade">Nome da Modalidade</label>
            <input
              id="nomeModalidade"
              type="text"
              placeholder="Ex: FUTSAL, VÔLEI, BASQUETE"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="campo-grupo">
            <label htmlFor="generoModalidade">Gênero</label>
            <select
              id="generoModalidade"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="Not">Misto / Não Especificado</option>
              <option value="M">Masculino (M)</option>
              <option value="F">Feminino (F)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-salvar-modalidade"
            disabled={loading}
          >
            {loading ? "Salvando..." : "CRIAR MODALIDADE"}
          </button>
        </form>

        {/* LISTA DE MODALIDADES PARA GERENCIAR / DELETAR */}
        <div className="container-lista-modalidades">
          <h3 className="subtitulo-lista">MODALIDADES CADASTRADAS</h3>

          {carregandoLista ? (
            <p className="texto-vazio">Carregando modalidades...</p>
          ) : modalidades.length > 0 ? (
            <ul className="lista-modalidades">
              {modalidades.map((mod) => (
                <li key={mod.id} className="item-modalidade">
                  <div className="info-modalidade">
                    <span className="nome-mod">{mod.nome.toUpperCase()}</span>
                    <span className="genero-mod">
                      Gênero:{" "}
                      {mod.genero === "M"
                        ? "Masculino"
                        : mod.genero === "F"
                          ? "Feminino"
                          : "Misto"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-deletar-mod"
                    onClick={() => handleDeletarModalidade(mod.id, mod.nome)}
                  >
                    Deletar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="texto-vazio">Nenhuma modalidade cadastrada ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CriarModalidade;
