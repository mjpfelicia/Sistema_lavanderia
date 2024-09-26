import React, { useState } from 'react';
import classes from "./Formulario.module.css";
import { Cliente, buscarCliente } from '../service/apiCliente';
import ClienteComponent from '../DetalhesCliente/Cliente';

interface FormData {
    nome: string;
    telefone: string;
    senha: string;
}

const FormularioValidacao = () => {
    const [formData, setFormData] = useState<FormData>({ nome: '', telefone: '', senha: '' });
    const [erros, setErros] = useState<Partial<FormData>>({});
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [showDetails, setShowDetails] = useState<boolean>(false);

    const validarFormulario = (): boolean => {
        const novosErros: Partial<FormData> = {};

        if (formData.nome.length < 3) {
            novosErros.nome = "O nome deve ter pelo menos 3 caracteres.";
        }

        const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
        if (!telefoneRegex.test(formData.telefone)) {
            novosErros.telefone = "O telefone deve estar no formato (XX)XXXX-XXXX";
        }

        if (formData.senha.length < 4) {
            novosErros.senha = "A senha deve ter pelo menos 4 caracteres.";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validarFormulario()) {
            const result = await buscarCliente(formData.nome, formData.telefone);
            setClientes(result);
            setShowDetails(true);
        } else {
            setShowDetails(false);
        }
    };

    return (
        <>
            <form className={classes.formulario} onSubmit={handleSubmit}>
                <div className={classes.controle_de_campo}>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                    {erros.nome && <p>{erros.nome}</p>}
                </div>
                <div className={classes.controle_de_campo}>
                    <label htmlFor="telefone">Telefone:</label>
                    <input type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX)XXXX-XXXX" required />
                    {erros.telefone && <p>{erros.telefone}</p>}
                </div>
                <div className={classes.passwordInput}>
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required />
                    {erros.senha && <p className={classes.error}>{erros.senha}</p>}
                </div>
                <div className={classes.inputGroupButton}>
                    <button type="submit" className={classes.btn_enter}>Pesquisa</button>
                </div>
            </form>

            {showDetails && (
                <div className={classes.box}>
                    {clientes.map((cliente, index) => (
                        <ClienteComponent
                            key={index}
                            cliente={cliente}
                            onEdit={() => console.info("onEdit Formulário")}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default FormularioValidacao;
