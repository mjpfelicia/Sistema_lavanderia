import Header from "../../Header/Header"
import BackToHome from "../../buttons/BackToHome"
import Formulario from "../DetalhesCliente/DetalhesCliente"

const Relatorio = () => {
  return (
    <div>
      <Header nomePagina={"Relatorio"} />
      <div style={{ padding: '0.5rem 1rem' }}>
        <BackToHome variant="icon" />
      </div>
      <Formulario/>
    </div>
  )
}

export default Relatorio