import Header from "../../Header/Header"
import AgendaDelivery from "../AgendaDelivery/AgendaDelivery"
import FormularioValidacao from "../FormularioValidacao/Formulario"


const Delivery = () => {
  return (
    <div>
      <Header nomePagina="Delivery"/>
      {/* <FormularioValidacao/> */}
      <AgendaDelivery/>
    </div>
  )
}

export default Delivery