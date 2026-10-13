import React, { useEffect, useMemo, useState } from 'react';
import './RelatorioFinanceiro.css';
import BackToHome from '../../buttons/BackToHome';
import { isTicketBaixado, listarTickets, Ticket } from '../../../service/apiTicket';
import { listarClientes, Cliente } from '../../../service/apiCliente';

type FormaPagamentoResumo = { forma: string; quantidade: number; total: number };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const getToday = () => new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const isSameDay = (value: string | undefined, selectedDate: string) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10) === selectedDate;
};

const getPaymentMethod = (ticket: Ticket) => {
  const payment = (ticket.formaPagamento || ticket.statusPagamentoDescricao || '').trim();
  if (!payment) return ticket.estaPago === 'sim' ? 'Não informado' : 'Pendente';
  const normalized = payment.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (normalized.includes('dinheiro')) return 'Dinheiro';
  if (normalized.includes('pix')) return 'Pix';
  if (normalized.includes('credito')) return 'Cartão de crédito';
  if (normalized.includes('debito')) return 'Cartão de débito';
  return payment;
};

const getReceivedAmount = (ticket: Ticket) => ticket.estaPago === 'sim'
  ? ticket.valorRecebido ?? ticket.totalPago ?? ticket.total
  : 0;

const getPendingAmount = (ticket: Ticket) => ticket.estaPago === 'sim' && !ticket.pagamentoPendente
  ? 0
  : ticket.valorPendente ?? ticket.total;

