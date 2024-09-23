import Header from "../../Header/Header"
import FormularioValidacao from '../FormularioValidacao/Formulario'



const Recepcao = () => {
  return (
    <div>
      <div className='recepcao'>
        <Header nomePagina={"Recepção"} />
        <FormularioValidacao/>
      </div>
    </div>
  )
}

export default Recepcao;