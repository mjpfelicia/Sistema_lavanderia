// Importando React e o módulo de estilos CSS
import React from 'react';
import btnStyle from './BtnAtualiza.module.css';
import { Cliente } from '../../service/apiCliente';
import pencil from '../../img/pencil.png';

// Definindo as propriedades aceitas pelo componente BtnAtualiza
type BtnAtualizaProps = {
  cliente?: Cliente;
  onClick: () => void;
};

// Função principal do componente BtnAtualiza
const BtnAtualiza: React.FC<BtnAtualizaProps> = ({ cliente, onClick }) => {
  return (
    <div 
      accessKey="BtnAtualiza" 
      onClick={onClick} 
      className={btnStyle.btnAtualiza}
    >
      <img 
        src={pencil} 
        alt="pincel" 
        style={{ width: '1rem', height: '1rem' }} 
      />
    </div>
  );
};


export default BtnAtualiza;
