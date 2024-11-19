import axios, { AxiosError } from 'axios';

export type DeliveryTipo = "Entrega" | "Retirada";

export type Delivery = {
  id?: string;
  ticketNumber?: string;
  codigo?: string;
  clienteId: number; // Certifique-se de que é string
  deliveryTipo: DeliveryTipo;
  deliveryData: Date;
};

const api = axios.create({
  baseURL: 'http://localhost:3008',
});

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("[ERROR]", error.message);
    throw error;
  } else {
    console.error("[ERROR] Erro desconhecido", error);
    throw new Error("Erro desconhecido");
  }
};

const getRequest = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

const postPutRequest = async <T>(url: string, data: T): Promise<T> => {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const listarDelivery = async (): Promise<Delivery[]> => {
  console.info("API Delivery - listarDelivery");
  return getRequest<Delivery[]>('/deliverys');
};

export const getDelivery = async (idDelivery: string): Promise<Delivery> => {
  console.info("API Delivery - getDelivery");
  return getRequest<Delivery>(`/deliverys/${idDelivery}`);
};

export const buscarDelivery = async (clienteId: string): Promise<Delivery[]> => {
  console.info("API Delivery - buscarDelivery", { clienteId });
  if (!clienteId) {
    throw new Error("[buscarDelivery] Precisa do clienteId para buscar Delivery");
  }
  return getRequest<Delivery[]>(`/deliverys?clienteId=${clienteId}`);
};

export const atualizaDelivery = async (idDelivery: string, delivery: Delivery): Promise<Delivery> => {
  console.info("API Delivery - atualizaDelivery");
  return postPutRequest<Delivery>(`/deliverys/${idDelivery}`, delivery);
};

export const criarDelivery = async (delivery: Delivery): Promise<Delivery> => {
  console.info("API Delivery - criarDelivery");
  return postPutRequest<Delivery>('/deliverys', delivery);
};
