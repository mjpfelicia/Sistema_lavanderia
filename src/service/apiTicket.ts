import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { Cliente } from './apiCliente';

export type TicketItem = {
  quantidade: number;
  pecaId?: string;
  servicoId?: number;
  subTipo: string;
  total: number;
  cores?: string;
  estampa?: string;
  marca?: string;
  defeitos?: string;
  servicos?: string;
};

export type Ticket = {
  id?: string;
  clienteId: string;
  ticketNumber: string;
  estaPago: 'sim' | 'nao' | 'não' | 'nÃ£o';
  totalPago: number;
  items: TicketItem[];
  total: number;
  dataCriacao?: string;
  dataEntrega: string;
  dataBaixa?: string;
  dataPagamento?: string;
  tipoAtendimento?: 'Entrega' | 'Retirada';
  formaPagamento?: string;
  statusPagamentoDescricao?: string;
  statusEntrega?: 'Aguardando retirada' | 'Em producao' | 'Pronto' | 'Liberado' | 'Entregue';
  valorRecebido?: number;
  valorPendente?: number;
  pagamentoPendente?: boolean;
  observacaoBaixa?: string;
  cliente?: Cliente;
};

const api = axios.create({
  baseURL: `${config.apiUrl}/ticket`,
});

const notificarAtualizacaoDashboard = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event('lavanderia:data-changed'));
};

const handleError = (error: AxiosError | any): never => {
  const errorMessage = error.response?.data?.message || error.message || 'Erro na API';
  console.error(`[Ticket ERROR][${error.config?.url}]`, errorMessage);
  throw new Error(errorMessage);
};

export const buscarTicket = async (ticketNumber: string): Promise<Ticket | null> => {
  const normalizedTicketNumber = ticketNumber.trim();

  console.info(`API Ticket - buscarTicket ${normalizedTicketNumber}`);

  return api
    .get<Ticket[]>('/', {
      params: {
        ticketNumber: normalizedTicketNumber,
        _embed: 'cliente',
      },
    })
    .then(response => {
      const [ticketMaisRecente] = [...response.data].sort((a, b) => {
        const dataA = new Date(a.dataCriacao || 0).getTime();
        const dataB = new Date(b.dataCriacao || 0).getTime();
        return dataB - dataA;
      });

      return ticketMaisRecente || null;
    })
    .catch(handleError);
};

export const criarTicket = async (ticket: Ticket): Promise<Ticket> => {
  console.info('API Ticket - criar Ticket ');
  return api
    .post<Ticket>('/', ticket)
    .then(response => {
      notificarAtualizacaoDashboard();
      return response.data;
    })
    .catch(handleError);
};

export const listarTickets = async (): Promise<Ticket[]> => {
  console.info('API Ticket - listar Tickets ');
  return api
    .get<Ticket[]>('/', {
      params: {
        _embed: 'cliente',
      },
    })
    .then(response => response.data)
    .catch(handleError);
};

export const getTicket = async (ticketNumber: string): Promise<Ticket> => {
  console.info('API Ticket - getTicket ');
  return api
    .get<Ticket[]>('/', {
      params: {
        ticketNumber: ticketNumber.trim(),
        _embed: 'cliente',
      },
    })
    .then(response => {
      const [ticketMaisRecente] = [...response.data].sort((a, b) => {
        const dataA = new Date(a.dataCriacao || 0).getTime();
        const dataB = new Date(b.dataCriacao || 0).getTime();
        return dataB - dataA;
      });

      if (!ticketMaisRecente) {
        throw new Error('Ticket nao encontrado.');
      }

      return ticketMaisRecente;
    })
    .catch(handleError);
};

export const atualizaTicket = async (ticket: Ticket): Promise<Ticket> => {
  console.info('API Ticket - atualiza Ticket ', { ticket });
  return api
    .patch<Ticket>(`/${ticket.id}`, ticket)
    .then(response => {
      notificarAtualizacaoDashboard();
      return response.data;
    })
    .catch(handleError);
};

export const registrarBaixaTicket = async (
  ticket: Ticket,
  extras?: {
    marcarComoPago?: boolean;
    deixarPendente?: boolean;
    formaPagamento?: string;
    valorRecebido?: number;
    observacaoBaixa?: string;
  },
): Promise<Ticket> => {
  if (!ticket.id) {
    throw new Error('Ticket sem identificador para registrar baixa.');
  }

  const payload: Ticket = {
    ...ticket,
    statusEntrega: 'Entregue',
    dataBaixa: new Date().toISOString(),
    observacaoBaixa: extras?.observacaoBaixa ?? ticket.observacaoBaixa,
  };

  if (extras?.deixarPendente) {
    const valorPendente = extras.valorRecebido ?? ticket.valorPendente ?? ticket.total;

    payload.estaPago = 'nao';
    payload.formaPagamento = ticket.formaPagamento || 'Pendente';
    payload.statusPagamentoDescricao = 'Pendente';
    payload.totalPago = 0;
    payload.valorRecebido = 0;
    payload.valorPendente = valorPendente;
    payload.pagamentoPendente = true;

    return atualizaTicket(payload);
  }

  if (extras?.marcarComoPago) {
    const formaPagamento = extras.formaPagamento?.trim();
    const valorRecebido = extras.valorRecebido ?? ticket.valorRecebido ?? ticket.total;

    payload.estaPago = 'sim';
    payload.formaPagamento = formaPagamento || ticket.formaPagamento || 'Nao informado';
    payload.statusPagamentoDescricao = `Pago com ${payload.formaPagamento}`;
    payload.totalPago = valorRecebido;
    payload.valorRecebido = valorRecebido;
    payload.valorPendente = 0;
    payload.pagamentoPendente = false;
    payload.dataPagamento = new Date().toISOString();
  }

  return atualizaTicket(payload);
};

export const regularizarPagamentoTicket = async (
  ticket: Ticket,
  extras: {
    formaPagamento: string;
    valorRecebido: number;
    observacaoBaixa?: string;
  },
): Promise<Ticket> => {
  if (!ticket.id) {
    throw new Error('Ticket sem identificador para regularizar pagamento.');
  }

  return registrarBaixaTicket(ticket, {
    marcarComoPago: true,
    formaPagamento: extras.formaPagamento,
    valorRecebido: extras.valorRecebido,
    observacaoBaixa: extras.observacaoBaixa,
  });
};
