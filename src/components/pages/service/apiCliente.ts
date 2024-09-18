import axios, { AxiosError } from 'axios';

export type Cliente = {
  email: string;
  nome: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string;
  estado: string;
  cep: string;
  bairro: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3008',
});

export const listarClientes = async (): Promise<Cliente[]> => {

  console.info("API CLiente - listarClientes ");
  return api
    .get<Cliente[]>('/clientes')
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][listarClientes]", error.message);
      throw error;
    });
};

export const getCliente = async (idCliente: number): Promise<Cliente> => {
  console.info("API CLiente - getCliente ");

  return api
    .get<Cliente>(`/clientes/${idCliente}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getCliente]", error.message);
      throw error;
    });
};

export const atualizaCliente = async (idCliente: number, cliente: Cliente): Promise<Cliente | void> => {
  console.info("API CLiente - atualizaCliente ");
  
  return api
    .put<Cliente>(`/clientes/${idCliente}`, cliente)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaCliente]", error.message);
      throw error;
    });
};