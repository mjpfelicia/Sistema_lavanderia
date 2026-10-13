import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BackToHome from '../../buttons/BackToHome';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import { calcularResumoFinanceiro, getTicketsBaixadosNaData, getToday } from './financeiro';
import './CaixaDiario.css';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

type CaixaSalvo = { abertura: string; contado: string; observacao: string };

const CaixaDiario: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [abertura, setAbertura] = useState('');
  const [contado, setContado] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const storageKey = `lavanderia:caixa:${selectedDate}`;

  const carregarTickets = async () => {
    try {
      setLoading(true);
      setError('');
      setTickets(await listarTickets());
    } catch (requestError) {
      console.error(requestError);
      setError('Não foi possível carregar os lançamentos do caixa. Verifique se a API local está ativa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarTickets(); }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const caixa: CaixaSalvo = saved ? JSON.parse(saved) : { abertura: '', contado: '', observacao: '' };
    setAbertura(caixa.abertura);
    setContado(caixa.contado);
    setObservacao(caixa.observacao);
  }, [storageKey]);

  const ticketsDoDia = useMemo(() => getTicketsBaixadosNaData(tickets, selectedDate), [selectedDate, tickets]);
  const resumo = useMemo(() => calcularResumoFinanceiro(ticketsDoDia), [ticketsDoDia]);
  const aberturaValor = Number(abertura.replace(',', '.')) || 0;
  const contadoValor = Number(contado.replace(',', '.')) || 0;
  const esperadoNoCaixa = aberturaValor + resumo.dinheiroEsperado;
  const diferenca = contadoValor - esperadoNoCaixa;

  const salvarConferencia = () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ abertura, contado, observacao }));
  };

  if (loading) return <div className="caixa-loading"><div className="spinner" /><p>Carregando caixa...</p></div>;

  return <main className="caixa-page">
    <header className="caixa-header"><div className="caixa-title"><BackToHome variant="icon" /><div><span>Financeiro</span><h1>Caixa diário</h1><p>Faça a conferência dos pagamentos em dinheiro e registre o fechamento do dia.</p></div></div><div className="caixa-actions"><Link to="/admin/financeiro">Relatório financeiro</Link><button onClick={carregarTickets}>Atualizar tickets</button></div></header>
    <section className="caixa-content">
      <div className="caixa-controls"><label htmlFor="caixa-data">Data do caixa<input id="caixa-data" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label><label htmlFor="caixa-abertura">Fundo de troco<input id="caixa-abertura" type="number" min="0" step="0.01" value={abertura} onChange={(event) => setAbertura(event.target.value)} placeholder="0,00" /></label><label htmlFor="caixa-contado">Dinheiro contado<input id="caixa-contado" type="number" min="0" step="0.01" value={contado} onChange={(event) => setContado(event.target.value)} placeholder="0,00" /></label><label className="caixa-observacao" htmlFor="caixa-observacao">Observação<textarea id="caixa-observacao" value={observacao} onChange={(event) => setObservacao(event.target.value)} placeholder="Ex.: retirada para pagamento de fornecedor" /></label><button className="caixa-save" onClick={salvarConferencia}>Salvar conferência</button></div>
      {error && <p className="caixa-alert">{error}</p>}
      <div className="caixa-summary"><article><span>Tickets baixados</span><strong>{ticketsDoDia.length}</strong></article><article><span>Recebido no dia</span><strong>{formatCurrency(resumo.totalRecebido)}</strong></article><article><span>Dinheiro esperado</span><strong>{formatCurrency(esperadoNoCaixa)}</strong><small>Troco + pagamentos em dinheiro</small></article><article className={diferenca === 0 ? 'is-balanced' : 'is-different'}><span>Diferença</span><strong>{formatCurrency(diferenca)}</strong><small>{diferenca === 0 ? 'Caixa conferido' : 'Revise a contagem'}</small></article></div>
      <section className="caixa-details"><div><h2>Entradas por forma de pagamento</h2>{resumo.formasPagamento.length ? resumo.formasPagamento.map((forma) => <p key={forma.forma}><span>{forma.forma} · {forma.quantidade} ticket(s)</span><strong>{formatCurrency(forma.total)}</strong></p>) : <p className="caixa-empty">Nenhuma baixa para esta data.</p>}</div><div><h2>Pagamentos pendentes</h2><strong className="caixa-pending">{formatCurrency(resumo.totalPendente)}</strong><p>Valores ainda em aberto nos tickets já entregues.</p></div></section>
    </section>
  </main>;
};

export default CaixaDiario;
