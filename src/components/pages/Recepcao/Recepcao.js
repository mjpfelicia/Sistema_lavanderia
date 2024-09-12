import React from 'react'
import Header from "../../Header/Header"
import FormInput from '../FormularioDEInput/FormInput'



const Recepcao = () => {
  return (
    <div>
      <div className='recepcao'>
        <Header nomePagina={"Recepção"} />
        <FormInput />
      </div>
    </div>
  )
}

export default Recepcao;