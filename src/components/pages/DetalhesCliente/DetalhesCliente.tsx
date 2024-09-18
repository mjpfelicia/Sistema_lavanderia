// src/App.tsx
import React, { useEffect, useState } from 'react';
import * as ClienteUnico from './Cliente';
import classes from '../DetalhesCliente/DetalhesCliente.module.css'
import { listarClientes, Cliente } from '../service/apiCliente';

const DetalhesUsuario: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    //   BtnAtualizar
    const handleRefresh = () => {
        window.location.reload();
    }

    useEffect(() => {
        const fetchClientes = async () => {
            await listarClientes()
                .then((cliente) => setClientes(cliente))
                .catch(error => {
                    setClientes([]);
                    console.log("[ERROR] getCliente2:", error.message);
                });
        };

        fetchClientes();
    }, []);

    return (
        <div className={classes.content}>
            <h1 className={classes.title} >Lista de Clientes</h1>
            <div className={classes.container}>
                {clientes.map((cliente, index) => (
                    <><ClienteUnico.default key={index} nome={cliente.nome} endereco={cliente.endereco} telefone={cliente.telefone} email={cliente.email} BtnAtualizar onClick={handleRefresh} />
                    </>

                ))}

            </div>
            <div className={classes.btnCliente}>
                <button type="submit" className={classes.registerButton}>Confirma</button>
            </div>
        </div>
    );
};

export default DetalhesUsuario;

