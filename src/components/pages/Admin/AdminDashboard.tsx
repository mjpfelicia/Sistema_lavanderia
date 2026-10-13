import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import BackToHome from '../../buttons/BackToHome';
import { isTicketFinalizado, listarTickets, Ticket } from '../../../service/apiTicket';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (value?: string) => {
  if (!value) return 'Não informado';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Não informado' : date.toLocaleDateString('pt-BR');
};

const isSameMonth = (value?: string) => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return !Number.isNaN(date.getTime()) && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const AdminDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setTickets(await listarTickets());
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (requestError) {
      console.error('Erro ao carregar painel administrativo:', requestError);
      setError('Não foi possível carregar os indicadores. Verifique se a API local está ativa.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
    const interval = window.setInterval(carregarDados, 30000);
    return () => window.clearInterval(interval);
  }, [carregarDados]);

  const resumo = useMemo(() => {
    const abertos = tickets.filter((ticket) => !isTicketFinalizado(ticket));
    const prontos = abertos.filter((ticket) => ticket.statusEntrega === 'Pronto' || ticket.statusEntrega === 'Liberado');
    const entreguesNoMes = tickets.filter((ticket) => ticket.dataBaixa && isSameMonth(ticket.dataBaixa));
    const faturamento = entreguesNoMes
      .filter((ticket) => ticket.estaPago === 'sim')
      .reduce((total, ticket) => total + (ticket.valorRecebido ?? ticket.totalPago ?? ticket.total), 0);
    const atrasados = abertos.filter((ticket) => {
      if (!ticket.dataEntrega) return false;
      const dataEntrega = new Date(ticket.dataEntrega);
      return !Number.isNaN(dataEntrega.getTime()) && dataEntrega < new Date();
    });

    return { abertos, prontos, entreguesNoMes, faturamento, atrasados };
  }, [tickets]);

  const ticketsRecentes = useMemo(
    () => [...tickets].sort((a, b) => new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime()).slice(0, 10),
    [tickets],
  );

  if (loading) {
    return <div className="admin-dashboard-loading"><div className="spinner" /><p>Carregando dashboard...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BackToHome variant="icon" />
            <div><h1>Painel Administrativo</h1><p>Indicadores operacionais e financeiros da lavanderia</p></div>
          </div>
        </div>
        <div className="header-actions">
          <span className="last-update">Atualizado: {lastUpdate || '—'}</span>
          <button onClick={carregarDados} className="btn-refresh">Atualizar</button>
        </div>
      </header>

      <div className="admin-content">
        <nav className="admin-nav">
          <Link to="/admin/caixa" className="nav-card"><span className="nav-icon">💰</span><span className="nav-label">Caixa do Dia</span></Link>
          <Link to="/admin/tickets-baixados-pendencia" className="nav-card"><span className="nav-icon">📋</span><span className="nav-label">Pendências de Recebimento</span></Link>
          <Link to="/pecas-em-atraso" className="nav-card"><span className="nav-icon">📌</span><span className="nav-label">Tickets Atrasados</span></Link>
          <Link to="/BuscarTicket" className="nav-card"><span className="nav-icon">🎫</span><span className="nav-label">Buscar Ticket</span></Link>
          <Link to="/Delivery" className="nav-card"><span className="nav-icon">🚚</span><span className="nav-label">Entregas</span></Link>
          <Link to="/" className="nav-card nav-card-back"><span className="nav-icon">🏠</span><span className="nav-label">Voltar ao Início</span></Link>
        </nav>

        {error && <section className="alerts-section"><p>{error}</p></section>}

        <section className="kpi-section">
          <h2>Indicadores do mês</h2>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-content"><h3>Faturamento recebido</h3><p className="kpi-value">{formatCurrency(resumo.faturamento)}</p><span className="kpi-trend">Tickets baixados e pagos</span></div></div>
            <div className="kpi-card"><div className="kpi-content"><h3>Tickets ativos</h3><p className="kpi-value">{resumo.abertos.length}</p><span className="kpi-trend">Ainda em atendimento</span></div></div>
            <div className="kpi-card"><div className="kpi-content"><h3>Prontos para entrega</h3><p className="kpi-value">{resumo.prontos.length}</p><span className="kpi-trend">Prontos ou liberados</span></div></div>
            <div className="kpi-card"><div className="kpi-content"><h3>Entregues no mês</h3><p className="kpi-value">{resumo.entreguesNoMes.length}</p><span className="kpi-trend">Com baixa registrada</span></div></div>
          </div>
        </section>

        {resumo.atrasados.length > 0 && <section className="alerts-section"><h2>Tickets atrasados</h2><div className="alerts-list">{resumo.atrasados.slice(0, 5).map((ticket) => <div key={ticket.id} className="alert-item"><div className="alert-info"><strong>Ticket #{ticket.ticketNumber}</strong><span>Previsão: {formatDate(ticket.dataEntrega)}</span></div><Link to={`/BuscarTicket/${ticket.ticketNumber}`} className="btn-view">Ver</Link></div>)}</div></section>}

        <section className="recent-section"><h2>Tickets recentes</h2><div className="tickets-table"><table><thead><tr><th>Ticket</th><th>Status</th><th>Valor</th><th>Criação</th><th>Previsão</th><th>Ações</th></tr></thead><tbody>{ticketsRecentes.map((ticket) => <tr key={ticket.id}><td>#{ticket.ticketNumber}</td><td><span className={`status-badge status-${(ticket.statusEntrega || 'em-producao').toLowerCase().replace(' ', '-')}`}>{ticket.statusEntrega || 'Em produção'}</span></td><td>{formatCurrency(ticket.total)}</td><td>{formatDate(ticket.dataCriacao)}</td><td>{formatDate(ticket.dataEntrega)}</td><td><Link to={`/BuscarTicket/${ticket.ticketNumber}`} className="btn-sm">Ver</Link></td></tr>)}</tbody></table></div></section>
      </div>
    </div>
  );
};

export default AdminDashboard;
