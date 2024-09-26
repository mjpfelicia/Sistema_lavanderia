// src/components/CadastroCliente.tsx
import { useState } from 'react';
import { Cliente } from '../service/apiCliente';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../CadastroCliente/CadastroCliente.css";
import CloseButton from '../../buttons/CloseButton';
import AtualizaCliente from '../../AtualizaCliente';
import Modal from '../../modal/modal';

interface CadastroClienteProps {
    cliente?: Cliente;
}

const CadastroCliente: React.FC<CadastroClienteProps> = ({ cliente }) => {
    const clienteCopia = { ...cliente };
    const [formData, setFormData] = useState(clienteCopia);
    const [lista, setLista] = useState<Cliente[]>([]);
    const [clienteSelecionado, setClienteSelecionado] = useState<Cliente>({} as Cliente);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3008/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const novoCliente = await response.json();
                setLista([...lista, novoCliente]);
                setFormData(clienteCopia);
            } else {
                console.error('Erro ao cadastrar cliente');
            }
        } catch (error) {
            console.error('Erro ao conectar com a API', error);
        }
    };

    const handleUpdate = (clienteAtualizado: Cliente) => {
        setLista(lista.map(cliente => cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
       <form onSubmit={handleSubmit} className="p-4">
                    <div className="menuCadastro">
                        <CloseButton />
                        <h1 className="titleCadastro">Cadastro de Cliente</h1>
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>Nome completo</label>
                        <input
                            type="text"
                            className="form-control formGroupName"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>Telefone</label>
                        <input
                            type="tel"
                            maxLength={14}
                            className="form-control formGroupTelefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            placeholder="(__) _____-____"
                        />
                    </div>
                    <div className="form-group formGroup mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control formGroupEmail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>Endereço</label>
                        <input
                            type="text"
                            className="form-control"
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>Número</label>
                        <input
                            type="text"
                            className="form-control formGroupNumero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>Complemento</label>
                        <input
                            type="text"
                            className="form-control formGroupComplemento"
                            name="complemento"
                            value={formData.complemento}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>CEP</label>
                        <input
                            type="text"
                            className="form-control formGroupCep"
                            name="cep"
                            value={formData.cep}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>Estado</label>
                        <input
                            type="text"
                            className="form-control formGroupEstado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group formGroup mb-3">
                        <label>Bairro</label>
                        <input
                            type="text"
                            className="form-control formGroupBairro"
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
                </form>

            <ul className="list-group w-100 mt-4">
                {lista.map((item, index) => (
                    <li key={index} className="list-group-item">
                        {item.nome} - 
                        {item.telefone} - 
                        {item.email} - 
                        {item.endereco}, 
                        {item.bairro}, 
                        {item.cep}
                        <button onClick={() => {setClienteSelecionado(item); setIsModalOpen(true)}} className="btn btn-link">
                            Editar
                        </button>
                    </li>
                ))}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>Atualizar cliente</h2>
                <AtualizaCliente cliente={clienteSelecionado} onUpdate={handleUpdate} />
            </Modal>
        </div>
    );
};

export default CadastroCliente;
