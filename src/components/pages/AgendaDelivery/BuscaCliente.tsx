import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { buscarCliente, Cliente } from '../../../service/apiCliente';
import classes from './AgendaDelivery.module.css';

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
    <div className={classes.deliverySearch}>
      <div className={classes.deliverySearchIntro}>
        <span className={classes.eyebrow}>Etapa inicial</span>
        <h2>Localize quem vai receber ou enviar as peças</h2>
        <p>Busque pelo nome ou WhatsApp. Você poderá confirmar a entrega, retirada e os tickets no próximo passo.</p>
      </div>

      <form className={classes.deliverySearchForm} onSubmit={handleSubmit}>
        <div className={classes.controle_de_campo}>
          <label htmlFor="nome">Nome do cliente</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex.: Maria Silva" />
        </div>
        <div className={classes.controle_de_campo}>
          <label htmlFor="telefone">Telefone ou WhatsApp</label>
          <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
        </div>
        <button type="submit" className={classes.btn_enter} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar cliente'}
        </button>
      </form>

      {loading && <div className={classes.deliveryLoading}><Spinner animation="border" role="status"><span className="visually-hidden">Carregando...</span></Spinner><span>Buscando clientes...</span></div>}
      {error && <p className={classes.error}>{error}</p>}

      {!loading && !error && confirmarCadastro && (
        <div className={classes.deliveryEmptyState}>
          <h3>Cliente não encontrado</h3>
          <p>Não localizamos uma ficha com esses dados. Você pode cadastrar o cliente agora e voltar para o agendamento.</p>
          <div className={classes.deliverySearchActions}>
            <button type="button" onClick={handleCadastrarCliente} className={classes.btn_enter}>Cadastrar cliente</button>
            <button type="button" onClick={() => setConfirmarCadastro(false)} className={classes.secondaryButton}>Revisar busca</button>
          </div>
        </div>
      )}

      <div className={classes.deliveryResults}>
        {clientes.length > 1 && (
          <>
            <div className={classes.deliveryResultsHeader}><strong>Clientes encontrados</strong><span>{clientes.length} opções</span></div>
            <ul className={classes.deliveryResultsList}>
            {clientes.map((cliente) => (
              <li key={cliente.id}>
                <button type="button" className={classes.deliveryResultItem} onClick={() => onClienteSelecionado(cliente)}>
                  <strong>{cliente.nome}</strong>
                  <span>{cliente.telefone || 'Telefone não informado'}</span>
                  <small>Selecionar para agendar</small>
                </button>
              </li>
            ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default BuscaCliente;
