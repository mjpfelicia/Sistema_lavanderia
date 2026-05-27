import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageFrame from '../../layouts/PageFrame';
import { listarClientes, Cliente } from '../../../service/apiCliente';
import { listarDelivery, Delivery } from '../../../service/apiDelivery';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import './Relatorio.css';

type BoardEntry = {
  id: string;
  tipo: 'Entrega' | 'Retirada';
  horario: string;
  horarioOrdenacao: number;
  clienteNome: string;
  telefone: string;
  endereco: string;
  tickets: string[];
  totalPecas: number;
  status: string;
  descricao: string;
};

const getToday = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const formatAddress = (cliente?: Cliente) =>
  cliente
    ? [
        cliente.endereco.endereco,
        cliente.endereco.numero,
        cliente.endereco.complemento,
        cliente.endereco.bairro,
      ]
        .filter(Boolean)
        .join(', ')
    : 'Endereco nao informado';

const formatHour = (value?: string) => {
  if (!value) {
    return 'Sem horario';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Sem horario';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const isSameDay = (value: string | undefined, selectedDate: string) => {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return localDate === selectedDate;
};

const getDeliveryTicketNumbers = (delivery: Delivery) => {
  if (Array.isArray(delivery.ticketNumbers) && delivery.ticketNumbers.length > 0) {
    return delivery.ticketNumbers;
  }

  if (delivery.ticketNumber) {
    return delivery.ticketNumber
      .split(',')
      .map((item) => item.replace('#', '').trim())
      .filter(Boolean);
  }

  return [];
};

const getTicketPieceCount = (ticket?: Ticket) =>
  ticket?.items.reduce((acc, item) => acc + item.quantidade, 0) ?? 0;

const getEntryStatus = (delivery: Delivery, tickets: Ticket[]) => {
  if (delivery.deliveryTipo === 'Retirada') {
    return tickets.length ? 'Retirada com tickets vinculados' : 'Nova coleta agendada';
  }

  if (tickets.length === 0) {
    return 'Entrega sem ticket localizado';
  }

  const hasPending = tickets.some((ticket) => ticket.statusEntrega !== 'Liberado');
  return hasPending ? 'Pronto para separar e expedir' : 'Tickets ja liberados';
};

const buildEntryDescription = (delivery: Delivery, tickets: Ticket[]) => {
  if (delivery.deliveryTipo === 'Retirada') {
    return tickets.length
      ? 'Retirada combinada com tickets ja vinculados ao cliente.'
      : 'Coleta nova para receber pecas na loja.';
  }

  if (tickets.length === 0) {
    return 'Entrega prevista sem ticket encontrado na base atual.';
  }

  return `Entrega com ${tickets.length} ticket(s) para conferencia final da equipe.`;
};

const Relatorio = () => {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true);
        setError('');

        const [clientesData, deliveriesData, ticketsData] = await Promise.all([
          listarClientes(),
          listarDelivery(),
          listarTickets(),
        ]);

        setClientes(clientesData);
        setDeliveries(deliveriesData);
        setTickets(ticketsData);
      } catch (requestError) {
        console.error(requestError);
        setError('Nao foi possivel carregar o quadro operacional. Verifique se a API local esta ativa.');
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, []);

  const clientesById = useMemo(
    () => new Map(clientes.map((cliente) => [String(cliente.id), cliente])),
    [clientes],
  );

  const ticketsByNumber = useMemo(
    () => new Map(tickets.map((ticket) => [String(ticket.ticketNumber), ticket])),
    [tickets],
  );

  const boardEntries = useMemo(() => {
    return deliveries
      .filter((delivery) => isSameDay(typeof delivery.deliveryData === 'string' ? delivery.deliveryData : String(delivery.deliveryData), selectedDate))
      .map((delivery, index) => {
        const cliente = delivery.clienteId ? clientesById.get(String(delivery.clienteId)) : undefined;
        const ticketNumbers = getDeliveryTicketNumbers(delivery);
        const relatedTickets = ticketNumbers
          .map((ticketNumber) => ticketsByNumber.get(ticketNumber))
          .filter((ticket): ticket is Ticket => Boolean(ticket));
        const rawDate = typeof delivery.deliveryData === 'string' ? delivery.deliveryData : String(delivery.deliveryData);
        const date = new Date(rawDate);

        return {
          id: String(delivery.id ?? `${delivery.deliveryTipo}-${index}`),
          tipo: delivery.deliveryTipo,
          horario: formatHour(rawDate),
          horarioOrdenacao: Number.isNaN(date.getTime()) ? Number.MAX_SAFE_INTEGER : date.getTime(),
          clienteNome: cliente?.nome ?? 'Cliente nao identificado',
          telefone: cliente?.telefone ?? 'Sem telefone',
          endereco: formatAddress(cliente),
          tickets: ticketNumbers,
          totalPecas: relatedTickets.reduce((acc, ticket) => acc + getTicketPieceCount(ticket), 0),
          status: getEntryStatus(delivery, relatedTickets),
          descricao: buildEntryDescription(delivery, relatedTickets),
        } satisfies BoardEntry;
      })
      .sort((a, b) => a.horarioOrdenacao - b.horarioOrdenacao);
  }, [clientesById, deliveries, selectedDate, ticketsByNumber]);

  const entregas = boardEntries.filter((entry) => entry.tipo === 'Entrega');
  const retiradas = boardEntries.filter((entry) => entry.tipo === 'Retirada');
  const totalPecasDoDia = boardEntries.reduce((acc, entry) => acc + entry.totalPecas, 0);

  return (
    <PageFrame
      eyebrow="Relatorios"
      title="Quadro operacional do dia"
      description="Acompanhe o que foi lancado para entrega e retirada em uma grade pensada para organizar a rotina da equipe de producao."
      actions={
        <>
          <Link to="/Delivery" className="page-frame-chip">Agendar delivery</Link>
          <Link to="/BuscarTicket" className="page-frame-chip is-primary">Buscar ticket</Link>
        </>
      }
    >
      <div className="relatorio-board">
        <section className="relatorio-toolbar">
          <div>
            <span className="relatorio-kicker">Planejamento diario</span>
            <h2>Organizacao de entregas e retiradas</h2>
            <p>Use esta visao para distribuir prioridades, separar pecas e alinhar a equipe antes das saidas do dia.</p>
          </div>

          <label className="relatorio-date-field" htmlFor="relatorio-data">
            <span>Data do quadro</span>
            <input
              id="relatorio-data"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>
        </section>

        {loading ? (
          <div className="relatorio-state">Carregando quadro operacional...</div>
        ) : error ? (
          <div className="relatorio-state is-error">{error}</div>
        ) : (
          <>
            <section className="relatorio-metrics">
              <article className="relatorio-metric-card">
                <span>Lancamentos do dia</span>
                <strong>{boardEntries.length}</strong>
                <small>Somando entregas e retiradas programadas.</small>
              </article>

              <article className="relatorio-metric-card">
                <span>Entregas</span>
                <strong>{entregas.length}</strong>
                <small>Saidas que precisam de separacao e conferencia.</small>
              </article>

              <article className="relatorio-metric-card">
                <span>Retiradas</span>
                <strong>{retiradas.length}</strong>
                <small>Coletas previstas para entrada de novas pecas.</small>
              </article>

              <article className="relatorio-metric-card highlight">
                <span>Pecas vinculadas</span>
                <strong>{totalPecasDoDia}</strong>
                <small>Total de pecas ligadas aos tickets encontrados.</small>
              </article>
            </section>

            {boardEntries.length === 0 ? (
              <div className="relatorio-empty">
                Nenhum lancamento foi encontrado para esta data. Ajuste o filtro ou crie novos agendamentos de delivery.
              </div>
            ) : (
              <>
                <section className="relatorio-columns">
                  <div className="relatorio-column">
                    <div className="relatorio-column-header">
                      <div>
                        <span className="relatorio-column-kicker">Entrega</span>
                        <h3>Saidas do dia</h3>
                      </div>
                      <strong>{entregas.length}</strong>
                    </div>

                    <div className="relatorio-card-list">
                      {entregas.length > 0 ? entregas.map((entry) => (
                        <article key={entry.id} className="operacao-card entrega">
                          <div className="operacao-card-top">
                            <span className="operacao-time">{entry.horario}</span>
                            <span className="operacao-status">{entry.status}</span>
                          </div>
                          <h4>{entry.clienteNome}</h4>
                          <p>{entry.endereco}</p>
                          <div className="operacao-meta">
                            <span>{entry.telefone}</span>
                            <span>{entry.tickets.length ? `${entry.tickets.length} ticket(s)` : 'Sem ticket'}</span>
                            <span>{entry.totalPecas} peca(s)</span>
                          </div>
                          <div className="operacao-ticket-strip">
                            {entry.tickets.length > 0 ? entry.tickets.map((ticketNumber) => (
                              <span key={`${entry.id}-${ticketNumber}`}>#{ticketNumber}</span>
                            )) : <span>Nenhum ticket vinculado</span>}
                          </div>
                          <small>{entry.descricao}</small>
                        </article>
                      )) : <div className="relatorio-empty-column">Nenhuma entrega prevista para esta data.</div>}
                    </div>
                  </div>

                  <div className="relatorio-column">
                    <div className="relatorio-column-header">
                      <div>
                        <span className="relatorio-column-kicker">Retirada</span>
                        <h3>Coletas do dia</h3>
                      </div>
                      <strong>{retiradas.length}</strong>
                    </div>

                    <div className="relatorio-card-list">
                      {retiradas.length > 0 ? retiradas.map((entry) => (
                        <article key={entry.id} className="operacao-card retirada">
                          <div className="operacao-card-top">
                            <span className="operacao-time">{entry.horario}</span>
                            <span className="operacao-status">{entry.status}</span>
                          </div>
                          <h4>{entry.clienteNome}</h4>
                          <p>{entry.endereco}</p>
                          <div className="operacao-meta">
                            <span>{entry.telefone}</span>
                            <span>{entry.tickets.length ? `${entry.tickets.length} ticket(s)` : 'Nova coleta'}</span>
                            <span>{entry.totalPecas} peca(s)</span>
                          </div>
                          <div className="operacao-ticket-strip">
                            {entry.tickets.length > 0 ? entry.tickets.map((ticketNumber) => (
                              <span key={`${entry.id}-${ticketNumber}`}>#{ticketNumber}</span>
                            )) : <span>Coleta sem ticket vinculado</span>}
                          </div>
                          <small>{entry.descricao}</small>
                        </article>
                      )) : <div className="relatorio-empty-column">Nenhuma retirada prevista para esta data.</div>}
                    </div>
                  </div>
                </section>

                <section className="relatorio-grid-section">
                  <div className="relatorio-grid-header">
                    <div>
                      <span className="relatorio-column-kicker">Grade da equipe</span>
                      <h3>Visao em grade para producao</h3>
                    </div>
                  </div>

                  <div className="relatorio-grid-table">
                    <div className="relatorio-grid-row relatorio-grid-head">
                      <span>Horario</span>
                      <span>Tipo</span>
                      <span>Cliente</span>
                      <span>Tickets</span>
                      <span>Pecas</span>
                      <span>Status operacional</span>
                    </div>

                    {boardEntries.map((entry) => (
                      <div key={`grid-${entry.id}`} className="relatorio-grid-row">
                        <strong>{entry.horario}</strong>
                        <span>{entry.tipo}</span>
                        <span>{entry.clienteNome}</span>
                        <span>{entry.tickets.length ? entry.tickets.map((ticket) => `#${ticket}`).join(', ') : 'Sem ticket'}</span>
                        <span>{entry.totalPecas}</span>
                        <span>{entry.status}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </PageFrame>
  );
};

export default Relatorio;
