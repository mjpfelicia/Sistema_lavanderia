// src/components/Cliente.tsx
import React from 'react';
import classes from '../DetalhesCliente/DetalhesCliente.module.css'

interface ClienteProps {
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
}

const DetalhesUsuario = ({ nome, endereco,telefone,email }:ClienteProps) => {
    return (
        <div className={classes.cliente}>
            <h2>{nome}:</h2>
            <p>{endereco}</p>
            <p>{telefone}</p>
            <p>{email}</p>
        </div>
    );
};


export default DetalhesUsuario;

