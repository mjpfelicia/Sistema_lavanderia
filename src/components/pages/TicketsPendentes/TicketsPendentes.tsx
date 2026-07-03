import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import { listarClientes, Cliente } from '../../../service/apiCliente';
import BackToHome from '../../../components/buttons/BackToHome';
import './TicketsPendentes.css';

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

const TicketsPendentes: React.FC = () => {
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
        setError('Não foi possível carregar os tickets pendentes. Verifique se a API local está ativa.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const clientesById = new Map(clientes.map((cliente) => [String(cliente.id), cliente]));

  // Filtra apenas tickets em aberto (não entregues e não apagados)
  const ticketsPendentes = tickets
    .filter((ticket) => ticket.statusEntrega !== 'Entregue' && ticket.statusEntrega !== 'Apagado')
    .sort((a, b) => new Date(b.dataCriacao ?? '').getTime() - new Date(a.dataCriacao ?? '').getTime());

  const getClienteNome = (ticket: Ticket) =>
    ticket.cliente?.nome ||
    clientesById.get(String(ticket.clienteId))?.nome ||
    'Cliente não informado';

  if (loading) {
    return (
      <div className="tickets-pendentes-loading">
        <div className="spinner"></div>
        <p>Carregando tickets pendentes...</p>
      </div>
    );
  }

  return (
    <div className="tickets-pendentes-page">
      <header className="tickets-pendentes-header">
        <div className="header-title">
          <BackToHome variant="icon" />
          <div className="header-content">
            <h1>Tickets Pendentes</h1>
            <p>Tickets em produção que ainda não foram entregues</p>
          </div>
        </div>
      </header>

      <div className="tickets-pendentes-content">
        {error ? <section className="tickets-pendentes-alert">{error}</section> : null}

        <section className="resumo-cards">
          <article className="resumo-card destaque">
            <span>Tickets em aberto</span>
            <strong>{ticketsPendentes.length}</strong>
            <small>Pedidos na fila de produção</small>
          </article>
        </section>

        <section className="tabela-section">
          <div className="tabela-header">
            <h2>Lista de Tickets Pendentes</h2>
          </div>

          <div className="tabela-container">
            {ticketsPendentes.length === 0 ? (
              <div className="sem-dados">Nenhum ticket pendente encontrado.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Cliente</th>
                    <th>Criado em</th>
                    <th>Previsão de Entrega</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsPendentes.map((ticket) => (
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

export default TicketsPendentes;
