import React, { useEffect, useMemo, useState } from 'react';
import './RelatorioFinanceiro.css';
import BackToHome from '../../buttons/BackToHome';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import { listarClientes, Cliente } from '../../../service/apiCliente';

type FormaPagamentoResumo = {
  forma: string;
  quantidade: number;
  total: number;
};

type CaixaDiaResumo = {
  totalRecebido: number;
  totalPendente: number;
  dinheiroEsperado: number;
  dinheiroContadoValor: number;
  diferencaCaixa: number;
  ticketsPagos: Ticket[];
  ticketsNaoPagos: Ticket[];
  formasPagamento: FormaPagamentoResumo[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
type PeriodoTipo = 'dia' | 'mes';

const RelatorioFinanceiro: React.FC = () => {
  const [periodoTipo, setPeriodoTipo] = useState<PeriodoTipo>('mes');
  const [dia, setDia] = useState<number>(new Date().getDate());
  const [mes, setMes] = useState<number>(new Date().getMonth());
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const isSameDay = (value?: string, selectedDate?: string) => {
  if (!value || !selectedDate) {
    return false;
  }
  // Gerar dias do mês atual (considerando anos bissextos)
  const getDiasDoMes = () => {
    return new Date(ano, mes + 1, 0).getDate();
  };

  const dias = Array.from({ length: getDiasDoMes() }, (_, i) => i + 1);

  useEffect(() => {
    carregarDados();
  }, [periodoTipo, dia, mes, ano, filtroStatus]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/tickets`);
      let todosTickets = response.data;

      // Filtrar por período (dia ou mês) e ano
      let ticketsFiltrados = todosTickets.filter((t: any) => {
        const dataEntrada = new Date(t.dataEntrada);
        const mesMatch = dataEntrada.getMonth() === mes;
        const anoMatch = dataEntrada.getFullYear() === ano;
        
        if (periodoTipo === 'dia') {
          const diaMatch = dataEntrada.getDate() === dia;
          return diaMatch && mesMatch && anoMatch;
        }
        
        // Se for mês, filtra apenas por mês e ano
        return mesMatch && anoMatch;
      });

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return localDate === selectedDate;
};

const getPaymentMethod = (ticket: Ticket) => {
  const payment = (ticket.formaPagamento || ticket.statusPagamentoDescricao || '').trim();

  if (!payment) {
    return ticket.estaPago === 'sim' ? 'Nao informado' : 'Pendente';
  }

  const normalized = payment.toLowerCase();

  if (normalized.includes('dinheiro')) {
    return 'Dinheiro';
  }

  if (normalized.includes('pix')) {
    return 'Pix';
  }

  if (normalized.includes('credito')) {
    return 'Cartao de Credito';
  }

  if (normalized.includes('debito')) {
    return 'Cartao de Debito';
  }

  return payment;
};

const getReceivedAmount = (ticket: Ticket) =>
  ticket.estaPago === 'sim'
    ? ticket.valorRecebido ?? ticket.totalPago ?? ticket.total
    : 0;

const getPendingAmount = (ticket: Ticket) => {
  if (ticket.pagamentoPendente) {
    return ticket.valorPendente ?? ticket.total;
  }

  return ticket.estaPago === 'sim' ? 0 : ticket.valorPendente ?? ticket.total;
};

const getClientName = (ticket: Ticket, clientesById: Map<string, Cliente>) =>
  ticket.cliente?.nome ||
  clientesById.get(String(ticket.clienteId))?.nome ||
  'Cliente nao informado';

const RelatorioFinanceiro: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dinheiroContado, setDinheiroContado] = useState('');
  const [observacaoConferencia, setObservacaoConferencia] = useState('');

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
        setError('Nao foi possivel carregar o fechamento de caixa. Verifique se a API local esta ativa.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const ticketsBaixados = useMemo(
    () =>
      tickets
        .filter((ticket) => ticket.statusEntrega === 'Entregue')
        .filter((ticket) => isSameDay(ticket.dataBaixa || ticket.dataEntrega || ticket.dataCriacao, selectedDate))
        .sort((a, b) => new Date(b.dataBaixa || b.dataEntrega || 0).getTime() - new Date(a.dataBaixa || a.dataEntrega || 0).getTime()),
    [selectedDate, tickets],
  );

  const clientesById = useMemo(
    () => new Map(clientes.map((cliente) => [String(cliente.id), cliente])),
    [clientes],
  );

  const resumo = useMemo<CaixaDiaResumo>(() => {
    const totalRecebido = ticketsBaixados.reduce((acc, ticket) => acc + getReceivedAmount(ticket), 0);
    const totalPendente = ticketsBaixados.reduce((acc, ticket) => acc + getPendingAmount(ticket), 0);
    const ticketsPagos = ticketsBaixados.filter((ticket) => ticket.estaPago === 'sim');
    const ticketsNaoPagos = ticketsBaixados.filter((ticket) => ticket.estaPago !== 'sim');

    const formasPagamento = ticketsBaixados.reduce((acc, ticket) => {
      const forma = getPaymentMethod(ticket);
      const current = acc.get(forma) ?? { forma, quantidade: 0, total: 0 };
      acc.set(forma, {
        forma,
        quantidade: current.quantidade + 1,
        total: current.total + getReceivedAmount(ticket),
      });
      return acc;
    }, new Map<string, FormaPagamentoResumo>());

    const dinheiroEsperado = ticketsBaixados
      .filter((ticket) => getPaymentMethod(ticket) === 'Dinheiro')
      .reduce((acc, ticket) => acc + getReceivedAmount(ticket), 0);

    return {
      totalRecebido,
      totalPendente,
      ticketsPagos,
      ticketsNaoPagos,
      dinheiroEsperado,
      dinheiroContadoValor: Number(dinheiroContado.replace(',', '.')) || 0,
      diferencaCaixa: (Number(dinheiroContado.replace(',', '.')) || 0) - dinheiroEsperado,
      formasPagamento: [...formasPagamento.values()].sort((a, b) => b.total - a.total),
    };
  }, [dinheiroContado, ticketsBaixados]);

  const exportarCSV = () => {
    const headers = ['Ticket', 'Cliente', 'Baixa', 'Pagamento', 'Valor', 'Observacao'];
    const csvContent = [
      headers.join(';'),
      ...ticketsBaixados.map((ticket) => [
        `#${ticket.ticketNumber}`,
        getClientName(ticket, clientesById),
        new Date(ticket.dataBaixa || ticket.dataEntrega || '').toLocaleString('pt-BR'),
        getPaymentMethod(ticket),
        formatCurrency(ticket.valorRecebido ?? ticket.totalPago ?? ticket.total),
        ticket.observacaoBaixa || '',
      ].join(';')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fechamento_caixa_${selectedDate}.csv`;
    
    const nomeArquivo = periodoTipo === 'dia'
      ? `relatorio_financeiro_dia_${dia}_${meses[mes]}_${ano}.csv`
      : `relatorio_financeiro_${meses[mes]}_${ano}.csv`;
    
    link.download = nomeArquivo;
    link.click();
  };

  const exportarPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="relatorio-loading">
        <div className="spinner"></div>
        <p>Carregando fechamento de caixa...</p>
      </div>
    );
  }

  return (
    <div className="relatorio-financeiro">
      <header className="relatorio-header no-print">
        <div className="header-title">
          <BackToHome variant="icon" />
          <div className="header-content">
            <h1>Fechamento de caixa</h1>
            <p>Tickets baixados, valores recebidos e conferencia do dinheiro do dia</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-refresh" onClick={() => window.location.reload()}>
            Atualizar
          </button>
          <button className="btn-export pdf" onClick={exportarPDF}>
            PDF
          </button>
          <button className="btn-export excel" onClick={exportarCSV}>
            CSV
          </button>
        </div>
      </header>

      <div className="relatorio-content">
        <section className="filtros-section no-print">
          {/* Tipo de Período */}
          <div className="filtros-group periodo-selector">
            <label>Período:</label>
            <div className="periodo-buttons">
              <button 
                className={`btn-periodo ${periodoTipo === 'dia' ? 'ativo' : ''}`}
                onClick={() => setPeriodoTipo('dia')}
              >
                📅 Por Dia
              </button>
              <button 
                className={`btn-periodo ${periodoTipo === 'mes' ? 'ativo' : ''}`}
                onClick={() => setPeriodoTipo('mes')}
              >
                📆 Por Mês
              </button>
            </div>
          </div>

          {/* Seletor de Dia (apenas quando período é dia) */}
          {periodoTipo === 'dia' && (
            <div className="filtros-group">
              <label>Dia:</label>
              <select value={dia} onChange={(e) => setDia(Number(e.target.value))}>
                {dias.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {/* Seletor de Mês (sempre visível) */}
          <div className="filtros-group">
            <label>Data do caixa</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>

          <div className="filtros-group">
            <label>Dinheiro contado</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={dinheiroContado}
              onChange={(e) => setDinheiroContado(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="filtros-group filtros-group-wide">
            <label>Observacao da conferencia</label>
            <input
              type="text"
              value={observacaoConferencia}
              onChange={(e) => setObservacaoConferencia(e.target.value)}
              placeholder="Ex.: conferido com a gaveta principal"
            />
          </div>
        </section>

        {error ? <section className="relatorio-alert no-print">{error}</section> : null}

        <section className="resumo-cards">
          <article className="resumo-card destaque">
            <span>Tickets baixados</span>
            <strong>{ticketsBaixados.length}</strong>
            <small>Entregas registradas na data selecionada</small>
          </article>

          <article className="resumo-card pago">
            <span>Valor recebido</span>
            <strong>{formatCurrency(resumo.totalRecebido)}</strong>
            <small>Soma dos tickets entregues e pagos</small>
          </article>

          <article className="resumo-card caixa">
            <span>Dinheiro esperado</span>
            <strong>{formatCurrency(resumo.dinheiroEsperado)}</strong>
            <small>Somente tickets recebidos em dinheiro</small>
          </article>

          <article className="resumo-card pendente">
            <span>Valor pendente</span>
            <strong>{formatCurrency(resumo.totalPendente)}</strong>
            <small>Entregas baixadas com recebimento em aberto</small>
          </article>

          <article className={`resumo-card ${resumo.diferencaCaixa === 0 ? 'positivo' : 'alerta'}`}>
            <span>Diferença de caixa</span>
            <strong>{formatCurrency(resumo.diferencaCaixa)}</strong>
            <small>Comparacao entre contado e esperado</small>
          </article>
        </section>

        <section className="conferencia-grid">
          <article className="conferencia-card">
            <div className="card-title">
              <div>
                <span className="kicker">Conferencia</span>
                <h2>Fechamento em dinheiro</h2>
              </div>
            </div>

            <div className="cash-summary">
              <div>
                <span>Dinheiro contado</span>
                <strong>{dinheiroContado ? formatCurrency(Number(dinheiroContado.replace(',', '.')) || 0) : 'R$ 0,00'}</strong>
              </div>
              <div>
                <span>Tickets pagos</span>
                <strong>{resumo.ticketsPagos.length}</strong>
              </div>
              <div>
                <span>Tickets pendentes</span>
                <strong>{resumo.ticketsNaoPagos.length}</strong>
              </div>
              <div>
                <span>Valor em aberto</span>
                <strong>{formatCurrency(resumo.totalPendente)}</strong>
              </div>
              <div>
                <span>Diferença atual</span>
                <strong>{formatCurrency(resumo.diferencaCaixa)}</strong>
              </div>
              <div>
                <span>Observacao</span>
                <p>{observacaoConferencia || 'Sem observacao'}</p>
              </div>
            </div>
          </article>

          <article className="conferencia-card">
            <div className="card-title">
              <div>
                <span className="kicker">Resumo por forma</span>
                <h2>Entradas do dia</h2>
              </div>
            </div>

            <div className="forma-list">
              {resumo.formasPagamento.length ? (
                resumo.formasPagamento.map((forma) => (
                  <div key={forma.forma} className="forma-item">
                    <div>
                      <strong>{forma.forma}</strong>
                      <span>{forma.quantidade} ticket(s)</span>
                    </div>
                    <strong>{formatCurrency(forma.total)}</strong>
                  </div>
                ))
              ) : (
                <div className="empty-state">Nenhum ticket baixado para esta data.</div>
              )}
            </div>
          </article>
        </section>

        <section className="tabela-section">
          <div className="tabela-header">
            <h2>Tickets baixados do dia</h2>
            <span className="periodo-info">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
            <h2>Detalhamento dos Tickets</h2>
            <span className="periodo-info">
              {periodoTipo === 'dia' 
                ? `Dia ${dia} de ${meses[mes]} de ${ano}`
                : `${meses[mes]} de ${ano}`
              }
            </span>
          </div>

          <div className="tabela-container">
            {ticketsBaixados.length === 0 ? (
              <div className="sem-dados">Nenhum ticket baixado foi encontrado para este dia.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Cliente</th>
                    <th>Baixa</th>
                    <th>Pagamento</th>
                    <th>Valor</th>
                    <th>Pendente</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsBaixados.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>#{ticket.ticketNumber}</td>
                      <td>{getClientName(ticket, clientesById)}</td>
                      <td>{new Date(ticket.dataBaixa || ticket.dataEntrega || '').toLocaleString('pt-BR')}</td>
                      <td>{getPaymentMethod(ticket)}</td>
                      <td className="valor-cell">{formatCurrency(getReceivedAmount(ticket))}</td>
                      <td>{formatCurrency(getPendingAmount(ticket))}</td>
                      <td>
                        <span className={`status-badge ${ticket.estaPago === 'sim' ? 'status-pago' : 'status-pendente'}`}>
                          {ticket.estaPago === 'sim' ? 'Recebido' : 'A receber'}
                        </span>
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

export default RelatorioFinanceiro;
