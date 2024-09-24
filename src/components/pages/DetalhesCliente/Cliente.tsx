// src/components/Cliente.tsx
import React from 'react';
import classes from '../DetalhesCliente/DetalhesCliente.module.css';
import btnStyle from '../../buttons/BtnAtualiza.module.css';

import Bin from '../../../img/iconsbin-.png'
import BtnAtualiza from '../../buttons/BtnAtualizar';
import { Cliente as ClienteInterface } from '../service/apiCliente';


interface ClienteProps {
  key: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
}


const Cliente: React.FC<ClienteProps> = ({ nome, endereco, telefone, email }) => {

  const cliente: Partial<ClienteInterface> = {
    nome,
    endereco,
    telefone,
    email,
    numero: '',
    complemento: '',
    estado: '',
    cep: '',
    bairro: ''
  }
  return (
    <div className={classes.whapper}>
      <div className={classes.cliente}>
        <h2>{nome}</h2>
        <p>{endereco}</p>
        <p>{telefone}</p>
        <p>{email}</p>
      </div>
      <div className={classes.btnAtualiza}>
        <BtnAtualiza cliente={undefined}></BtnAtualiza>

        {/* {BtnAtualizar && <button className={btnStyle.btnAtualiza}
          onClick={onClick}>
          <img src={pencil} alt="pincel" style={{ width: '1rem', height: '1rem' }} />
        </button>} */}

        <button className={btnStyle.btnAtualiza}>
          <img src={Bin} alt="pincel" style={{ width: '1rem', height: '1rem', color: 'blue' }} />
        </button>
      </div>

    </div>
  );
};


export default Cliente;


