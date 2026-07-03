import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import { listarClientes, Cliente } from '../../../service/apiCliente';
import BackToHome from '../../../components/buttons/BackToHome';
import './PecasEmAtraso.css';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (value?: string) => {
  if (!value) return 'Não informado';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'A combinar';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getToday = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const PecasEmAtraso: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError('');
        const [ticketsData, clientesData] = await Promise.all([
          listarTickets(),
          listarClientes(),
        ]);
        setTickets(ticketsData);
        setClientes(clientesData);
      } catch (requestError) {
        console.error(requestError);
        setError('Não foi possível carregar as peças em atraso. Verifique se a API local está ativa.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const clientesById = new Map(clientes.map((cliente) => [String(cliente.id), cliente]));
  const today = getToday();
  const hojeInicio = new Date(today);
  hojeInicio.setHours(0, 0, 0, 0);

  // Filtra apenas tickets em aberto com data de entrega anterior a hoje (ATRASADOS)
  const ticketsEmAtraso = tickets
    .filter((ticket) => {
      if (ticket.statusEntrega === 'Entregue' || ticket.statusEntrega === 'Apagado') return false;
      if (!ticket.dataEntrega) return false;
      const dataEntrega = new Date(ticket.dataEntrega);
      dataEntrega.setHours(0, 0, 0, 0);
      return dataEntrega < hojeInicio;
    })
    .sort((a, b) => new Date(a.dataEntrega ?? '').getTime() - new Date(b.dataEntrega ?? '').getTime());

  const getClienteNome = (ticket: Ticket) =>
    ticket.cliente?.nome ||
    clientesById.get(String(ticket.clienteId))?.nome ||
    'Cliente não informado';

  if (loading) {
    return (
      <div className="tickets-pendentes-loading">
        <div className="spinner"></div>
        <p>Carregando peças em atraso...</p>
      </div>
    );
  }

  return (
    <div className="tickets-pendentes-page">
      <header className="tickets-pendentes-header">
        <div className="header-title">
          <BackToHome variant="icon" />
          <div className="header-content">
            <h1>Peças em Atraso</h1>
            <p>Tickets com data de entrega vencida que precisam de atenção imediata</p>
          </div>
        </div>
      </header>

      <div className="tickets-pendentes-content">
        {error ? <section className="tickets-pendentes-alert">{error}</section> : null}

        <section className="resumo-cards">
          <article className="resumo-card destaque">
            <span>Peças em atraso</span>
            <strong>{ticketsEmAtraso.length}</strong>
            <small>Entregas vencidas que precisam de ação</small>
          </article>
        </section>

        <section className="tabela-section">
          <div className="tabela-header">
            <h2>Lista de Peças em Atraso</h2>
          </div>

          <div className="tabela-container">
            {ticketsEmAtraso.length === 0 ? (
              <div className="sem-dados">Nenhuma peça em atraso encontrada.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Cliente</th>
                    <th>Criado em</th>
                    <th>Previsão de Entrega (Vencida)</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsEmAtraso.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <strong>#{ticket.ticketNumber}</strong>
                      </td>
                      <td>{getClienteNome(ticket)}</td>
                      <td>{formatDate(ticket.dataCriacao)}</td>
                      <td>{formatDate(ticket.dataEntrega)}</td>
                      <td>
                        <span className={`status-badge status-${ticket.statusEntrega?.toLowerCase().replace(' ', '-') || 'producao'}`}>
                          {ticket.statusEntrega || 'Em produção'}
                        </span>
                      </td>
                      <td>{formatCurrency(ticket.total)}</td>
                      <td>
                        <Link to={`/BuscarTicket/${ticket.ticketNumber}`} className="btn-ver">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PecasEmAtraso;
