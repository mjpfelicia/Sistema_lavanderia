// src/App.tsx
import React from 'react';
import Cliente from './Cliente';
import classes from '../DetalhesUsuario/DetalhesUsuario.module.css'

const DetalhesUsuario: React.FC = () => {
    const clientes = [
        { nome: 'João Teste', endereco: 'Rua teste, 000, São Paulo, SP', telefone: '0000-000' },
        { nome: 'Maria Teste', endereco: 'Avenida teste, 000, Rio de Janeiro, RJ', telefone: '0000-000' },
        { nome: 'Carlos Teste', endereco: 'Praça Teste, 111, Belo Horizonte, MG', telefone: '0000-000' }
    ];

    return (
        <div className={classes.content}>
            <h1>Lista de Clientes</h1>
            <div className={classes.container}>
                {clientes.map((cliente, index) => (
                    <Cliente key={index} nome={cliente.nome} endereco={cliente.endereco} telefone={cliente.telefone} />
                ))}

            </div>
            <div className={classes.btnCliente}>
                <button type="submit" className={classes.registerButton}>Confirma</button>
            </div>
        </div>
    );
};

export default DetalhesUsuario;
