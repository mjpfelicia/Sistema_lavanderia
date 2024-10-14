import axios, { AxiosError } from 'axios';

type Item = {
  quantidade: number,
  pecaId: string
  subTipo: string,
  total:number
} |
{
  quantidade: number,
  servicoId: number
}

export type Ticket = {
  clienteId: number,
  ticketNumber: string,
  estaPago: "sim" | "não",
  totalPago: number,
  items: Item[],
  total: number,
  //deliveryId: string criar um delivery com o ticketNumber
  //pagamentoId: string criar um pagamento como ticketNumber
};


const api = axios.create({
  baseURL: 'http://localhost:3008/tickets',
});

export const criarTicket = async (ticket: Ticket): Promise<Ticket> => {
  console.info("API Ticket - cria Ticket ");

  return api
    .post<Ticket>(`/`, ticket)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][criaTicket]", error.message);
      throw error;
    });
};

export const listarTickets = async (): Promise<Ticket[]> => {

  console.info("API Ticket - listarTicket ");
  return api
    .get<Ticket[]>('/')
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][listarTicket]", error.message);
      throw error;
    });
};

export const getPeca = async (ticketNumber: number): Promise<Ticket> => {
  console.info("API Ticket - getTicket ");

  return api
    .get<Ticket>(`/${ticketNumber}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getTicket]", error.message);
      throw error;
    });
};

export const atualizaTicket = async (idTicket: string, ticket: Ticket): Promise<Ticket> => {
  console.info("API Ticket - atualizaTicket ");

  return api
    .put<Ticket>(`/${idTicket}`, ticket)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaTicket]", error.message);
      throw error;
    });
};