import { useState } from 'react';
import { Cliente } from '../../service/apiCliente';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../CadastroCliente/CadastroCliente.css";
import CloseButton from '../../buttons/CloseButton';
import AtualizaCliente from '../../AtualizaCliente/AtualizaCliente';
import Modal from '../../modal/modal';

interface CadastroClienteProps {
  cliente?: Cliente;
}

const CadastroCliente: React.FC<CadastroClienteProps> = ({ cliente = {} as Cliente }) => {
  const [formData, setFormData] = useState<Cliente>({ ...cliente });
  const [lista, setLista] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente>({} as Cliente);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
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
        setFormData({ ...cliente });
        alert('Cliente cadastrado com sucesso!');
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

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
      <form onSubmit={handleSubmit} className="p-4 formCadastro">
        <div className="menuCadastro">
          <CloseButton />
          <h1 className="titleCadastro">Cadastro de Cliente</h1>
        </div>
        {renderFormFields(formData, handleChange)}
        <button type="submit" className="btn btn-primary">Cadastrar</button>
      </form>
      <ul className="list-group w-100 mt-4">
        {lista.map((item, index) => (
          <li key={index} className="list-group-item">
            {item.nome} - {item.telefone} - {item.email} - {item.endereco}, {item.bairro}, {item.cep}
            <button onClick={() => { setClienteSelecionado(item); setIsModalOpen(true) }} className="btn btn-link">
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

const renderFormFields = (formData: Cliente, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
  <>
    {(['nome', 'telefone', 'email', 'endereco', 'numero', 'complemento', 'cep', 'estado', 'bairro'] as (keyof Cliente)[]).map((field, idx) => (
      <div key={idx} className="form-group formGroup mb-3">
        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
        <input
          type={field === 'email' ? 'email' : 'text'}
          className={`form-control formGroup${field.charAt(0).toUpperCase() + field.slice(1)}`}
          name={field}
          value={formData[field] as string}
          onChange={handleChange}
        />
      </div>
    ))}
  </>
);

export default CadastroCliente;
