import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { buscarCliente, Cliente } from '../../../service/apiCliente';
import classes from "../FormularioValidacao/Formulario.module.css";

interface BuscaClienteProps {
  onClienteSelecionado: (cliente: Cliente) => void;
}

const BuscaCliente: React.FC<BuscaClienteProps> = ({ onClienteSelecionado }) => {
  const [formData, setFormData] = useState({ nome: '', telefone: '' });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmarCadastro, setConfirmarCadastro] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setConfirmarCadastro(false);
    if (clientes.length) {
      setClientes([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nome = formData.nome.trim();
    const telefone = formData.telefone.trim();

    if (!nome && !telefone) {
      setError('Informe ao menos o nome ou o telefone para buscar.');
      return;
    }

    if (nome && nome.length < 3) {
      setError('Digite pelo menos 3 caracteres no nome para buscar.');
      return;
    }

    setLoading(true);
    setError(null);
    setConfirmarCadastro(false);

    try {
      const result: Cliente[] = await buscarCliente(nome, telefone);
      setClientes(result);

      if (result.length === 1) {
        onClienteSelecionado(result[0]);
        return;
      }

      if (result.length === 0) {
        setConfirmarCadastro(true);
      }
    } catch (requestError) {
      console.error('Erro ao buscar cliente no delivery', requestError);
      setError('Erro ao buscar cliente. Verifique se a API local esta ativa e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarCliente = () => {
    navigate('/CadastroCliente');
  };

  return (
    <div>
      <form className={classes.formulario} onSubmit={handleSubmit}>
        <div className={classes.controle_de_campo}>
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} />
        </div>
        <div className={classes.controle_de_campo}>
          <label htmlFor="telefone">Telefone</label>
          <input type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
        </div>
        <div className={classes.controle_de_campo}>
          <button type="submit" className={classes.btn_enter} disabled={loading}>
            {loading ? 'Buscando...' : 'Pesquisar'}
          </button>
        </div>
      </form>

      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Carregando...</span></Spinner>}
      {error && <p className={classes.error}>{error}</p>}

      {!loading && !error && confirmarCadastro && (
        <div className={classes.confirmacao}>
          <p>Cliente nao encontrado. Deseja cadastrar um novo cliente?</p>
          <div className={classes.btn_group}>
            <button onClick={handleCadastrarCliente} className={`${classes.btn_confirm} ${classes.btn}`}>Cadastrar</button>
            <button onClick={() => setConfirmarCadastro(false)} className={`${classes.btn_cancel} ${classes.btn}`}>Revisar</button>
          </div>
        </div>
      )}

      <div className={classes.box}>
        {clientes.length > 1 && (
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
