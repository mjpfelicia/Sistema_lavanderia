import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarCliente, Cliente } from '../../../service/apiCliente';
import classes from "../FormularioValidacao/Formulario.module.css";
import Spinner from 'react-bootstrap/Spinner';

interface BuscaClienteProps {
  onClienteSelecionado: (cliente: Cliente) => void;
}

const BuscaCliente: React.FC<BuscaClienteProps> = ({ onClienteSelecionado }) => {
  const [formData, setFormData] = useState({ nome: '', telefone: '' });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [confirmarCadastro, setConfirmarCadastro] = useState<boolean>(false); // Novo estado para confirmação
  const navigate = useNavigate();

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNoResults(false);
    setConfirmarCadastro(false);
    try {
      // Busca o cliente na API
      const result: Cliente[] = await buscarCliente(formData.nome, formData.telefone);
      if (result.length === 0) {
        setNoResults(true);
        setConfirmarCadastro(true);
      }
      setClientes(result);
    } catch (error) {
      setError("Erro ao buscar cliente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para redirecionar para a página de cadastro
  const handleCadastrarCliente = () => {
    setConfirmarCadastro(false); // Ocultar a confirmação de cadastro
    navigate('/CadastroCliente'); // Redirecionando para a rota de cadastro
  };

  return (
    <div>
      <form className={classes.formulario} onSubmit={handleSubmit}>
        <div className={classes.controle_de_campo}>
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className={classes.controle_de_campo}>
          <label htmlFor="telefone">Telefone:</label>
          <input type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
        </div>
        <button type="submit" className={classes.btn_enter}>Pesquisar</button>
      </form>
      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Carregando...</span></Spinner>}
      {error && <p className={classes.error}>{error}</p>}
      {!loading && !error && confirmarCadastro && (
        <div className={classes.confirmacao}>
          <p>Cliente não encontrado. Deseja cadastrar um novo cliente?</p>
          <div className={classes.btn_group}>
            <button onClick={handleCadastrarCliente} className={`${classes.btn_confirm} ${classes.btn}`}>Sim</button>
            <button onClick={() => setConfirmarCadastro(false)} className={`${classes.btn_cancel} ${classes.btn}`}>Não</button>
          </div>
        </div>

      )}
      <div className={classes.box}>
        {clientes.length > 0 && (
          <ul>
            {clientes.map((cliente) => (
              <li className={classes.li} key={cliente.id} onClick={() => onClienteSelecionado(cliente)}>
                {cliente.nome} - {cliente.telefone}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BuscaCliente;
