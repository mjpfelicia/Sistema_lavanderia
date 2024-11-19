import axios, { AxiosError } from 'axios';

export type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento: string;
  estado: string;
  cep: string;
  bairro: string;
};

const api = axios.create({
  baseURL: 'http://localhost:3008',
});

export const listarClientes = async (): Promise<Cliente[]> => {
  console.info("API Cliente - listarClientes ");
  return api
    .get<Cliente[]>('/clientes')
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][listarClientes]", error.message);
      throw error;
    });
};

export const getCliente = async (idCliente: number): Promise<Cliente> => {
  console.info("API Cliente - getCliente ");

  return api
    .get<Cliente>(`/clientes/${idCliente}?_embed=deliveries`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getCliente]", error.message);
      throw error;
    });
};

export const buscarCliente = async (nomeCliente: string, celularCliente: string): Promise<Cliente[]> => {
  console.info("API Cliente - buscarCliente ", { nomeCliente, celularCliente });

  if (!nomeCliente && !celularCliente) {
    throw "[buscarCliente] Precisa do nome ou celular do cliente";
  }

  const sort = '&_sort=nome&_order=asc';
  const params = `nome=${nomeCliente}&telefone_like=${celularCliente}`;

  return api
    .get<Cliente[]>(`/clientes?${params}` + sort)
    .then(({ data }) => {
      console.info("response: ", { data });
      return data;
    })
    .catch((error: AxiosError) => {
      console.error("[ERROR][buscarCliente]", error.message);
      throw error;
    });
};

export const atualizaCliente = async (idCliente: number, cliente: Cliente): Promise<Cliente | void> => {
  console.info("API Cliente - atualizaCliente ");

  return api
    .put<Cliente>(`/clientes/${idCliente}`, cliente)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaCliente]", error.message);
      throw error;
    });
};
