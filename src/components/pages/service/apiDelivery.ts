import axios, { AxiosError } from 'axios';

export type DeliveryTipo = "Entrega" | "Retirada";
export type Delivery = {
  id?:string;
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

export const buscarDelivery = async (celularCliente:string): Promise<Delivery[]> => {
  console.info("API Delivery - buscarDelivery ", { celularCliente });

  if (!celularCliente) {
    throw "[buscaDelivery]Precisa do celular para buscar Delivery";
  }

  const sort = '&_sort=nome&_order=asc';
  const params = `telefone_like=${celularCliente}`;

  return api
    .get<Delivery[]>(`/delivery?${params}` + sort)
    .then(({ data }) => {

      console.info("response: ", { data });
      return data
    })
    .catch((error: AxiosError) => {
      console.error("[ERROR][buscarDelivery]", error.message);
      throw error;
    });
};

export const atualizaDelivery = async (idDelivery: string, delivery: Delivery): Promise<Delivery | void> => {
  console.info("API Delivery - atualizaDelivery ");

  return api
    .put<Delivery>(`/delivery/${idDelivery}`, delivery)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaDelivery]", error.message);
      throw error;
    });
};