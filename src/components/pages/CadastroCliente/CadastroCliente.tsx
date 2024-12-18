import { useState } from 'react';
import { ClienteToCreate, Cliente, criarCliente } from '../../../service/apiCliente';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../CadastroCliente/CadastroCliente.css";
import CloseButton from '../../buttons/CloseButton';
import AtualizaCliente from '../../AtualizaCliente/AtualizaCliente';
import Modal from '../../modal/modal';

// Definindo as propriedades aceitas pelo componente CadastroCliente
interface CadastroClienteProps {
  cliente?: ClienteToCreate;
}

interface ClienteFormCadastro {
  bairro: string;
  cep: string;
  complemento: string;
  email: string;
  endereco: string;
  estado: string;
  nome: string;
  numero: string;
  telefone: string;
}

// Função principal do componente CadastroCliente
const CadastroCliente: React.FC<CadastroClienteProps> = ({ cliente = {} as ClienteToCreate }) => {
  // Declarando estados para o formulário, lista de clientes, cliente selecionado e visibilidade do modal
  const [formData, setFormData] = useState<ClienteFormCadastro>({} as ClienteFormCadastro);
  const [lista, setLista] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente>({} as Cliente);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ClienteToCreate, string>>>({});

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Função para validar os campos do formulário
  const validateFields = () => {
    const newErrors: Partial<Record<keyof ClienteFormCadastro, string>> = {};
    (['nome', 'telefone', 'email', 'endereco', 'numero', 'cep', 'estado', 'bairro'] as (keyof ClienteFormCadastro)[]).forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    console.log("criar cliente: ", { formData });

    const clienteToCreate: ClienteToCreate = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      endereco: {
        endereco: formData.endereco,
        numero: formData.numero,
        estado: formData.estado,
        cep: formData.cep,
        bairro: formData.bairro,
        complemento: formData.complemento
      }
    }

    console.log({ clienteToCreate });

    await criarCliente(clienteToCreate)
      .catch(error => console.error({ error }));

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
        {renderFormFields(formData, handleChange, errors)}
        <button type="submit" className="btn btn-primary">Cadastrar</button>
      </form>
      <ul className="list-group w-100 mt-4">
        {lista.map((item) => (
          <li key={item.id} className="list-group-item">
            {item.nome} - {item.telefone} - {item.email} - {item.endereco.endereco}, {item.endereco.bairro}, {item.endereco.cep}
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
const renderFormFields = (formData: ClienteFormCadastro, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, errors: Partial<Record<keyof Cliente, string>>) => (
  <>
    {(['nome', 'telefone', 'email', 'endereco', 'numero', 'complemento', 'cep', 'estado', 'bairro'] as (keyof ClienteToCreate)[]).map((field) => (
      <div key={field} className="form-group formGroup mb-3">
        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
        <input
          type={field === 'email' ? 'email' : 'text'}
          className={`form-control formGroup${field.charAt(0).toUpperCase() + field.slice(1)} ${errors[field] ? 'is-invalid' : ''}`}
          name={field}
          value={formData[field] as string}
          onChange={handleChange}
        />
        {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
      </div>
    ))}
  </>
);

export default CadastroCliente;
