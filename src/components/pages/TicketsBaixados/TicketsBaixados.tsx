import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import { listarClientes, Cliente } from '../../../service/apiCliente';
import BackToHome from '../../../components/buttons/BackToHome';
import './TicketsBaixados.css';

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

const TicketsBaixados: React.FC = () => {
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
        setError('Não foi possível carregar os tickets baixados. Verifique se a API local está ativa.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const clientesById = new Map(clientes.map((cliente) => [String(cliente.id), cliente]));

  // Filtra apenas tickets entregues (baixados)
  const ticketsBaixados = tickets
    .filter((ticket) => ticket.statusEntrega === 'Entregue')
    .sort((a, b) => new Date(b.dataBaixa || b.dataEntrega || '').getTime() - new Date(a.dataBaixa || a.dataEntrega || '').getTime());

  const getClienteNome = (ticket: Ticket) =>
    ticket.cliente?.nome ||
    clientesById.get(String(ticket.clienteId))?.nome ||
    'Cliente não informado';

  if (loading) {
    return (
      <div className="tickets-baixados-loading">
        <div className="spinner"></div>
        <p>Carregando tickets baixados...</p>
      </div>
    );
  }

  return (
    <div className="tickets-baixados-page">
      <header className="tickets-baixados-header">
        <div className="header-title">
          <BackToHome variant="icon" />
          <div className="header-content">
            <h1>Tickets Baixados</h1>
            <p>Tickets que já foram entregues e saíram da fila operacional</p>
          </div>
        </div>
      </header>

      <div className="tickets-baixados-content">
        {error ? <section className="tickets-baixados-alert">{error}</section> : null}

        <section className="resumo-cards">
          <article className="resumo-card destaque">
            <span>Tickets baixados</span>
            <strong>{ticketsBaixados.length}</strong>
            <small>Atendimentos finalizados</small>
          </article>
        </section>

        <section className="tabela-section">
          <div className="tabela-header">
            <h2>Lista de Tickets Baixados</h2>
          </div>

          <div className="tabela-container">
            {ticketsBaixados.length === 0 ? (
              <div className="sem-dados">Nenhum ticket baixado encontrado.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Cliente</th>
                    <th>Criado em</th>
                    <th>Data de Baixa</th>
                    <th>Pagamento</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsBaixados.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>
                        <strong>#{ticket.ticketNumber}</strong>
                      </td>
                      <td>{getClienteNome(ticket)}</td>
                      <td>{formatDate(ticket.dataCriacao)}</td>
                      <td>{formatDate(ticket.dataBaixa || ticket.dataEntrega)}</td>
                      <td>
                        <span className={`status-badge status-pago-${ticket.estaPago === 'sim' ? 'sim' : 'nao'}`}>
                          {ticket.estaPago === 'sim' ? 'Pago' : 'Pendente'}
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

export default TicketsBaixados;
