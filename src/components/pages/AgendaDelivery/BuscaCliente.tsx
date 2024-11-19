import React, { useState } from 'react';
import { buscarCliente, Cliente } from '../../service/apiCliente';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNoResults(false);
    try {
      const result: Cliente[] = await buscarCliente(formData.nome, formData.telefone);
      if (result.length === 0) {
        setNoResults(true);
      }
      setClientes(result);
    } catch (error) {
      setError("Erro ao buscar cliente. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
      {error && <p className={classes.msgError}>{error}</p>}
      {!loading && !error && noResults && <p className={classes.noResults}>Nenhum cliente encontrado.</p>}
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
