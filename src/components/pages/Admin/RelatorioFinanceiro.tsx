import React, { useEffect, useMemo, useState } from 'react';
import './RelatorioFinanceiro.css';
import BackToHome from '../../buttons/BackToHome';
import { listarTickets, Ticket } from '../../../service/apiTicket';

type FormaPagamentoResumo = {
  forma: string;
  quantidade: number;
  total: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const isSameDay = (value?: string, selectedDate?: string) => {
  if (!value || !selectedDate) {
    return false;
  }

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

const RelatorioFinanceiro: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dinheiroContado, setDinheiroContado] = useState('');
  const [observacaoConferencia, setObservacaoConferencia] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setError('');
        const ticketsData = await listarTickets();
        setTickets(ticketsData);
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

  const resumo = useMemo(() => {
    const totalRecebido = ticketsBaixados.reduce((acc, ticket) => acc + (ticket.valorRecebido ?? ticket.totalPago ?? ticket.total), 0);
    const ticketsPagos = ticketsBaixados.filter((ticket) => ticket.estaPago === 'sim');
    const ticketsNaoPagos = ticketsBaixados.filter((ticket) => ticket.estaPago !== 'sim');

    const formasPagamento = ticketsBaixados.reduce((acc, ticket) => {
      const forma = getPaymentMethod(ticket);
      const current = acc.get(forma) ?? { forma, quantidade: 0, total: 0 };
      acc.set(forma, {
        forma,
        quantidade: current.quantidade + 1,
        total: current.total + (ticket.valorRecebido ?? ticket.totalPago ?? ticket.total),
      });
      return acc;
    }, new Map<string, FormaPagamentoResumo>());

    const dinheiroEsperado = ticketsBaixados
      .filter((ticket) => getPaymentMethod(ticket) === 'Dinheiro')
      .reduce((acc, ticket) => acc + (ticket.valorRecebido ?? ticket.totalPago ?? ticket.total), 0);

    return {
      totalRecebido,
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
        ticket.cliente?.nome || 'Cliente nao informado',
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
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsBaixados.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>#{ticket.ticketNumber}</td>
                      <td>{ticket.cliente?.nome || 'Cliente nao informado'}</td>
                      <td>{new Date(ticket.dataBaixa || ticket.dataEntrega || '').toLocaleString('pt-BR')}</td>
                      <td>{getPaymentMethod(ticket)}</td>
                      <td className="valor-cell">{formatCurrency(ticket.valorRecebido ?? ticket.totalPago ?? ticket.total)}</td>
                      <td>
                        <span className={`status-badge ${ticket.estaPago === 'sim' ? 'status-pago' : 'status-pendente'}`}>
                          {ticket.estaPago === 'sim' ? 'Recebido' : 'Pendente'}
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