const RelatorioFinanceiro: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dinheiroContado, setDinheiroContado] = useState('');
  const [observacaoConferencia, setObservacaoConferencia] = useState('');
  const [formaFiltro, setFormaFiltro] = useState('todas');
  const [busca, setBusca] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');
      const [ticketsData, clientesData] = await Promise.all([listarTickets(), listarClientes()]);
      setTickets(ticketsData);
      setClientes(clientesData);
    } catch (requestError) {
      console.error(requestError);
      setError('Não foi possível carregar o fechamento de caixa. Verifique se a API local está ativa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const clientesById = useMemo(() => new Map(clientes.map((cliente) => [String(cliente.id), cliente])), [clientes]);
  const ticketsBaixados = useMemo(() => tickets
    .filter(isTicketBaixado)
    .filter((ticket) => isSameDay(ticket.dataBaixa || ticket.dataEntrega || ticket.dataCriacao, selectedDate))
    .filter((ticket) => formaFiltro === 'todas' || getPaymentMethod(ticket) === formaFiltro)
    .filter((ticket) => {
      const termo = busca.trim().toLowerCase();
      const cliente = ticket.cliente?.nome || clientesById.get(String(ticket.clienteId))?.nome || '';
      return !termo || ticket.ticketNumber.toLowerCase().includes(termo) || cliente.toLowerCase().includes(termo);
    })
    .sort((a, b) => new Date(b.dataBaixa || b.dataEntrega || 0).getTime() - new Date(a.dataBaixa || a.dataEntrega || 0).getTime()), [busca, clientesById, formaFiltro, selectedDate, tickets]);

  const formasDisponiveis = useMemo(() => [...new Set(tickets.map(getPaymentMethod))].sort(), [tickets]);

  const resumo = useMemo(() => {
    const totalRecebido = ticketsBaixados.reduce((total, ticket) => total + getReceivedAmount(ticket), 0);
    const totalPendente = ticketsBaixados.reduce((total, ticket) => total + getPendingAmount(ticket), 0);
    const dinheiroEsperado = ticketsBaixados.filter((ticket) => getPaymentMethod(ticket) === 'Dinheiro').reduce((total, ticket) => total + getReceivedAmount(ticket), 0);
    const formasPagamento = ticketsBaixados.reduce((formas, ticket) => {
      const forma = getPaymentMethod(ticket);
      const atual = formas.get(forma) ?? { forma, quantidade: 0, total: 0 };
      formas.set(forma, { forma, quantidade: atual.quantidade + 1, total: atual.total + getReceivedAmount(ticket) });
      return formas;
    }, new Map<string, FormaPagamentoResumo>());
    const contado = Number(dinheiroContado.replace(',', '.')) || 0;
    return { totalRecebido, totalPendente, dinheiroEsperado, contado, diferenca: contado - dinheiroEsperado, formasPagamento: [...formasPagamento.values()].sort((a, b) => b.total - a.total) };
  }, [dinheiroContado, ticketsBaixados]);

  const getClientName = (ticket: Ticket) => ticket.cliente?.nome || clientesById.get(String(ticket.clienteId))?.nome || 'Cliente não informado';

  const exportarCSV = () => {
    const csv = [['Ticket', 'Cliente', 'Baixa', 'Pagamento', 'Recebido', 'Pendente', 'Observação'].join(';'), ...ticketsBaixados.map((ticket) => [ticket.ticketNumber, getClientName(ticket), ticket.dataBaixa || ticket.dataEntrega || '', getPaymentMethod(ticket), getReceivedAmount(ticket).toFixed(2), getPendingAmount(ticket).toFixed(2), ticket.observacaoBaixa || ''].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';'))].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = `fechamento_caixa_${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) return <div className="relatorio-loading"><div className="spinner" /><p>Carregando fechamento de caixa...</p></div>;

  return <div className="relatorio-financeiro">
    <header className="relatorio-header no-print"><div className="header-title"><BackToHome variant="icon" /><div className="header-content"><h1>Fechamento de caixa</h1><p>Tickets baixados, valores recebidos e conferência do dinheiro.</p></div></div><div className="header-actions"><button className="btn-refresh" onClick={carregarDados}>Atualizar</button><button className="btn-export pdf" onClick={() => window.print()}>PDF</button><button className="btn-export excel" onClick={exportarCSV}>CSV</button></div></header>
    <div className="relatorio-content">
      <section className="filtros-section no-print"><div className="filtros-group"><label htmlFor="data-caixa">Data do caixa</label><input id="data-caixa" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></div><div className="filtros-group"><label htmlFor="forma-pagamento">Forma de pagamento</label><select id="forma-pagamento" value={formaFiltro} onChange={(event) => setFormaFiltro(event.target.value)}><option value="todas">Todas</option>{formasDisponiveis.map((forma) => <option key={forma} value={forma}>{forma}</option>)}</select></div><div className="filtros-group"><label htmlFor="busca-financeira">Buscar ticket ou cliente</label><input id="busca-financeira" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Ex.: 125 ou Maria" /></div><div className="filtros-group"><label htmlFor="dinheiro-contado">Dinheiro contado</label><input id="dinheiro-contado" type="number" step="0.01" min="0" value={dinheiroContado} onChange={(event) => setDinheiroContado(event.target.value)} placeholder="0,00" /></div><div className="filtros-group filtros-group-wide"><label htmlFor="observacao-caixa">Observação da conferência</label><input id="observacao-caixa" value={observacaoConferencia} onChange={(event) => setObservacaoConferencia(event.target.value)} placeholder="Ex.: conferido com a gaveta principal" /></div></section>
      {error && <section className="relatorio-alert no-print">{error}</section>}
      <section className="resumo-cards"><article className="resumo-card destaque"><span>Tickets baixados</span><strong>{ticketsBaixados.length}</strong><small>Entregas registradas na data</small></article><article className="resumo-card pago"><span>Valor recebido</span><strong>{formatCurrency(resumo.totalRecebido)}</strong><small>Tickets pagos</small></article><article className="resumo-card caixa"><span>Dinheiro esperado</span><strong>{formatCurrency(resumo.dinheiroEsperado)}</strong><small>Somente pagamentos em dinheiro</small></article><article className="resumo-card pendente"><span>Valor pendente</span><strong>{formatCurrency(resumo.totalPendente)}</strong><small>Entregas com pagamento em aberto</small></article><article className={`resumo-card ${resumo.diferenca === 0 ? 'positivo' : 'alerta'}`}><span>Diferença de caixa</span><strong>{formatCurrency(resumo.diferenca)}</strong><small>Contado menos esperado</small></article></section>
      <section className="conferencia-grid"><article className="conferencia-card"><div className="card-title"><div><span className="kicker">Conferência</span><h2>Fechamento em dinheiro</h2></div></div><div className="cash-summary"><div><span>Dinheiro contado</span><strong>{formatCurrency(resumo.contado)}</strong></div><div><span>Diferença atual</span><strong>{formatCurrency(resumo.diferenca)}</strong></div><div><span>Observação</span><p>{observacaoConferencia || 'Sem observação'}</p></div></div></article><article className="conferencia-card"><div className="card-title"><div><span className="kicker">Resumo por forma</span><h2>Entradas do dia</h2></div></div><div className="forma-list">{resumo.formasPagamento.length ? resumo.formasPagamento.map((forma) => <div key={forma.forma} className="forma-item"><div><strong>{forma.forma}</strong><span>{forma.quantidade} ticket(s)</span></div><strong>{formatCurrency(forma.total)}</strong></div>) : <div className="empty-state">Nenhum ticket baixado para esta data.</div>}</div></article></section>
      <section className="tabela-section"><div className="tabela-header"><h2>Tickets baixados do dia</h2><span className="periodo-info">{new Date(`${selectedDate}T00:00:00`).toLocaleDateString('pt-BR')}</span></div><div className="tabela-container">{ticketsBaixados.length === 0 ? <div className="sem-dados">Nenhum ticket baixado foi encontrado para este dia.</div> : <table><thead><tr><th>Ticket</th><th>Cliente</th><th>Baixa</th><th>Pagamento</th><th>Recebido</th><th>Pendente</th></tr></thead><tbody>{ticketsBaixados.map((ticket) => <tr key={ticket.id}><td>#{ticket.ticketNumber}</td><td>{getClientName(ticket)}</td><td>{new Date(ticket.dataBaixa || ticket.dataEntrega || '').toLocaleString('pt-BR')}</td><td>{getPaymentMethod(ticket)}</td><td className="valor-cell">{formatCurrency(getReceivedAmount(ticket))}</td><td>{formatCurrency(getPendingAmount(ticket))}</td></tr>)}</tbody></table>}</div></section>
    </div>
  </div>;
};

export default RelatorioFinanceiro;
