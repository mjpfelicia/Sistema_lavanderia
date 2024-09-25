import React from 'react';
import pencil from '../../img/iconspencil.png';
import btnStyle from './BtnAtualiza.module.css';
import { Cliente } from '../pages/service/apiCliente';

type BtnAtualizaProps = {
  cliente?: Cliente;
  onClick: () => void;
};

const BtnAtualiza: React.FC<BtnAtualizaProps> = ({ cliente, onClick }) => {
  return (
    <button accessKey='BtnAtualiza' onClick={onClick} className={btnStyle.btnAtualiza}>
      <img src={pencil} alt="pincel" style={{ width: '1rem', height: '1rem' }} />
    </button>
  );
};

export default BtnAtualiza;
