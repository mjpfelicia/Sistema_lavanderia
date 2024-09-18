// src/components/Cliente.tsx
import React from 'react';
import classes from '../DetalhesCliente/DetalhesCliente.module.css';
import btnStyle from '../../buttons/BtnAtualiza.module.css'


  interface ClienteProps {
      key: number;
      nome: string;
      endereco: string;
      telefone: string;
      email: string;
      BtnAtualizar: boolean;
      onClick: () => void;
    }
    
  
    const Cliente: React.FC<ClienteProps> = ({ key, nome, endereco, telefone, email, BtnAtualizar, onClick }) => {
      return (
        <div className={classes.cliente}>
          <h2>{nome}</h2>
          <p>{endereco}</p>
          <p>{telefone}</p>
          <p>{email}</p>
          {BtnAtualizar && <button className={btnStyle.btnAtualiza } onClick={onClick}>Atualizar</button>}
        </div>
      );
    };
  
  
  export default Cliente;
  

