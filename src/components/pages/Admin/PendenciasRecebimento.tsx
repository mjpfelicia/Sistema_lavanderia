import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BackToHome from '../../buttons/BackToHome';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import { listarClientes, Cliente } from '../../../service/apiCliente';
import './PendenciasRecebimento.css';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (value?: string) => {
  if (!value) {
    return 'Nao informado';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Nao informado';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getPendingAmount = (ticket: Ticket) => {
  if (ticket.pagamentoPendente) {
    return ticket.valorPendente ?? ticket.total;
  }

  return ticket.estaPago === 'sim' ? 0 : ticket.valorPendente ?? ticket.total;
};

const PendenciasRecebimento: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');

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
        setError('Nao foi possivel carregar as pendencias de recebimento.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();

    const interval = window.setInterval(() => {
      carregarDados();
    }, 20000);

    return () => window.clearInterval(interval);
  }, []);

  const pendencias = useMemo(() => {
    const search = busca.trim().toLowerCase();
    const clientesById = new Map(clientes.map((cliente) => [String(cliente.id), cliente]));

    return tickets
      .filter((ticket) => ticket.estaPago !== 'sim' || ticket.pagamentoPendente)
      .filter((ticket) => {
        if (!search) {
          return true;
        }

        return (
          ticket.ticketNumber.toLowerCase().includes(search) ||
          (clientesById.get(String(ticket.clienteId))?.nome || ticket.cliente?.nome || '').toLowerCase().includes(search) ||
          (ticket.statusPagamentoDescricao || '').toLowerCase().includes(search)
        );
      })
      .map((ticket) => ({
        ...ticket,
        cliente: ticket.cliente || clientesById.get(String(ticket.clienteId)),
      }))
      .sort((a, b) => getPendingAmount(b) - getPendingAmount(a));
  }, [busca, clientes, tickets]);

  const totalPendente = pendencias.reduce((acc, ticket) => acc + getPendingAmount(ticket), 0);
  const entreguesPendente = pendencias.filter((ticket) => ticket.statusEntrega === 'Entregue').length;
  const emProducao = pendencias.filter((ticket) => ticket.statusEntrega !== 'Entregue').length;

  return (
    <div className="pendencias-shell">
      <header className="pendencias-header">
        <div className="pendencias-header-main">
          <BackToHome variant="icon" />
          <div>
            <span className="pendencias-eyebrow">Financeiro</span>
            <h1>Pendencias de recebimento</h1>
            <p>Acompanhe o que ainda falta entrar no caixa e abra o ticket quando precisar conferir a baixa.</p>
          </div>
        </div>

        <Link to="/admin/financeiro" className="pendencias-link">
          Abrir fechamento de caixa
        </Link>
      </header>

      <main className="pendencias-content">
        <section className="pendencias-summary">
          <article className="pendencia-card">
            <span>Tickets pendentes</span>
            <strong>{pendencias.length}</strong>
          </article>
          <article className="pendencia-card">
            <span>Total em aberto</span>
            <strong>{formatCurrency(totalPendente)}</strong>
          </article>
          <article className="pendencia-card">
            <span>Baixados sem receber</span>
            <strong>{entreguesPendente}</strong>
          </article>
          <article className="pendencia-card">
            <span>Em producao</span>
            <strong>{emProducao}</strong>
          </article>
        </section>

        <section className="pendencias-toolbar">
          <div>
            <h2>Lista de pendencias</h2>
            <p>Filtre por numero do ticket, cliente ou status para localizar o valor em aberto.</p>
          </div>

          <label className="pendencias-search">
            <span>Buscar pendencia</span>
            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Ex.: 1024, Maria, Pendente"
            />
          </label>
        </section>

        {loading ? (
          <div className="pendencias-state">Carregando pendencias...</div>
        ) : error ? (
          <div className="pendencias-state is-error">{error}</div>
        ) : pendencias.length === 0 ? (
          <div className="pendencias-empty">
            Nenhuma pendencia encontrada. Se o ticket ja foi recebido, ele sai desta lista automaticamente.
          </div>
        ) : (
          <section className="pendencias-list">
            {pendencias.map((ticket) => {
              const pendente = getPendingAmount(ticket);
              const statusOperacional = ticket.statusEntrega === 'Entregue' ? 'Baixado' : 'Em andamento';

              return (
                <article key={ticket.id} className="pendencia-item">
                  <div className="pendencia-item-main">
                    <div>
                      <span className="pendencia-ticket">Ticket #{ticket.ticketNumber}</span>
                      <h3>{ticket.cliente?.nome || 'Cliente nao informado'}</h3>
                      <p>{ticket.statusPagamentoDescricao || 'Pendente de recebimento'}</p>
                    </div>
                    <div className="pendencia-values">
                      <strong>{formatCurrency(pendente)}</strong>
                      <span>{statusOperacional}</span>
                    </div>
                  </div>

                  <div className="pendencia-meta">
                    <span>Entrega: {formatDate(ticket.dataBaixa || ticket.dataEntrega || ticket.dataCriacao)}</span>
                    <span>Forma: {ticket.formaPagamento || 'Nao informada'}</span>
                    <span>Observacao: {ticket.observacaoBaixa || 'Sem observacao'}</span>
                  </div>

                  <div className="pendencia-actions">
                    <Link to={`/BuscarTicket/${encodeURIComponent(ticket.ticketNumber)}`} className="pendencia-action primary">
                      Abrir ticket
                    </Link>
                    <Link to="/admin/financeiro" className="pendencia-action secondary">
                      Ver fechamento
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

export default PendenciasRecebimento;
