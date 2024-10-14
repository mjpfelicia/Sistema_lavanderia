import axios, { AxiosError } from 'axios';

export type DeliveryTipo = "Entrega" | "Retirada";
export type Delivery = {
  id?:string;
  ticketNumber: string,
  código: string;
  clienteId: string;
  deliveryTipo: DeliveryTipo
  deliveryData: Date;
}

const api = axios.create({
  baseURL: 'http://localhost:3008',
});

export const listarDelivery = async (): Promise<Delivery[]> => {

  console.info("API Delivery - listarDelivery ");
  return api
    .get<Delivery[]>('/delivery')
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][listarDelivery]", error.message);
      throw error;
    });
};

export const getDelivery = async (idDelivery: number): Promise<Delivery> => {
  console.info("API Delivery - getDelivery ");

  return api
    .get<Delivery>(`/delivery/${idDelivery}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getDelivery]", error.message);
      throw error;
    });
};

export const buscarDelivery = async (clienteId:string): Promise<Delivery[]> => {
  console.info("API Delivery - buscarDelivery ", { clienteId });

  if (!clienteId) {
    throw "[buscaDelivery]Precisa do celular para buscar Delivery";
  }

  const params = `clienteId=${clienteId}`;

  return api
    .get<Delivery[]>(`/delivery?${params}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][buscarDelivery]", error.message);
      throw error;
    });
};

export const atualizaDelivery = async (idDelivery: string, delivery: Delivery): Promise<Delivery> => {
  console.info("API Delivery - atualizaDelivery ");

  return api
    .put<Delivery>(`/delivery/${idDelivery}`, delivery)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaDelivery]", error.message);
      throw error;
    });
};