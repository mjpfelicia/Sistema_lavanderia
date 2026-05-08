import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import classes from './Formulario.module.css';
import { Cliente, buscarCliente } from '../../../service/apiCliente';
import ServicoLavagem from '../../ServicoLavagem/ServicoLavagem';

interface FormData {
  nome: string;
  telefone: string;
}

const FormularioValidacao = () => {
  const [formData, setFormData] = useState<FormData>({ nome: '', telefone: '' });
  const [erros, setErros] = useState<Partial<FormData>>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmarCadastro, setConfirmarCadastro] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validarFormulario = (): boolean => {
    const novosErros: Partial<FormData> = {};

    if (!formData.nome.trim() && !formData.telefone.trim()) {
      novosErros.nome = 'Informe nome ou telefone para continuar.';
    } else if (formData.nome.trim() && formData.nome.trim().length < 3) {
      novosErros.nome = 'O nome deve ter pelo menos 3 caracteres.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);
    setConfirmarCadastro(false);

    try {
      const result = await buscarCliente(formData.nome, formData.telefone);
      setClientes(result);

      if (result.length === 1) {
        setClienteSelecionado(result[0]);
      } else if (result.length === 0) {
        setConfirmarCadastro(true);
      }
    } catch (requestError) {
      console.error('Erro ao buscar cliente', requestError);
      if (axios.isAxiosError(requestError) && !requestError.response) {
        setError('N\u00e3o foi poss\u00edvel conectar \u00e0 base local de clientes. Inicie a API com \'npm run api\' e tente novamente.');
      } else {
        setError('Erro ao buscar cliente. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClienteSelecionado = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
  };

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
          <div className={classes.introBox}>
            <span className={classes.kicker}>{'Busca r\u00e1pida'}</span>
            <h2>Receber cliente</h2>
            <p>{'Informe nome ou telefone para localizar a ficha e seguir com o atendimento sem perder ritmo.'}</p>
          </div>

          <div className={classes.fieldsGrid}>
            <div className={classes.controle_de_campo}>
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex.: Maria Souza"
              />
              {erros.nome && <p className={classes.error}>{erros.nome}</p>}
            </div>

            <div className={classes.controle_de_campo}>
              <label htmlFor="telefone">Telefone</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                autoComplete="tel"
              />
              {erros.telefone && <p className={classes.error}>{erros.telefone}</p>}
            </div>
          </div>

          <div className={classes.inputGroupButton}>
            <button type="submit" className={classes.btn_enter} disabled={loading}>
              {loading ? 'Buscando...' : 'Continuar'}
            </button>
          </div>
        </form>
      ) : (
        <ServicoLavagem cliente={clienteSelecionado} />
      )}

      {error && <p className={classes.feedbackError}>{error}</p>}

      {!clienteSelecionado && !loading && clientes.length > 0 && (
        <div className={classes.box}>
          <div className={classes.resultHeader}>
            <strong>{'Clientes encontrados'}</strong>
            <span>{`${clientes.length} resultado(s)`}</span>
          </div>

          <ul className={classes.resultList}>
            {clientes.map((cliente, index) => (
              <li className={classes.li} key={index} onClick={() => handleClienteSelecionado(cliente)}>
                <strong>{cliente.nome}</strong>
                <span>{cliente.telefone}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {confirmarCadastro && (
        <div className={classes.confirmacao}>
          <p>{'Cliente n\u00e3o encontrado. Deseja cadastrar um novo cliente?'}</p>
          <div className={classes.btn_group}>
            <button onClick={handleCadastrarCliente} className={classes.btn_confirm}>Sim, cadastrar</button>
            <button onClick={() => setConfirmarCadastro(false)} className={classes.btn_cancel}>Voltar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormularioValidacao;
