// src/components/Cliente.tsx
import React from 'react';
import classes from '../DetalhesCliente/DetalhesCliente.module.css';
import btnStyle from '../../buttons/BtnAtualiza.module.css';
import pencil from '../../../img/iconspencil.png';
import Bin from '../../../img/iconsbin-.png'


interface ClienteProps {
  key: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  BtnAtualizar: boolean;
  BtnDeletar: boolean;
  onClick: () => void;
}


const Cliente: React.FC<ClienteProps> = ({ key, nome, endereco, telefone, email, BtnAtualizar, BtnDeletar, onClick }) => {
  return (
    <div className={classes.whapper}>
      <div className={classes.cliente}>
        <h2>{nome}</h2>
        <p>{endereco}</p>
        <p>{telefone}</p>
        <p>{email}</p>
      </div>
      <div className={classes.btnAtualiza}>
        {BtnAtualizar && <button className={btnStyle.btnAtualiza}
          onClick={onClick}>
          <img src={pencil} alt="pincel" style={{ width: '1rem', height: '1rem' }} />
        </button>}

        {BtnDeletar && <button className={btnStyle.btnAtualiza}>
          <img src={Bin} alt="pincel" style={{ width: '1rem', height: '1rem', color: 'blue' }} />
        </button>}
      </div>

    </div>
  );
};


export default Cliente;


