import {Link} from "react-router-dom"


function Erro404() {
  return (
    <>
      <h1>Erro 404</h1>
      <p>Página não encontrada.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </>
  )
}
export default Erro404;