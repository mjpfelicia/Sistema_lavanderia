import React from 'react';
import pencil from '../../img/iconspencil.png';
import btnStyle from './BtnAtualiza.module.css';
import { Cliente } from '../pages/service/apiCliente';

type BtnAtualizaProps = {
  cliente?: Cliente;
};

function atualizaCliente(cliente?: Cliente):any {
  console.log("Atualizar Cliente", { cliente });
}

const BtnAtualiza = ({ cliente }: BtnAtualizaProps) => {

  return (
    <button accessKey='BtnAtualiza' onClick={atualizaCliente(cliente)} className={btnStyle.btnAtualiza} >
      <img src={pencil} alt="pincel" onClick={atualizaCliente(cliente)} style={{ width: '1rem', height: '1rem' }} />
    </button>
  );
};

export default BtnAtualiza;


