import React, { useEffect, useState } from 'react';
import ClienteUnico from './Cliente';
import classes from '../DetalhesCliente/DetalhesCliente.module.css';
import { listarClientes, Cliente } from '../service/apiCliente';
import AtualizaCliente from '../../AtualizaCliente';

const DetalhesUsuario: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);



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
            <h1 className={classes.title}>Lista de Clientes</h1>

            <div className='col-xs-12'>
                <div className={classes.box}>

                    {clientes.map((cliente, index) => (
                        <ClienteUnico
                            key={index}
                            nome={cliente.nome}
                            endereco={cliente.endereco}
                            numero={cliente.numero}
                            telefone={cliente.telefone}
                            email={cliente.email}
                            onEdit={function (cliente: Cliente): void {
                                throw new Error('Function not implemented.');
                            }}

                        />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default DetalhesUsuario;
