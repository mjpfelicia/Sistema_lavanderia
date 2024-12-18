import axios, { AxiosError } from 'axios';
import { Cliente } from './apiCliente';

// Define o tipo Item
type Item = {
  quantidade: number;
  pecaId?: string;
  servicoId?: number;
  subTipo: string;
  total: number;
};

// Define o tipo Ticket que inclui um array de Itens
export type Ticket = {
  id?: string; // Adicionei id aqui
  clienteId: string; // Alterado para string
  ticketNumber: string;
  estaPago: "sim" | "não";
  totalPago: number;
  items: Item[];
  total: number;
  dataCriacao?: string;
  dataEntrega: string;
  cliente?: Cliente; // Adicionei clienteNome aqui
};

// Cria uma instância do axios com a baseURL configurada
const api = axios.create({
  baseURL: 'http://localhost:3008/ticket',
});

// Função para lidar com erros da API
const handleError = (error: AxiosError | any): never => {
  const errorMessage = error.response?.data?.message || error.message || 'Erro na API';
  console.error(`[Ticket ERROR][${error.config?.url}]`, errorMessage);
  throw new Error(errorMessage);
};

// Função para buscar um ticket pelo número
export const buscarTicket = async (ticketNumber: string): Promise<Ticket | null> => {
  console.info(`API Ticket - buscarTicket ${ticketNumber}`);

  return api
    .get<Ticket>(`/${ticketNumber}`)
    .then(response => response.data)
    .catch(handleError);
};

// Função para criar um novo ticket
export const criarTicket = async (ticket: Ticket): Promise<Ticket> => {
  console.info("API Ticket - criar Ticket ");
  return api
    .post<Ticket>('/', ticket)
    .then(response => response.data)
    .catch(handleError);
};

// Função para listar todos os tickets
export const listarTickets = async (): Promise<Ticket[]> => {
  console.info("API Ticket - listar Tickets ");
  return api
    .get<Ticket[]>('/')
    .then(response => response.data)
    .catch(handleError);
};

// Função para obter um ticket específico pelo número
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
