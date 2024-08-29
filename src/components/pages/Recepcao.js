import React from 'react'
import Header from "../Header/Header"
import FormInput from '../pages/FormInput'
import CloseButton from "../buttons/CloseButton"



const Recepcao = () => {
  return (
    <div>
      <div className='recepcao'>
        <Header ativaBotao={"Recepção"} />
        <FormInput />
        <CloseButton/>
      </div>
    </div>
  )
}

export default Recepcao;