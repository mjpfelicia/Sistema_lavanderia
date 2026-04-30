import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface KPI {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

interface TicketResumo {
  id: number;
  cliente: string;
  status: string;
  valor: number;
  dataEntrada: string;
  dataPrevista: string;
}

const AdminDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [ticketsRecentes, setTicketsRecentes] = useState<TicketResumo[]>([]);
  const [ticketsAtrasados, setTicketsAtrasados] = useState<TicketResumo[]>([]);
  const [faturamentoMes, setFaturamentoMes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Buscar tickets
      const responseTickets = await axios.get('http://localhost:3008/tickets');
      const tickets = responseTickets.data;

      // Calcular KPIs
      const totalTickets = tickets.length;
      const ticketsProntos = tickets.filter((t: any) => t.status === 'Pronto').length;
      const ticketsEntregues = tickets.filter((t: any) => t.status === 'Entregue').length;
      const ticketsPendentes = tickets.filter((t: any) => t.status === 'Pendente' || t.status === 'Em produção').length;
      
      // Faturamento do mês atual
      const agora = new Date();
      const mesAtual = agora.getMonth();
      const anoAtual = agora.getFullYear();
      
      const ticketsMes = tickets.filter((t: any) => {
        const dataEntrada = new Date(t.dataEntrada);
        return dataEntrada.getMonth() === mesAtual && dataEntrada.getFullYear() === anoAtual;
      });

      const faturamento = ticketsMes.reduce((acc: number, t: any) => {
        return acc + (t.valorTotal || t.valor || 0);
      }, 0);

      setFaturamentoMes(faturamento);

      // Tickets atrasados
      const hoje = new Date();
      const atrasados = tickets.filter((t: any) => {
        const dataPrevista = new Date(t.dataPrevista);
        return dataPrevista < hoje && t.status !== 'Entregue';
      }).slice(0, 5);

      setTicketsAtrasados(atrasados);

      // Tickets recentes
      const recentes = tickets
        .sort((a: any, b: any) => new Date(b.dataEntrada).getTime() - new Date(a.dataEntrada).getTime())
        .slice(0, 10);

      setTicketsRecentes(recentes);

      // Definir KPIs
      setKpis([
        {
          label: 'Faturamento Mensal',
          value: `R$ ${faturamento.toFixed(2)}`,
          icon: '💰',
          color: '#4a9c9f',
          trend: '+12%'
        },
        {
          label: 'Tickets Ativos',
          value: totalTickets,
          icon: '🎫',
          color: '#5faaa5',
          trend: `${ticketsPendentes} pendentes`
        },
        {
          label: 'Prontos para Entrega',
          value: ticketsProntos,
          icon: '✅',
          color: '#7cb342',
          trend: ''
        },
        {
          label: 'Entregues (Mês)',
          value: ticketsEntregues,
          icon: '🚚',
          color: '#ffa726',
          trend: ''
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>📊 Painel Administrativo</h1>
          <p>Gestão completa da sua lavanderia</p>
        </div>
        <div className="header-actions">
          <span className="last-update">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </span>
          <button onClick={carregarDados} className="btn-refresh">
            🔄 Atualizar
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Menu de Navegação Rápida */}
        <nav className="admin-nav">
          <Link to="/admin/financeiro" className="nav-card">
            <span className="nav-icon">💰</span>
            <span className="nav-label">Relatório Financeiro</span>
          </Link>
          <Link to="/admin/tickets" className="nav-card">
            <span className="nav-icon">🎫</span>
            <span className="nav-label">Gestão de Tickets</span>
          </Link>
          <Link to="/admin/clientes" className="nav-card">
            <span className="nav-icon">👥</span>
            <span className="nav-label">Clientes</span>
          </Link>
          <Link to="/admin/delivery" className="nav-card">
            <span className="nav-icon">🚚</span>
            <span className="nav-label">Entregas</span>
          </Link>
          <Link to="/admin/configuracoes" className="nav-card">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Configurações</span>
          </Link>
          <Link to="/" className="nav-card nav-card-back">
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Voltar ao Início</span>
          </Link>
        </nav>

        {/* KPIs Cards */}
        <section className="kpi-section">
          <h2>Indicadores do Mês</h2>
          <div className="kpi-grid">
            {kpis.map((kpi, index) => (
              <div key={index} className="kpi-card" style={{ borderColor: kpi.color }}>
                <div className="kpi-icon" style={{ backgroundColor: `${kpi.color}20` }}>
                  {kpi.icon}
                </div>
                <div className="kpi-content">
                  <h3>{kpi.label}</h3>
                  <p className="kpi-value">{kpi.value}</p>
                  {kpi.trend && <span className="kpi-trend">{kpi.trend}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alerts Section */}
        {ticketsAtrasados.length > 0 && (
          <section className="alerts-section">
            <h2>⚠️ Tickets Atrasados</h2>
            <div className="alerts-list">
              {ticketsAtrasados.map((ticket) => (
                <div key={ticket.id} className="alert-item">
                  <div className="alert-info">
                    <strong>Ticket #{ticket.id}</strong>
                    <span>{ticket.cliente}</span>
                  </div>
                  <div className="alert-details">
                    <span className="alert-status">{ticket.status}</span>
                    <span className="alert-date">
                      Previsto: {new Date(ticket.dataPrevista).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <Link to={`/BuscarTicket/${ticket.id}`} className="btn-view">
                    Ver
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Tickets */}
        <section className="recent-section">
          <h2>📋 Tickets Recentes</h2>
          <div className="tickets-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Entrada</th>
                  <th>Previsão</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ticketsRecentes.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.cliente}</td>
                    <td>
                      <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>R$ {ticket.valor.toFixed(2)}</td>
                    <td>{new Date(ticket.dataEntrada).toLocaleDateString('pt-BR')}</td>
                    <td>{new Date(ticket.dataPrevista).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <Link to={`/BuscarTicket/${ticket.id}`} className="btn-sm">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
