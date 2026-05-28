import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { listarClientes } from '../../service/apiCliente';
import { listarDelivery, atualizaDelivery } from '../../service/apiDelivery';
import { listarTickets, atualizaTicket } from '../../service/apiTicket';

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
  ticketNumber?: string;
  ticketNumbers?: string[];
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

type OperacaoResumo = {
  id: string;
  horario: string;
  horarioOrdenacao: number;
  tipo: string;
  clienteNome: string;
  telefone: string;
  tickets: string[];
  totalPecas: number;
  status: string;
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
  | 'insight';

type Insight = {
  label: string;
  value: string;
  help: string;
  icon: IconName;
};

type Pendencia = {
  id: string;
  titulo: string;
  descricao: string;
  tom: 'warning' | 'info' | 'neutral' | 'critical';
  deliveryId?: string;
  ticketNumbers?: string[];
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

const formatHour = (value?: string) => {
  if (!value) {
    return 'Sem horario';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'A combinar';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getToday = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
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

const getDeliveryTicketNumbers = (delivery: DeliveryResumo) => {
  if (delivery.ticketNumbers?.length) {
    return delivery.ticketNumbers;
  }

  if (!delivery.ticketNumber) {
    return [];
  }

  return delivery.ticketNumber
    .split(',')
    .map((item) => item.replace('#', '').trim())
    .filter(Boolean);
};

const isDeliveryOverdue = (deliveryData?: string) => {
  if (!deliveryData) return false;
  const deliveryTime = new Date(deliveryData).getTime();
  const now = new Date().getTime();
  return now > deliveryTime;
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
    ticketNumber: typeof delivery.ticketNumber === 'string' ? delivery.ticketNumber : undefined,
    ticketNumbers: Array.isArray(delivery.ticketNumbers) ? delivery.ticketNumbers.map((item: unknown) => String(item)) : undefined,
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

  const handleMarcarEntregue = async (deliveryId: string, ticketNumbers: string[]) => {
    try {
      // Atualizar delivery para status entregue
      const delivery = dashboard.deliveries.find((d) => d.id === deliveryId);
      if (delivery) {
        await atualizaDelivery(deliveryId, {
          ...delivery,
          statusEntrega: 'Entregue',
        } as any);

        // Atualizar tickets relacionados
        for (const ticketNumber of ticketNumbers) {
          const ticket = dashboard.tickets.find((t) => t.ticketNumber === ticketNumber);
          if (ticket) {
            await atualizaTicket({
              ...ticket,
              statusEntrega: 'Entregue',
              dataEntrega: new Date().toISOString(),
            } as any);
          }
        }

        // Recarregar dashboard
        const [clientesRaw, deliveriesRaw, ticketsRaw] = await Promise.all([
          listarClientes(),
          listarDelivery(),
          listarTickets(),
        ]);
        setDashboard(normalizeDashboardData(clientesRaw as any[], deliveriesRaw as any[], ticketsRaw as any[]));
      }
    } catch (err) {
      console.error('Erro ao marcar entrega como concluída:', err);
    }
  };

  const clientesById = new Map(dashboard.clientes.map((cliente) => [cliente.id, cliente]));
  const paidTickets = dashboard.tickets.filter((ticket) => ticket.estaPago === 'sim');
  const unpaidTickets = dashboard.tickets.filter((ticket) => ticket.estaPago !== 'sim');
  const revenue = paidTickets.reduce((sum, ticket) => sum + ticket.total, 0);
  const averageTicket = dashboard.tickets.length ? revenue / dashboard.tickets.length : 0;

  const today = getToday();
  const operacoesDoDia: OperacaoResumo[] = [...dashboard.deliveries]
    .filter((delivery) => isSameDay(delivery.deliveryData, today))
    .map((delivery) => {
      const cliente = delivery.clienteId ? clientesById.get(delivery.clienteId) : undefined;
      const ticketsRelacionados = getDeliveryTicketNumbers(delivery);
      const ticketsDoAtendimento = ticketsRelacionados
        .map((ticketNumber) => dashboard.tickets.find((ticket) => ticket.ticketNumber === ticketNumber))
        .filter((ticket): ticket is TicketResumo => Boolean(ticket));
      const totalPecas = ticketsDoAtendimento.length;
      const status =
        delivery.deliveryTipo === 'Retirada'
          ? ticketsRelacionados.length
            ? 'Retirada com tickets'
            : 'Nova coleta'
          : ticketsRelacionados.length
            ? 'Separar e expedir'
            : 'Entrega sem ticket';

      return {
        id: delivery.id,
        horario: formatHour(delivery.deliveryData),
        horarioOrdenacao: new Date(delivery.deliveryData ?? '').getTime(),
        tipo: delivery.deliveryTipo,
        clienteNome: cliente?.nome ?? 'Cliente nao encontrado',
        telefone: cliente?.telefone ?? 'Sem telefone',
        tickets: ticketsRelacionados,
        totalPecas,
        status,
      };
    })
    .sort((a, b) => a.horarioOrdenacao - b.horarioOrdenacao)
    .slice(0, 8);

  const entregasDoDia = operacoesDoDia.filter((operacao) => operacao.tipo === 'Entrega').slice(0, 4);
  const retiradasDoDia = operacoesDoDia.filter((operacao) => operacao.tipo === 'Retirada').slice(0, 4);

  // Detectar entregas atrasadas
  const entregasAtrasadas = dashboard.deliveries.filter((delivery) => {
    return (
      delivery.deliveryTipo === 'Entrega' &&
      delivery.deliveryData &&
      isDeliveryOverdue(delivery.deliveryData)
    );
  });

  const pendenciasOperacionais = [
    // Entregas atrasadas - CRÍTICO
    ...entregasAtrasadas.map((delivery) => {
      const cliente = delivery.clienteId ? clientesById.get(delivery.clienteId) : undefined;
      const ticketsRelacionados = getDeliveryTicketNumbers(delivery);
      return {
        id: `entrega-atrasada-${delivery.id}`,
        titulo: `🚨 ENTREGA ATRASADA - ${cliente?.nome ?? 'Cliente desconhecido'}`,
        descricao: `Desde ${formatDate(delivery.deliveryData)} | ${
          ticketsRelacionados.length ? ticketsRelacionados.map((t) => `#${t}`).join(', ') : 'Sem ticket'
        }`,
        tom: 'critical',
        deliveryId: delivery.id,
        ticketNumbers: ticketsRelacionados,
      };
    }),
    ...operacoesDoDia
      .filter((operacao) => operacao.tipo === 'Entrega' && operacao.tickets.length === 0)
      .map((operacao) => ({
        id: `operacao-sem-ticket-${operacao.id}`,
        titulo: `${operacao.clienteNome} sem ticket vinculado`,
        descricao: `Entrega prevista para ${operacao.horario} ainda precisa de conferencia manual.`,
        tom: 'warning',
      })),
    ...operacoesDoDia
      .filter((operacao) => operacao.status === 'Separar e expedir')
      .map((operacao) => ({
        id: `operacao-separar-${operacao.id}`,
        titulo: `Separar ${operacao.tickets.length} ticket(s) de ${operacao.clienteNome}`,
        descricao: `${operacao.horario} | ${operacao.tickets.map((ticket) => `#${ticket}`).join(', ')}`,
        tom: 'info',
      })),
    ...unpaidTickets.slice(0, 3).map((ticket) => {
      const cliente = ticket.clienteId ? clientesById.get(ticket.clienteId) : undefined;
      return {
        id: `ticket-aberto-${ticket.id}`,
        titulo: `Ticket #${ticket.ticketNumber} em aberto`,
        descricao: `${cliente?.nome ?? 'Cliente vinculado no ticket'} | ${formatCurrency(ticket.total)}`,
        tom: 'neutral',
      };
    }),
  ].slice(0, 5);

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
            <article className="dashboard-card dashboard-card-wide operations-card">
              <div className="card-heading">
                <div>
                  <span className="card-eyebrow">Operacao de hoje</span>
                  <h3>Entregas e retiradas em destaque</h3>
                </div>
                <Link to="/Relatorio" className="text-link">Ver quadro completo</Link>
              </div>

              <div className="operations-overview">
                <div className="operations-column">
                  <div className="operations-column-header entrega">
                    <strong>Entregas</strong>
                    <span>{entregasDoDia.length} no dia</span>
                  </div>
                  <div className="operations-list">
                    {entregasDoDia.length ? entregasDoDia.map((operacao) => (
                      <div key={operacao.id} className="operation-item">
                        <div className="operation-item-top">
                          <span className="operation-time">{operacao.horario}</span>
                          <span className="operation-status">{operacao.status}</span>
                        </div>
                        <strong>{operacao.clienteNome}</strong>
                        <span>{operacao.telefone}</span>
                        {operacao.tickets.length ? (
                          <div className="operation-tickets">
                            <span className="tickets-label">Tickets:</span>
                            <strong className="tickets-numbers">{operacao.tickets.map((ticket) => `#${ticket}`).join(', ')}</strong>
                          </div>
                        ) : (
                          <small className="no-tickets">Sem ticket vinculado</small>
                        )}
                      </div>
                    )) : <p className="empty-state">Nenhuma entrega agendada para hoje.</p>}
                  </div>
                </div>

                <div className="operations-column">
                  <div className="operations-column-header retirada">
                    <strong>Retiradas</strong>
                    <span>{retiradasDoDia.length} no dia</span>
                  </div>
                  <div className="operations-list">
                    {retiradasDoDia.length ? retiradasDoDia.map((operacao) => (
                      <div key={operacao.id} className="operation-item">
                        <div className="operation-item-top">
                          <span className="operation-time">{operacao.horario}</span>
                          <span className="operation-status">{operacao.status}</span>
                        </div>
                        <strong>{operacao.clienteNome}</strong>
                        <span>{operacao.telefone}</span>
                        {operacao.tickets.length ? (
                          <div className="operation-tickets">
                            <span className="tickets-label">Tickets:</span>
                            <strong className="tickets-numbers">{operacao.tickets.map((ticket) => `#${ticket}`).join(', ')}</strong>
                          </div>
                        ) : (
                          <small className="no-tickets">Nova coleta sem ticket</small>
                        )}
                      </div>
                    )) : <p className="empty-state">Nenhuma retirada agendada para hoje.</p>}
                  </div>
                </div>
              </div>

              <div className="operations-grid">
                <div className="operations-grid-row operations-grid-head">
                  <span>Horario</span>
                  <span>Tipo</span>
                  <span>Cliente</span>
                  <span>Tickets</span>
                  <span>Status</span>
                </div>
                {operacoesDoDia.length ? operacoesDoDia.map((operacao) => (
                  <div key={`grid-${operacao.id}`} className="operations-grid-row">
                    <strong>{operacao.horario}</strong>
                    <span>{operacao.tipo}</span>
                    <span>{operacao.clienteNome}</span>
                    <span>{operacao.tickets.length ? operacao.tickets.map((ticket) => `#${ticket}`).join(', ') : 'Sem ticket'}</span>
                    <span>{operacao.status}</span>
                  </div>
                )) : <p className="empty-state">Nenhuma operacao lancada para hoje.</p>}
              </div>
            </article>

            <article className="dashboard-card">
              <div className="card-heading">
                <div>
                  <span className="card-eyebrow">Prioridades</span>
                  <h3>Pendencias da operacao</h3>
                </div>
                <Link to="/Relatorio" className="text-link">Ir para o quadro</Link>
              </div>

              <div className="pending-list">
                {pendenciasOperacionais.length ? pendenciasOperacionais.map((pendencia) => (
                  <div key={pendencia.id} className={`pending-item pending-${pendencia.tom}`}>
                    <div className="pending-bullet" />
                    <div className="pending-content">
                      <strong>{pendencia.titulo}</strong>
                      <span>{pendencia.descricao}</span>
                    </div>
                  </div>
                )) : <p className="empty-state">Nenhuma pendencia operacional critica no momento.</p>}
              </div>
            </article>

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
