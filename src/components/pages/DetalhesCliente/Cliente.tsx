
import React from 'react';
import classes from '../DetalhesCliente/DetalhesCliente.module.css';
import btnStyle from '../../buttons/BtnAtualiza.module.css';
import Bin from '../../../img/iconsbin-.png';
import BtnAtualiza from '../../buttons/BtnAtualizar';
import { Cliente as ClienteInterface } from '../service/apiCliente';

interface ClienteProps {
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  numero: string;
  onEdit: (cliente: ClienteInterface) => void;
}

const Cliente: React.FC<ClienteProps> = ({ nome, endereco, telefone, email, numero, onEdit }) => {
  const cliente: Partial<ClienteInterface> = {
    nome,
    endereco,
    telefone,
    email,
    numero,
    complemento: '',
    estado: '',
    cep: '',
    bairro: ''
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.cliente}>
        <h2>{nome}</h2>
        <p>{endereco}</p>
        <p>{numero}</p>
        <p>{telefone}</p>
        <p>{email}</p>
      </div>
      <div className={classes.btnAtualiza}>
        <button className={btnStyle.btnAtualiza} onClick={() => onEdit(cliente as ClienteInterface)}>
          Editar
        </button>
        {/* <button className={btnStyle.btnAtualiza}>
          <img src={Bin} alt="Excluir" style={{ width: '1rem', height: '1rem' }} />
        </button> */}
      </div>
    </div>
  );
};

export default Cliente;
