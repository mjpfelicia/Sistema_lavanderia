// dependências necessárias
import { useState } from 'react';
import { Cliente } from '../../service/apiCliente';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../CadastroCliente/CadastroCliente.css";
import CloseButton from '../../buttons/CloseButton';
import AtualizaCliente from '../../AtualizaCliente/AtualizaCliente';
import Modal from '../../modal/modal';

// Definindo as propriedades aceitas pelo componente CadastroCliente
interface CadastroClienteProps {
  cliente?: Cliente;
}

// Função principal do componente CadastroCliente
const CadastroCliente: React.FC<CadastroClienteProps> = ({ cliente = {} as Cliente }) => {
  // Declarando estados para o formulário, lista de clientes, cliente selecionado e visibilidade do modal
  const [formData, setFormData] = useState<Cliente>({ ...cliente });
  const [lista, setLista] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente>({} as Cliente);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Função para lidar com o envio do formulário
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

  // Função para lidar com a atualização do cliente na lista
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

// Função para renderizar os campos do formulário dinamicamente
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
