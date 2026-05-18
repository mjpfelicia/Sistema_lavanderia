import React, { useEffect, useState } from 'react';
import ClienteUnico from './Cliente';
import classes from './DetalhesCliente.module.css';
import { listarClientes, Cliente } from '../../../service/apiCliente';

const DetalhesUsuario: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const clientes = await listarClientes();
                console.log('Clientes recebidos:', clientes);
                setClientes(clientes);
                setLoading(false);
            } catch (error: unknown) {
                setClientes([]);
                setError("Erro ao buscar clientes");
                setLoading(false);

                if (error instanceof Error) {
                    console.error("[ERROR] listarClientes:", error.message);
                } else {
                    console.error("[ERROR] listarClientes: Erro desconhecido");
                }
            }
        };
        fetchClientes();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={classes.content}>
            <section className={classes.heroPanel}>
                <span className={classes.eyebrow}>Gestão de Clientes</span>
                <h1>Lista de Clientes</h1>
                <p>
                    Visualize e gerencie todos os clientes cadastrados no sistema. 
                    Clique em um cliente para ver detalhes completos ou editar informações.
                </p>
            </section>

            <section className={classes.searchSurface}>
                <div className='col-xs-12'>
                    <div className={classes.box}>
                        {clientes.length > 0 ? (
                            clientes.map((cliente) => (
                                <ClienteUnico
                                    key={cliente.id}
                                    cliente={cliente}
                                    onEdit={(cliente: Cliente) => {
                                        console.log("Editar cliente", { cliente });
                                    }}
                                />
                            ))
                        ) : (
                            <div className={classes.emptyState}>
                                <p>Nenhum cliente encontrado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DetalhesUsuario;
