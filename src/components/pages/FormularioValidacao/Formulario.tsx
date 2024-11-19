import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from "./Formulario.module.css";
import { Cliente, buscarCliente } from '../../service/apiCliente';
import ServicoLavagem from '../../ServicoLavagem/ServicoLavagem';

interface FormData {
  nome: string;
  telefone: string;
  senha: string;
}

const FormularioValidacao = () => {
  const [formData, setFormData] = useState<FormData>({ nome: '', telefone: '', senha: '' });
  const [erros, setErros] = useState<Partial<FormData>>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nenhumClienteEncontrado, setNenhumClienteEncontrado] = useState<boolean>(false);
  const [confirmarCadastro, setConfirmarCadastro] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função para validar os dados do formulário
  const validarFormulario = (): boolean => {
    const novosErros: Partial<FormData> = {};
    if (formData.nome.length < 3) {
      novosErros.nome = "O nome deve ter pelo menos 3 caracteres.";
    }
    if (formData.senha.length < 4) {
      novosErros.senha = "A senha deve ter pelo menos 4 caracteres.";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para lidar com mudanças nos inputs do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validarFormulario()) {
      setLoading(true);
      setNenhumClienteEncontrado(false);
      setError(null);
      try {
        const result = await buscarCliente(formData.nome, formData.telefone);
        console.log('Resultado da API:', result);
        setClientes(result);
        if (result.length === 1) {
          setClienteSelecionado(result[0]);
        } else if (result.length === 0) {
          setNenhumClienteEncontrado(true);
          setConfirmarCadastro(true);
        }
      } catch (error) {
        console.error("Erro ao buscar cliente", error);
        setError("Erro ao buscar cliente. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para lidar com a seleção de cliente
  const handleClienteSelecionado = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
  };

  // Função para navegar para o cadastro de cliente
  const handleCadastrarCliente = () => {
    navigate('/CadastroCliente');
  };

  useEffect(() => {
    console.log('Clientes atualizados:', clientes);
  }, [clientes]);

  return (
    <>
      {!clienteSelecionado ? (
        <form className={classes.formulario} onSubmit={handleSubmit}>
          <div className={classes.controle_de_campo}>
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            {erros.nome && <p className={classes.error}>{erros.nome}</p>}
          </div>

          <div className={classes.controle_de_campo}>
            <label htmlFor="telefone">Telefone:</label>
            <input type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" required autoComplete="tel" />
            {erros.telefone && <p className={classes.error}>{erros.telefone}</p>}
          </div>

          <div className={classes.passwordInput}>
            <label htmlFor="senha">Senha:</label>
            <input type="password" autoComplete="current-password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required />
            {erros.senha && <p className={classes.error}>{erros.senha}</p>}
          </div>
          <div className={classes.inputGroupButton}>
            <button type="submit" className={classes.btn_enter}>Pesquisar</button>
          </div>
        </form>
      ) : (
        <ServicoLavagem cliente={clienteSelecionado} />
      )}
      {loading && <p>Carregando...</p>}
      {error && <p className={classes.error}>{error}</p>}
      {!clienteSelecionado && !loading && (
        <div className={classes.box}>
          {clientes.length > 0 ? (
            <ul>
              {clientes.map((cliente, index) => (
                <li className={classes.li} key={index} onClick={() => handleClienteSelecionado(cliente)}>
                  {cliente.nome} - {cliente.telefone}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
      {confirmarCadastro && (
        <div className={classes.confirmacao}>
          <p>Cliente não encontrado. Deseja cadastrar um novo cliente?</p>
          <div className={classes.btn_group}>
            <button onClick={handleCadastrarCliente} className={classes.btn_confirm}>Sim</button>
            <button onClick={() => setConfirmarCadastro(false)} className={classes.btn_cancel}>Não</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormularioValidacao;
