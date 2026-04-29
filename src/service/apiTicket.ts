import axios, { AxiosError } from 'axios';
import { Cliente } from './apiCliente';

export type TicketItem = {
  quantidade: number;
  pecaId?: string;
  servicoId?: number;
  subTipo: string;
  total: number;
  cores?: string;
  marca?: string;
  defeitos?: string;
  servicos?: string;
};

export type Ticket = {
  id?: string;
  clienteId: string;
  ticketNumber: string;
  estaPago: "sim" | "nÃ£o";
  totalPago: number;
  items: TicketItem[];
  total: number;
  dataCriacao?: string;
  dataEntrega: string;
  tipoAtendimento?: "Entrega" | "Retirada";
  formaPagamento?: string;
  statusPagamentoDescricao?: string;
  statusEntrega?: "Aguardando retirada" | "Em producao" | "Pronto" | "Liberado";
  cliente?: Cliente;
};

const api = axios.create({
  baseURL: 'http://localhost:3008/ticket',
});

const handleError = (error: AxiosError | any): never => {
  const errorMessage = error.response?.data?.message || error.message || 'Erro na API';
  console.error(`[Ticket ERROR][${error.config?.url}]`, errorMessage);
  throw new Error(errorMessage);
};

export const buscarTicket = async (ticketNumber: string): Promise<Ticket | null> => {
  console.info(`API Ticket - buscarTicket ${ticketNumber}`);

  return api
    .get<Ticket>(`/${ticketNumber}`)
    .then(response => response.data)
    .catch(handleError);
};

export const criarTicket = async (ticket: Ticket): Promise<Ticket> => {
  console.info("API Ticket - criar Ticket ");
  return api
    .post<Ticket>('/', ticket)
    .then(response => response.data)
    .catch(handleError);
};

export const listarTickets = async (): Promise<Ticket[]> => {
  console.info("API Ticket - listar Tickets ");
  return api
    .get<Ticket[]>('/')
    .then(response => response.data)
    .catch(handleError);
};

export const getTicket = async (ticketNumber: string): Promise<Ticket> => {
  console.info("API Ticket - getTicket ");
  return api
    .get<Ticket>(`/${ticketNumber}`)
    .then(response => response.data)
    .catch(handleError);
};

export const atualizaTicket = async (ticket: Ticket): Promise<Ticket> => {
  console.info("API Ticket - atualiza Ticket ", { ticket });
  return api
    .patch<Ticket>(`/${ticket.id}`, ticket)
    .then(response => response.data)
    .catch(handleError);
};
