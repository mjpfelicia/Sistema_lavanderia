// src/components/Cliente.tsx
import React from 'react';
import classes from '../DetalhesUsuario/DetalhesUsuario.module.css'

interface ClienteProps {
    nome: string;
    endereco: string;
    telefone: string;
}

const DetalhesUsuario: React.FC<ClienteProps> = ({ nome, endereco,telefone }) => {
    return (
        <div className={classes.cliente}>
            <h2>{nome}:</h2>
            <p>{endereco}</p>
            <p>{telefone}:</p>
        </div>
    );
};


export default DetalhesUsuario;

