import Header from "../../Header/Header"
// import FormInput from '../FormularioDEInput/FormInput'
import FormularioValidacao from '../FormularioValidacao/Formulario'



const Recepcao = () => {
  return (
    <div>
      <div className='recepcao'>
        <Header nomePagina={"Recepção"} />
        {/* <FormInput /> */}
        <FormularioValidacao/>
      </div>
    </div>
  )
}

export default Recepcao;