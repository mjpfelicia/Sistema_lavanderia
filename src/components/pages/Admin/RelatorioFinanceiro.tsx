import React, { useState, useEffect } from 'react';
import './RelatorioFinanceiro.css';
import BackToHome from '../../buttons/BackToHome';
import axios from 'axios';
import { config } from '../../../config';

interface Ticket {
  id: number;
  cliente: string;
  valor: number;
  status: string;
  dataEntrada: string;
  dataPrevista: string;
  formaPagamento?: string;
}

interface ResumoFinanceiro {
  totalFaturado: number;
  totalPago: number;
  totalPendente: number;
  totalTickets: number;
  ticketMedio: number;
}

const RelatorioFinanceiro: React.FC = () => {
  const [mes, setMes] = useState<number>(new Date().getMonth());
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    carregarDados();
  }, [mes, ano]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/tickets`);
      let todosTickets = response.data;

      // Filtrar por mês e ano
      let ticketsFiltrados = todosTickets.filter((t: any) => {
        const dataEntrada = new Date(t.dataEntrada);
        return dataEntrada.getMonth() === mes && dataEntrada.getFullYear() === ano;
      });

      // Aplicar filtro de status
      if (filtroStatus !== 'todos') {
        ticketsFiltrados = ticketsFiltrados.filter((t: any) => 
          t.status.toLowerCase() === filtroStatus.toLowerCase()
        );
      }

      setTickets(ticketsFiltrados);

      // Calcular resumo
      const totalFaturado = ticketsFiltrados.reduce((acc: number, t: any) => 
        acc + (t.valorTotal || t.valor || 0), 0
      );

      const ticketsPagos = ticketsFiltrados.filter((t: any) => 
        t.status === 'Entregue' || t.status === 'Liberado'
      );
      const totalPago = ticketsPagos.reduce((acc: number, t: any) => 
        acc + (t.valorTotal || t.valor || 0), 0
      );

      const totalPendente = totalFaturado - totalPago;

      setResumo({
        totalFaturado,
        totalPago,
        totalPendente,
        totalTickets: ticketsFiltrados.length,
        ticketMedio: ticketsFiltrados.length > 0 ? totalFaturado / ticketsFiltrados.length : 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    window.print();
  };

  const exportarExcel = () => {
    const headers = ['ID', 'Cliente', 'Valor', 'Status', 'Data Entrada', 'Data Prevista'];
    const csvContent = [
      headers.join(';'),
      ...tickets.map(t => 
        [t.id, t.cliente, t.valor.toFixed(2), t.status, 
         new Date(t.dataEntrada).toLocaleDateString('pt-BR'),
         new Date(t.dataPrevista).toLocaleDateString('pt-BR')].join(';')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_financeiro_${meses[mes]}_${ano}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="relatorio-loading">
        <div className="spinner"></div>
        <p>Carregando relatório...</p>
      </div>
    );
  }

  return (
    <div className="relatorio-financeiro">
      <header className="relatorio-header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BackToHome variant="icon" />
          <div className="header-content">
            <h1>💰 Relatório Financeiro</h1>
            <p>Faturamento mensal e análise financeira</p>
          </div>
        </div>
        <div className="header-actions">
        </div>
      </header>

      <div className="relatorio-content">
        {/* Filtros */}
        <section className="filtros-section no-print">
          <div className="filtros-group">
            <label>Mês:</label>
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {meses.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>

          <div className="filtros-group">
            <label>Ano:</label>
            <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
              {[2023, 2024, 2025, 2026].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="filtros-group">
            <label>Status:</label>
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="em produção">Em Produção</option>
              <option value="pronto">Prontos</option>
              <option value="liberado">Liberados</option>
              <option value="entregue">Entregues</option>
            </select>
          </div>

          <div className="filtros-actions">
            <button onClick={carregarDados} className="btn-filtrar">
              🔍 Filtrar
            </button>
            <button onClick={exportarPDF} className="btn-export pdf">
              📄 PDF
            </button>
            <button onClick={exportarExcel} className="btn-export excel">
              📊 Excel
            </button>
          </div>
        </section>

        {/* Cards de Resumo */}
        {resumo && (
          <section className="resumo-cards">
            <div className="resumo-card destaque">
              <div className="resumo-icon">💰</div>
              <div className="resumo-info">
                <h3>Total Faturado</h3>
                <p className="valor">R$ {resumo.totalFaturado.toFixed(2)}</p>
              </div>
            </div>

            <div className="resumo-card pago">
              <div className="resumo-icon">✅</div>
              <div className="resumo-info">
                <h3>Total Pago</h3>
                <p className="valor">R$ {resumo.totalPago.toFixed(2)}</p>
              </div>
            </div>

            <div className="resumo-card pendente">
              <div className="resumo-icon">⏳</div>
              <div className="resumo-info">
                <h3>Pendente</h3>
                <p className="valor">R$ {resumo.totalPendente.toFixed(2)}</p>
              </div>
            </div>

            <div className="resumo-card">
              <div className="resumo-icon">🎫</div>
              <div className="resumo-info">
                <h3>Tickets</h3>
                <p className="valor">{resumo.totalTickets}</p>
              </div>
            </div>

            <div className="resumo-card">
              <div className="resumo-icon">📈</div>
              <div className="resumo-info">
                <h3>Ticket Médio</h3>
                <p className="valor">R$ {resumo.ticketMedio.toFixed(2)}</p>
              </div>
            </div>
          </section>
        )}

        {/* Tabela de Tickets */}
        <section className="tabela-section">
          <div className="tabela-header">
            <h2>Detalhamento dos Tickets</h2>
            <span className="periodo-info">
              {meses[mes]} de {ano}
            </span>
          </div>

          <div className="tabela-container">
            {tickets.length === 0 ? (
              <div className="sem-dados">
                <p>Nenhum ticket encontrado para este período.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Data Entrada</th>
                    <th>Data Prevista</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>#{ticket.id}</td>
                      <td>{ticket.cliente}</td>
                      <td className="valor-cell">R$ {ticket.valor.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>{new Date(ticket.dataEntrada).toLocaleDateString('pt-BR')}</td>
                      <td>{new Date(ticket.dataPrevista).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Rodapé do Relatório */}
        <footer className="relatorio-footer print-only">
          <p>Relatório gerado em {new Date().toLocaleString('pt-BR')}</p>
          <p>Lavanderia - Sistema de Gestão</p>
        </footer>
      </div>
    </div>
  );
};

export default RelatorioFinanceiro;
