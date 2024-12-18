import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cliente, ClienteToCreate, atualizaCliente } from '../../service/apiCliente';
import "../AtualizaCliente/Atualiza.css";

interface AtualizaClienteProps {
    cliente: Cliente;
    onUpdate: (cliente: Cliente) => void;
}

const AtualizaCliente: React.FC<AtualizaClienteProps> = ({ cliente, onUpdate }) => {
    const [formData, setFormData] = useState(cliente);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await atualizaCliente(cliente.id, formData)
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 content-form">
            <div className="form-group mb-3">
                <label>Nome completo</label>
                <input type="text" className="form-control"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <div className="form-group mb-3">
                <label>Telefone</label>
                <input type="tel" maxLength={14} className="form-control"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(__) _____-____"
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <div className="form-group mb-3">
                <label>Email</label>
                <input type="email" className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <div className="form-group mb-3">
                <label>Endereço</label>
                <input type="text" className="form-control"
                    name="endereco"
                    value={formData.endereco.endereco}
                    onChange={handleChange}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <div className="form-group mb-3">
                <label>Número</label>
                <input type="text" className="form-control"
                    name="numero"
                    value={formData.endereco.numero}
                    onChange={handleChange}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <div className="form-group mb-3">
                <label>Complemento</label>
                <input type="text" className="form-control"
                    name="complemento"
                    value={formData.endereco.complemento}
                    onChange={handleChange}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <div className="form-group mb-3">
                <label>CEP</label>
                <input type="text" className="form-control"
                    name="cep"
                    value={formData.endereco.cep}
                    onChange={handleChange}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <div className="form-group mb-3">
                <label>Estado</label>
                <input type="text" className="form-control"
                    name="estado"
                    value={formData.endereco.estado}
                    onChange={handleChange}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                />
            </div>
            <button type="submit" className="btn btn-primary">Atualizar</button>
        </form>
    );
};

export default AtualizaCliente;
