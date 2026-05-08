import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

type IconName =
  | 'home'
  | 'desk'
  | 'clients'
  | 'piece'
  | 'ticket'
  | 'delivery'
  | 'reports'
  | 'money'
  | 'settings'
  | 'bell'
  | 'user'
  | 'clock'
  | 'insight';

type Insight = {
  label: string;
  value: string;
  help: string;
  icon: IconName;
};

type QuickAction = {
  title: string;
  href: string;
  description: string;
  icon: IconName;
};

type SidebarItem = {
  label: string;
  href: string;
  icon: IconName;
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

const sidebarItems: SidebarItem[] = [
  { label: 'In\u00edcio', href: '/', icon: 'home' },
  { label: 'Recep\u00e7\u00e3o', href: '/Recepcao', icon: 'desk' },
  { label: 'Clientes', href: '/CadastroCliente', icon: 'clients' },
  { label: 'Entrada de Pe\u00e7a', href: '/EntradaDePeca', icon: 'piece' },
  { label: 'Buscar Ticket', href: '/BuscarTicket', icon: 'ticket' },
  { label: 'Delivery', href: '/Delivery', icon: 'delivery' },
  { label: 'Relat\u00f3rios', href: '/relatorio', icon: 'reports' },
  { label: 'Financeiro', href: '/admin/financeiro', icon: 'money' },
  { label: 'Configura\u00e7\u00f5es', href: '/admin', icon: 'settings' },
];

const SaasIcon = ({ name }: { name: IconName }) => {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'home':
      return <svg {...common}><path d="M4 11.5 12 5l8 6.5" /><path d="M6.5 10.5V19h11v-8.5" /></svg>;
    case 'desk':
      return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="3" /><path d="M8 9h8M8 13h5" /></svg>;
    case 'clients':
      return <svg {...common}><path d="M16 19a4 4 0 0 0-8 0" /><circle cx="12" cy="9" r="3.2" /><path d="M6 18.5a3.5 3.5 0 0 0-2.5-3.2M18 18.5a3.5 3.5 0 0 1 2.5-3.2" /></svg>;
    case 'piece':
      return <svg {...common}><path d="M7 6.5h10l1 3.5-2.5 2.2V19h-7v-6.8L6 10l1-3.5Z" /><path d="M9 6.5c0 1.2 1.3 2.2 3 2.2s3-1 3-2.2" /></svg>;
    case 'ticket':
      return <svg {...common}><path d="M6 6h12a2 2 0 0 1 2 2v2.2a1.8 1.8 0 0 0 0 3.6V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.2a1.8 1.8 0 0 0 0-3.6V8a2 2 0 0 1 2-2Z" /><path d="M9 9.5h6M9 14.5h4" /></svg>;
    case 'delivery':
      return <svg {...common}><path d="M4 7h10v8H4z" /><path d="M14 10h3l3 3v2h-6z" /><circle cx="8" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" /></svg>;
    case 'reports':
      return <svg {...common}><path d="M7 4.5h7l3 3V19H7z" /><path d="M14 4.5V8h3" /><path d="M10 12h4M10 15h4" /></svg>;
    case 'money':
      return <svg {...common}><path d="M12 4v16" /><path d="M16 7.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5 1.1 2.1 4 2.7 4 1.3 4 3-1.8 2.8-4 2.8-4-1.1-4-2.8" /></svg>;
    case 'settings':
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.7 7.7 0 0 0-1.8-1l-.3-2.6h-4l-.3 2.6a7.7 7.7 0 0 0-1.8 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.7 7.7 0 0 0 1.8 1l.3 2.6h4l.3-2.6a7.7 7.7 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5c.1-.4.1-.7.1-1Z" /></svg>;
    case 'bell':
      return <svg {...common}><path d="M8 18h8" /><path d="M10 20a2 2 0 0 0 4 0" /><path d="M18 16V11a6 6 0 1 0-12 0v5l-1.5 1.5h15Z" /></svg>;
    case 'user':
      return <svg {...common}><circle cx="12" cy="8.5" r="3.2" /><path d="M6 19a6 6 0 0 1 12 0" /></svg>;
    case 'clock':
      return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v4.2l2.8 1.8" /></svg>;
    case 'insight':
      return <svg {...common}><path d="M12 4 13.8 8.5 19 9.2l-3.8 3.5.9 5-4.1-2.2-4.1 2.2.9-5L5 9.2l5.2-.7Z" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
};

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
        setError('N\u00e3o foi poss\u00edvel carregar os indicadores. Verifique se a API local est\u00e1 ativa na porta 3008.');
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
      icon: 'clients',
    },
    {
      label: 'Tickets em aberto',
      value: String(unpaidTickets.length),
      help: 'Pedidos pendentes de pagamento ou fechamento.',
      icon: 'ticket',
    },
    {
      label: 'Faturamento confirmado',
      value: formatCurrency(revenue),
      help: 'Total j\u00e1 marcado como pago nos tickets registrados.',
      icon: 'money',
    },
    {
      label: 'Ticket m\u00e9dio',
      value: formatCurrency(averageTicket),
      help: 'Ajuda a acompanhar valor m\u00e9dio por atendimento.',
      icon: 'insight',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Cadastrar cliente',
      href: '/CadastroCliente',
      description: 'Novo cadastro com dados de contato e endere\u00e7o.',
      icon: 'clients',
    },
    {
      title: 'Nova entrada de pe\u00e7as',
      href: '/EntradaDePeca',
      description: 'Registrar itens, servi\u00e7os e gerar ticket.',
      icon: 'piece',
    },
    {
      title: 'Visualizar ticket',
      href: '/BuscarTicket',
      description: 'Consultar andamento e impress\u00e3o de atendimento.',
      icon: 'ticket',
    },
    {
      title: 'Agendar delivery',
      href: '/Delivery',
      description: 'Planejar retirada ou entrega com o cliente.',
      icon: 'delivery',
    },
  ];

  return (
    <div className="saas-shell">
      <aside className="saas-sidebar">
        <div className="saas-brand">
          <div className="saas-brand-mark">L</div>
          <div>
            <strong>Sistema de Lavanderia</strong>
            <span>Operations Suite</span>
          </div>
        </div>

        <nav className="saas-nav" aria-label="Menu lateral">
          {sidebarItems.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              className={index === 0 ? 'saas-nav-link is-active' : 'saas-nav-link'}
            >
              <span className="saas-nav-icon">
                <SaasIcon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="saas-main">
        <header className="saas-topbar">
          <div>
            <span className="saas-overline">Dashboard SaaS</span>
            <h1>{'Painel de Opera\u00e7\u00e3o'}</h1>
          </div>

          <div className="saas-topbar-actions">
            <button className="topbar-icon-button" type="button" aria-label={'Notifica\u00e7\u00f5es'}>
              <SaasIcon name="bell" />
            </button>
            <button className="topbar-profile" type="button" aria-label={'Perfil do usu\u00e1rio'}>
              <SaasIcon name="user" />
              <span>{'Fel\u00edcia'}</span>
            </button>
          </div>
        </header>

        <main className="home-dashboard">
          <section className="hero-panel">
            <div className="hero-copy">
              <span className="hero-kicker">{'Opera\u00e7\u00e3o da lavanderia'}</span>
              <h2>{'Painel moderno para acompanhar pedidos, clientes e entregas em um s\u00f3 lugar'}</h2>
              <p>
                {'A home funciona como um centro operacional de alto n\u00edvel: exibe a sa\u00fade do neg\u00f3cio, oferece atalhos do dia e antecipa os pr\u00f3ximos compromissos da equipe.'}
              </p>
            </div>

            <div className="hero-badges">
              <div className="hero-badge">
                <span className="metric-label">Tickets registrados</span>
                <strong>{dashboard.tickets.length}</strong>
                <small>Fluxo total monitorado em tempo real</small>
              </div>
              <div className="hero-badge">
                <span className="metric-label">Movimentos de delivery</span>
                <strong>{dashboard.deliveries.length}</strong>
                <small>Rotas de retirada e entrega do dia</small>
              </div>
              <div className="hero-badge">
                <span className="metric-label">Pedidos pagos</span>
                <strong>{paidTickets.length}</strong>
                <small>Status financeiro consolidado</small>
              </div>
            </div>
          </section>

          {error ? <section className="feedback-banner error-banner">{error}</section> : null}
          {loading ? <section className="feedback-banner">Carregando indicadores do sistema...</section> : null}

          <section className="insights-grid">
            {insights.map((insight) => (
              <article key={insight.label} className="insight-card">
                <div className="insight-icon">
                  <SaasIcon name={insight.icon} />
                </div>
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
                  <span className="card-eyebrow">{'A\u00e7\u00f5es r\u00e1pidas'}</span>
                  <h3>Fluxos principais</h3>
                </div>
                <Link to="/Recepcao" className="text-link">{'Abrir recep\u00e7\u00e3o'}</Link>
              </div>

              <div className="action-list">
                {quickActions.map((action) => (
                  <Link key={action.href} to={action.href} className="action-card">
                    <div className="action-icon">
                      <SaasIcon name={action.icon} />
                    </div>
                    <strong>{action.title}</strong>
                    <span>{action.description}</span>
                  </Link>
                ))}
              </div>
            </article>

            <article className="dashboard-card">
              <div className="card-heading">
                <div>
                  <span className="card-eyebrow">Agenda</span>
                  <h3>{'Pr\u00f3ximos deliveries'}</h3>
                </div>
              </div>

              <div className="timeline-list">
                {upcomingDeliveries.length ? upcomingDeliveries.map((delivery) => {
                  const cliente = delivery.clienteId ? clientesById.get(delivery.clienteId) : undefined;
                  return (
                    <div key={delivery.id} className="timeline-item">
                      <div className="timeline-marker">
                        <SaasIcon name="clock" />
                      </div>
                      <div className="timeline-content">
                        <time>{formatDate(delivery.deliveryData)}</time>
                        <strong>{cliente?.nome ?? 'Cliente n\u00e3o encontrado'}</strong>
                        <span>{delivery.deliveryTipo}</span>
                      </div>
                    </div>
                  );
                }) : <p className="empty-state">Nenhum delivery agendado no momento.</p>}
              </div>
            </article>

            <article className="dashboard-card dashboard-card-wide">
              <div className="card-heading">
                <div>
                  <span className="card-eyebrow">Atendimento</span>
                  <h3>Tickets recentes</h3>
                </div>
                <Link to="/BuscarTicket" className="text-link">Ver todos</Link>
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
                  <span className="card-eyebrow">{'Leituras r\u00e1pidas'}</span>
                  <h3>Insights operacionais</h3>
                </div>
              </div>

              <ul className="opportunity-list">
                <li>
                  <SaasIcon name="money" />
                  <span>Priorize os {unpaidTickets.length} tickets em aberto para acelerar o faturamento.</span>
                </li>
                <li>
                  <SaasIcon name="delivery" />
                  <span>{`Organize ${dashboard.deliveries.length} retiradas e entregas com foco nas pr\u00f3ximas janelas.`}</span>
                </li>
                <li>
                  <SaasIcon name="insight" />
                  <span>{`Com ${dashboard.clientes.length} clientes na base, j\u00e1 vale estruturar campanhas de retorno.`}</span>
                </li>
              </ul>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
