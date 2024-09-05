import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../CadastroCliente/CadastroCliente.css"


const CadastroForm = () => {
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        endereco: '',
        numero: '',
        complemento: '',
        estado: '',
        cep: '',
        bairro: '',
    });

    const [lista, setLista] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLista([...lista, formData]);
        setFormData({ nome: '', telefone: '', endereco: '', numero: '', complemento: '', estado: '', bairro: '', cep: '' });
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>

                <h1 className='titleCadastro'>Cadastro de cliente</h1>

                <div className="form-group, formGroup">
                    <label>Nome completo</label>
                    <input type="text" className="form-control  formGroupName" name="nome" value={formData.nome} onChange={handleChange} />
                    <div className="formGroup2 formGroupTelefone">
                        <label>Telefone:</label>
                        <input type="tel" maxlength="14" mask="(99) 99999-9999" className="form-control" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(__) _____-____" />
                    </div>
                </div>
               

                <div className="form-group formGroup">
                    <label>Endereço:</label>
                    <input type="text" className="form-control" name="endereco" value={formData.endereco} onChange={handleChange} />
                    <div className="formGroup2 formGroupNumero">
                        <label>numero:</label>
                        <input type="text" className="form-control" name="numero" value={formData.numero} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-group formGroup formGroupComplemento">
                    <label>Complemento:</label>
                    <input type="text" className="form-control" name="complemento" value={formData.complemento} onChange={handleChange} />
                    <div className="formGroup2 formGroupCep">
                        <label>CEP:</label>
                        <input type="text" className="form-control" name="cep" value={formData.cep} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group formGroup">
                    <label>Estado</label>
                    <input type="text" className="form-control  formControlEstado" name="estado" value={formData.estado} onChange={handleChange} />
                </div>
                <div className="form-group formGroup">
                    <label>Bairro:</label>
                    <input type="text" className="form-control formControlBairro" name="bairro" value={formData.bairro} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary btn_cadastra">Cadastrar</button>
            </form>
            <ul className="list-group">
                {lista.map((item, index) => (
                    <li key={index} className="list-group-item">
                        {item.nome}- {item.telefone} - {item.endereco}, {item.bairro}, {item.cep}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CadastroForm;
