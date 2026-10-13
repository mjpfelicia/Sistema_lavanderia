import { isTicketBaixado, Ticket } from '../../../service/apiTicket';

export type FormaPagamentoResumo = {
  forma: string;
  quantidade: number;
  total: number;
};

export type ResumoFinanceiro = {
  totalRecebido: number;
  totalPendente: number;
  dinheiroEsperado: number;
  formasPagamento: FormaPagamentoResumo[];
};

export const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const isSameDay = (value: string | undefined, selectedDate: string) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10) === selectedDate;
};

export const getPaymentMethod = (ticket: Ticket) => {
  const payment = (ticket.formaPagamento || ticket.statusPagamentoDescricao || '').trim();
  if (!payment) return ticket.estaPago === 'sim' ? 'Não informado' : 'Pendente';

  const normalized = payment.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (normalized.includes('dinheiro')) return 'Dinheiro';
  if (normalized.includes('pix')) return 'Pix';
  if (normalized.includes('credito')) return 'Cartão de crédito';
  if (normalized.includes('debito')) return 'Cartão de débito';
  return payment;
};

export const getReceivedAmount = (ticket: Ticket) =>
  ticket.estaPago === 'sim' ? ticket.valorRecebido ?? ticket.totalPago ?? ticket.total : 0;

export const getPendingAmount = (ticket: Ticket) =>
  ticket.estaPago === 'sim' && !ticket.pagamentoPendente ? 0 : ticket.valorPendente ?? ticket.total;

export const getTicketsBaixadosNaData = (tickets: Ticket[], selectedDate: string) =>
  tickets
    .filter(isTicketBaixado)
    .filter((ticket) => isSameDay(ticket.dataBaixa || ticket.dataEntrega || ticket.dataCriacao, selectedDate))
    .sort((a, b) => new Date(b.dataBaixa || b.dataEntrega || 0).getTime() - new Date(a.dataBaixa || a.dataEntrega || 0).getTime());

export const calcularResumoFinanceiro = (tickets: Ticket[]): ResumoFinanceiro => {
  const formas = new Map<string, FormaPagamentoResumo>();
  let totalRecebido = 0;
  let totalPendente = 0;
  let dinheiroEsperado = 0;

  tickets.forEach((ticket) => {
    const recebido = getReceivedAmount(ticket);
    const pendente = getPendingAmount(ticket);
    const forma = getPaymentMethod(ticket);
    const atual = formas.get(forma) ?? { forma, quantidade: 0, total: 0 };

    totalRecebido += recebido;
    totalPendente += pendente;
    if (forma === 'Dinheiro') dinheiroEsperado += recebido;
    formas.set(forma, { forma, quantidade: atual.quantidade + 1, total: atual.total + recebido });
  });

  return {
    totalRecebido,
    totalPendente,
    dinheiroEsperado,
    formasPagamento: [...formas.values()].sort((first, second) => second.total - first.total),
  };
};
