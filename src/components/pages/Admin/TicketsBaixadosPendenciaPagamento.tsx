
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BackToHome from '../../buttons/BackToHome';
import { isTicketBaixado, listarTickets, Ticket } from '../../../service/apiTicket';
import { listarClientes, Cliente } from '../../../service/apiCliente';
import './TicketsBaixadosPendenciaPagamento.css';


const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (value?: string) => {
  if (!value) {
    return 'Não informado';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Não informado';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
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

const getClientName = (ticket: Ticket, clientesById: Map<string, Cliente>) => {
  const embeddedName = ticket.cliente?.nome?.trim();
  if (embeddedName) {
    return embeddedName;
  }

  const matchedName = clientesById.get(String(ticket.clienteId))?.nome?.trim();
  if (matchedName) {
    return matchedName;
  }

  return 'Cliente não informado';
};

const TicketsBaixadosPendenciaPagamento: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'todos' | 'hoje' | 'semana' | 'mes'>('todos');

  const clientesById = useMemo(
    () => new Map(clientes.map((cliente) => [String(cliente.id), cliente])),
    [clientes],
  );

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
        setError('Não foi possível carregar os tickets com pendência de pagamento.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();

    const interval = window.setInterval(() => {
      carregarDados();
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const ticketsComPendencia = useMemo(() => {
    const search = busca.trim().toLowerCase();
    const agora = new Date();

    return tickets
      // Filtrar apenas tickets baixados (entregues)
      .filter((ticket) => isTicketBaixado(ticket))
      // Filtrar apenas tickets com pendência de pagamento
      .filter((ticket) => ticket.estaPago !== 'sim' || ticket.pagamentoPendente)
      // Excluir tickets apagados
      .filter((ticket) => ticket.statusEntrega !== 'Apagado')
      // Aplicar filtro de período
      .filter((ticket) => {
        if (filtroPeriodo === 'todos') {
          return true;
        }

        const dataBaixa = new Date(ticket.dataBaixa || ticket.dataEntrega || ticket.dataCriacao || 0);
        const diffTime = agora.getTime() - dataBaixa.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);

        if (filtroPeriodo === 'hoje') {
          return diffDays < 1;
        }

        if (filtroPeriodo === 'semana') {
          return diffDays <= 7;
        }

        if (filtroPeriodo === 'mes') {
          return diffDays <= 30;
        }

        return true;
      })
      // Aplicar filtro de busca
      .filter((ticket) => {
        if (!search) {
          return true;
        }

        return (
          ticket.ticketNumber.toLowerCase().includes(search) ||
          getClientName(ticket, clientesById).toLowerCase().includes(search) ||
          (ticket.formaPagamento || '').toLowerCase().includes(search)
        );
      })
      .sort((a, b) => {
        const dataA = new Date(a.dataBaixa || a.dataEntrega || 0).getTime();
        const dataB = new Date(b.dataBaixa || b.dataEntrega || 0).getTime();
        return dataB - dataA;
      });
  }, [busca, clientes, tickets, filtroPeriodo]);

  const totalPendente = ticketsComPendencia.reduce((acc, ticket) => acc + getPendingAmount(ticket), 0);
  const quantidadePendente = ticketsComPendencia.length;

  const ticketsPorDia = useMemo(() => {
    const agrupamento = new Map<string, { tickets: Ticket[]; total: number }>();

    ticketsComPendencia.forEach((ticket) => {
      const dataBaixa = ticket.dataBaixa || ticket.dataEntrega || ticket.dataCriacao || '';
      const dia = dataBaixa ? new Date(dataBaixa).toLocaleDateString('pt-BR') : 'Data não informada';

      const atual = agrupamento.get(dia) || { tickets: [], total: 0 };
      atual.tickets.push(ticket);
      atual.total += getPendingAmount(ticket);
      agrupamento.set(dia, atual);
    });

    return Array.from(agrupamento.entries()).sort((a, b) => {
      const [diaA] = a;
      const [diaB] = b;
      return new Date(diaB).getTime() - new Date(diaA).getTime();
    });
  }, [ticketsComPendencia]);

  return (
    <div className="tickets-baixados-pendencia-shell">
      <header className="tickets-baixados-pendencia-header">
        <div className="tickets-baixados-pendencia-header-main">
          <BackToHome variant="icon" />
          <div>
            <span className="tickets-baixados-pendencia-eyebrow">Financeiro</span>
            <h1>Tickets Baixados com Pendência de Pagamento</h1>
            <p>Relatório de tickets que já foram entregues (baixados) mas ainda estão com pagamento pendente.</p>
          </div>
        </div>

        <Link to="/admin/pendencias-recebimento" className="tickets-baixados-pendencia-link">
          Ver todas as pendências
        </Link>
      </header>

      <main className="tickets-baixados-pendencia-content">
        <section className="tickets-baixados-pendencia-summary">
          <article className="tickets-baixados-pendencia-card destaque">
            <span>Tickets baixados pendentes</span>
            <strong>{quantidadePendente}</strong>
          </article>
          <article className="tickets-baixados-pendencia-card">
            <span>Total em aberto</span>
            <strong>{formatCurrency(totalPendente)}</strong>
          </article>
          <article className="tickets-baixados-pendencia-card">
            <span>Média por ticket</span>
            <strong>{quantidadePendente > 0 ? formatCurrency(totalPendente / quantidadePendente) : 'R$ 0,00'}</strong>
          </article>
        </section>

        <section className="tickets-baixados-pendencia-toolbar">
          <div>
            <h2>Filtros</h2>
            <p>Filtre por período e busque por número do ticket ou cliente.</p>
          </div>

          <div className="tickets-baixados-pendencia-filters">
            <label className="tickets-baixados-pendencia-periodo">
              <span>Período</span>
              <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value as any)}>
                <option value="todos">Todos</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Últimos 7 dias</option>
                <option value="mes">Últimos 30 dias</option>
              </select>
            </label>

            <label className="tickets-baixados-pendencia-search">
              <span>Buscar</span>
              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Ex.: 1024, Maria, Dinheiro"
              />
            </label>
          </div>
        </section>

        {loading ? (
          <div className="tickets-baixados-pendencia-state">Carregando tickets...</div>
        ) : error ? (
          <div className="tickets-baixados-pendencia-state is-error">{error}</div>
        ) : ticketsComPendencia.length === 0 ? (
          <div className="tickets-baixados-pendencia-empty">
            <div className="empty-icon">✅</div>
            <h3>Nenhuma pendência encontrada</h3>
            <p>Todos os tickets baixados estão com pagamento em dia ou não há tickets entregues com pendência.</p>
          </div>
        ) : (
          <>
            <section className="tickets-baixados-pendencia-list">
              {ticketsComPendencia.map((ticket) => {
                const pendente = getPendingAmount(ticket);

                return (
                  <article key={ticket.id} className="tickets-baixados-pendencia-item">
                    <div className="tickets-baixados-pendencia-item-main">
                      <div>
                        <span className="tickets-baixados-pendencia-ticket">Ticket #{ticket.ticketNumber}</span>
                        <h3>{getClientName(ticket, clientesById)}</h3>
                        <p className="tickets-baixados-pendencia-obs">
                          {ticket.observacaoBaixa || 'Sem observação na baixa'}
                        </p>
                      </div>
                      <div className="tickets-baixados-pendencia-values">
                        <strong className="valor-pendente">{formatCurrency(pendente)}</strong>
                        <span className="data-baixa">Baixa: {formatDate(ticket.dataBaixa || ticket.dataEntrega)}</span>
                      </div>
                    </div>

                    <div className="tickets-baixados-pendencia-meta">
                      <div className="meta-item">
                        <span className="meta-label">Forma de pagamento</span>
                        <span className="meta-value">{ticket.formaPagamento || 'Não informada'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Status do pagamento</span>
                        <span className={`status-badge ${ticket.pagamentoPendente ? 'status-pendente' : 'status-a-receber'}`}>
                          {ticket.pagamentoPendente ? 'Pendente' : 'A receber'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Valor total</span>
                        <span className="meta-value">{formatCurrency(ticket.total)}</span>
                      </div>
                    </div>

                    <div className="tickets-baixados-pendencia-actions">
                      <Link to={`/BuscarTicket/${encodeURIComponent(ticket.ticketNumber)}`} className="tickets-baixados-pendencia-action primary">
                        Abrir ticket
                      </Link>
                      <Link to="/admin/financeiro" className="tickets-baixados-pendencia-action secondary">
                        Registrar pagamento
                      </Link>
                    </div>
                  </article>
                );
              })}
            </section>

            {ticketsPorDia.length > 1 && (
              <section className="tickets-baixados-pendencia-agrupado">
                <h2>Agrupado por dia</h2>
                <div className="tickets-baixados-pendencia-grupo">
                  {ticketsPorDia.map(([dia, dados]) => (
                    <div key={dia} className="grupo-item">
                      <div className="grupo-header">
                        <strong>{dia}</strong>
                        <span>{dados.tickets.length} ticket(s)</span>
                        <strong className="grupo-total">{formatCurrency(dados.total)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TicketsBaixadosPendenciaPagamento;
