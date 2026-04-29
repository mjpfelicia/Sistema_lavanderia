import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './Home.css';
import { listarClientes } from '../../service/apiCliente';
import { listarDelivery } from '../../service/apiDelivery';
import { listarTickets } from '../../service/apiTicket';

type ClienteResumo = {
  id: string;
  nome: string;
  telefone?: string;
};

type DeliveryResumo = {
  id: string;
  clienteId?: string;
  deliveryTipo: string;
  deliveryData?: string;
};

type TicketResumo = {
  id: string;
  ticketNumber: string;
  clienteId?: string;
  estaPago?: string;
  total: number;
  dataCriacao?: string;
  dataEntrega?: string;
};

type DashboardData = {
  clientes: ClienteResumo[];
  deliveries: DeliveryResumo[];
  tickets: TicketResumo[];
};

type Insight = {
  label: string;
  value: string;
  help: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value?: string) => {
  if (!value) {
    return 'Sem data';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'A combinar';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const normalizeDashboardData = (clientesRaw: any[], deliveriesRaw: any[], ticketsRaw: any[]): DashboardData => ({
  clientes: clientesRaw.map((cliente) => ({
    id: String(cliente.id ?? ''),
    nome: cliente.nome ?? 'Cliente sem nome',
    telefone: cliente.telefone,
  })),
  deliveries: deliveriesRaw.map((delivery) => ({
    id: String(delivery.id ?? ''),
    clienteId: delivery.clienteId ? String(delivery.clienteId) : undefined,
    deliveryTipo: delivery.deliveryTipo ?? 'Entrega',
    deliveryData: typeof delivery.deliveryData === 'string' ? delivery.deliveryData : undefined,
  })),
  tickets: ticketsRaw.map((ticket) => ({
    id: String(ticket.id ?? ''),
    ticketNumber: String(ticket.ticketNumber ?? '---'),
    clienteId: ticket.clienteId ? String(ticket.clienteId) : undefined,
    estaPago: ticket.estaPago,
    total: Number(ticket.total ?? 0),
    dataCriacao: ticket.dataCriacao,
    dataEntrega: ticket.dataEntrega,
  })),
});

const Home = () => {
  const [dashboard, setDashboard] = useState<DashboardData>({
    clientes: [],
    deliveries: [],
    tickets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [clientesRaw, deliveriesRaw, ticketsRaw] = await Promise.all([
          listarClientes(),
          listarDelivery(),
          listarTickets(),
        ]);

        setDashboard(normalizeDashboardData(clientesRaw as any[], deliveriesRaw as any[], ticketsRaw as any[]));
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os indicadores. Verifique se a API local está ativa na porta 3008.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const clientesById = new Map(dashboard.clientes.map((cliente) => [cliente.id, cliente]));
  const paidTickets = dashboard.tickets.filter((ticket) => ticket.estaPago === 'sim');
  const unpaidTickets = dashboard.tickets.filter((ticket) => ticket.estaPago !== 'sim');
  const revenue = paidTickets.reduce((sum, ticket) => sum + ticket.total, 0);
  const averageTicket = dashboard.tickets.length ? revenue / dashboard.tickets.length : 0;

  const upcomingDeliveries = [...dashboard.deliveries]
    .filter((delivery) => delivery.deliveryData)
    .sort((a, b) => new Date(a.deliveryData ?? '').getTime() - new Date(b.deliveryData ?? '').getTime())
    .slice(0, 4);

  const recentTickets = [...dashboard.tickets]
    .sort((a, b) => new Date(b.dataCriacao ?? '').getTime() - new Date(a.dataCriacao ?? '').getTime())
    .slice(0, 5);

  const insights: Insight[] = [
    {
      label: 'Clientes cadastrados',
      value: String(dashboard.clientes.length),
      help: 'Base ativa para novas coletas, entrega e relacionamento.',
    },
    {
      label: 'Tickets em aberto',
      value: String(unpaidTickets.length),
      help: 'Pedidos pendentes de pagamento ou fechamento.',
    },
    {
      label: 'Faturamento confirmado',
      value: formatCurrency(revenue),
      help: 'Total já marcado como pago nos tickets registrados.',
    },
    {
      label: 'Ticket médio',
      value: formatCurrency(averageTicket),
      help: 'Ajuda a acompanhar valor médio por atendimento.',
    },
  ];

  const quickActions = [
    { title: 'Cadastrar cliente', href: '/CadastroCliente', description: 'Novo cadastro com dados de contato e endereço.' },
    { title: 'Nova entrada de peças', href: '/EntradaDePeca', description: 'Registrar itens, serviços e gerar ticket.' },
    { title: 'Visualizar ticket', href: '/BuscarTicket', description: 'Consultar andamento e impressão de atendimento.' },
    { title: 'Agendar delivery', href: '/Delivery', description: 'Planejar retirada ou entrega com o cliente.' },
  ];

  return (
    <div className="home-shell">
      <Header nomePagina="" />
      <main className="home-dashboard">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="hero-kicker">Operação da lavanderia</span>
            <h1>Painel moderno para acompanhar pedidos, clientes e entregas em um só lugar.</h1>
            <p>
              A home agora funciona como um centro operacional: mostra saúde do negócio, atalhos do dia e os
              próximos compromissos para a equipe agir rápido.
            </p>
          </div>
          <div className="hero-badges">
            <div className="hero-badge">
              <strong>{dashboard.tickets.length}</strong>
              <span>tickets registrados</span>
            </div>
            <div className="hero-badge">
              <strong>{dashboard.deliveries.length}</strong>
              <span>movimentos de delivery</span>
            </div>
            <div className="hero-badge">
              <strong>{paidTickets.length}</strong>
              <span>pedidos pagos</span>
            </div>
          </div>
        </section>

        {error ? <section className="feedback-banner error-banner">{error}</section> : null}
        {loading ? <section className="feedback-banner">Carregando indicadores do sistema...</section> : null}

        <section className="insights-grid">
          {insights.map((insight) => (
            <article key={insight.label} className="insight-card">
              <span>{insight.label}</span>
              <strong>{insight.value}</strong>
              <p>{insight.help}</p>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="dashboard-card">
            <div className="card-heading">
              <div>
                <span className="card-eyebrow">Ações rápidas</span>
                <h2>Fluxos principais</h2>
              </div>
              <a href="/Recepcao" className="text-link">Abrir recepção</a>
            </div>
            <div className="action-list">
              {quickActions.map((action) => (
                <a key={action.href} href={action.href} className="action-card">
                  <strong>{action.title}</strong>
                  <span>{action.description}</span>
                </a>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-heading">
              <div>
                <span className="card-eyebrow">Agenda</span>
                <h2>Próximos deliveries</h2>
              </div>
            </div>
            <div className="timeline-list">
              {upcomingDeliveries.length ? upcomingDeliveries.map((delivery) => {
                const cliente = delivery.clienteId ? clientesById.get(delivery.clienteId) : undefined;
                return (
                  <div key={delivery.id} className="timeline-item">
                    <div>
                      <strong>{cliente?.nome ?? 'Cliente não encontrado'}</strong>
                      <span>{delivery.deliveryTipo}</span>
                    </div>
                    <time>{formatDate(delivery.deliveryData)}</time>
                  </div>
                );
              }) : <p className="empty-state">Nenhum delivery agendado no momento.</p>}
            </div>
          </article>

          <article className="dashboard-card dashboard-card-wide">
            <div className="card-heading">
              <div>
                <span className="card-eyebrow">Atendimento</span>
                <h2>Tickets recentes</h2>
              </div>
              <a href="/BuscarTicket" className="text-link">Ver todos</a>
            </div>
            <div className="ticket-table">
              <div className="ticket-table-row ticket-table-head">
                <span>Ticket</span>
                <span>Cliente</span>
                <span>Entrega</span>
                <span>Status</span>
                <span>Total</span>
              </div>
              {recentTickets.length ? recentTickets.map((ticket) => {
                const cliente = ticket.clienteId ? clientesById.get(ticket.clienteId) : undefined;
                const paid = ticket.estaPago === 'sim';

                return (
                  <div key={ticket.id} className="ticket-table-row">
                    <strong>#{ticket.ticketNumber}</strong>
                    <span>{cliente?.nome ?? 'Cliente vinculado no ticket'}</span>
                    <span>{formatDate(ticket.dataEntrega)}</span>
                    <span className={paid ? 'status-pill status-paid' : 'status-pill status-open'}>
                      {paid ? 'Pago' : 'Em aberto'}
                    </span>
                    <span>{formatCurrency(ticket.total)}</span>
                  </div>
                );
              }) : <p className="empty-state">Nenhum ticket encontrado.</p>}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-heading">
              <div>
                <span className="card-eyebrow">Oportunidades</span>
                <h2>Leituras rápidas</h2>
              </div>
            </div>
            <ul className="opportunity-list">
              <li>Priorize os {unpaidTickets.length} tickets em aberto para acelerar faturamento.</li>
              <li>Use a tela de delivery para organizar {dashboard.deliveries.length} retiradas e entregas cadastradas.</li>
              <li>Com {dashboard.clientes.length} clientes na base, já vale pensar em campanhas de retorno via WhatsApp.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Home;
