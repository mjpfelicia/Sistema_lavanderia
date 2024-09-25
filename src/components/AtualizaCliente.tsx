// src/components/AtualizaCliente.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cliente } from './pages/service/apiCliente';

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
        try {
            const response = await fetch(`http://localhost:3008/clientes/${cliente.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const clienteAtualizado = await response.json();
                onUpdate(clienteAtualizado);
            } else {
                console.error('Erro ao atualizar cliente');
            }
        } catch (error) {
            console.error('Erro ao conectar com a API', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="form-group mb-3">
                <label>Nome completo</label>
                <input type="text" className="form-control"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label>Telefone</label>
                <input type="tel" maxLength={14} className="form-control"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(__) _____-____"
                />
            </div>
            <div className="form-group mb-3">
                <label>Email</label>
                <input type="email" className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                />
            </div>
            <div className="form-group mb-3">
                <label>Endereço</label>
                <input type="text" className="form-control"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label>Número</label>
                <input type="text" className="form-control"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label>Complemento</label>
                <input type="text" className="form-control"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label>CEP</label>
                <input type="text" className="form-control"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label>Estado</label>
                <input type="text" className="form-control"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group mb-3">
                <label>Bairro</label>
                <input type="text"
                    className="form-control"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">Atualizar</button>
        </form>
    );
};

export default AtualizaCliente;
