import {
  calcularResumoFinanceiro,
  getPaymentMethod,
  getTicketsBaixadosNaData,
} from './financeiro';

const ticketBase = {
  id: '1',
  clienteId: 'cliente-1',
  ticketNumber: '1001',
  estaPago: 'sim',
  totalPago: 50,
  total: 50,
  items: [],
  dataEntrega: '2026-09-02T12:00:00.000Z',
  dataBaixa: '2026-09-02T15:00:00.000Z',
};

describe('financeiro', () => {
  it('normaliza formas de pagamento conhecidas', () => {
    expect(getPaymentMethod({ ...ticketBase, formaPagamento: 'Pagamento em crédito' })).toBe('Cartão de crédito');
    expect(getPaymentMethod({ ...ticketBase, formaPagamento: 'PIX' })).toBe('Pix');
  });

  it('considera somente tickets baixados na data selecionada', () => {
    const tickets = [
      ticketBase,
      { ...ticketBase, id: '2', ticketNumber: '1002', dataBaixa: '2026-09-01T15:00:00.000Z' },
      { ...ticketBase, id: '3', ticketNumber: '1003', statusEntrega: 'Em producao', dataBaixa: undefined },
    ];

    expect(getTicketsBaixadosNaData(tickets, '2026-09-02').map((ticket) => ticket.ticketNumber)).toEqual(['1001']);
  });

  it('soma valores recebidos, pendências e dinheiro esperado', () => {
    const resumo = calcularResumoFinanceiro([
      { ...ticketBase, formaPagamento: 'Dinheiro', valorRecebido: 45 },
      { ...ticketBase, id: '2', ticketNumber: '1002', formaPagamento: 'Pix', valorRecebido: 30, total: 30, totalPago: 30 },
      { ...ticketBase, id: '3', ticketNumber: '1003', estaPago: 'nao', total: 20, totalPago: 0, valorPendente: 20, pagamentoPendente: true },
    ]);

    expect(resumo.totalRecebido).toBe(75);
    expect(resumo.totalPendente).toBe(20);
    expect(resumo.dinheiroEsperado).toBe(45);
    expect(resumo.formasPagamento).toHaveLength(3);
  });
});
