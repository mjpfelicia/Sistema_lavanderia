import axios, { AxiosError } from 'axios';

export type Endereco = {
  endereco: string;
  numero: string;
  estado: string;
  cep: string;
  bairro: string;
  complemento: string;
}

export type ClienteToCreate = {
  nome: string;
  email: string;
  telefone: string;
  endereco: Endereco
}
export type Cliente = ClienteToCreate & {
  id: number;
};

const api = axios.create({
  baseURL: 'http://localhost:3008/cliente',
});

export const listarClientes = async (): Promise<Cliente[]> => {
  console.info("API Cliente - listarClientes ");
  return api
    .get<Cliente[]>('/')
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][listarClientes]", error.message);
      throw error;
    });
};

export const getCliente = async (idCliente: number): Promise<Cliente> => {
  console.info("API Cliente - getCliente ");

  return api
    .get<Cliente>(`/${idCliente}`)
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

  const params = `nome=${nomeCliente}&telefone=${celularCliente}`;

  return api
    .get<Cliente[]>(`?${params}`)
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

  if (!idCliente) {
    console.error({ idCliente: idCliente, cliente })
    throw new Error("Precisa do ID do cliente")
  }

  return api
    .put<Cliente>(`/${idCliente}`, cliente)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaCliente]", error.message);
      throw error;
    });
};

export const criarCliente = async (cliente: ClienteToCreate): Promise<Cliente | void> => {
  console.info("API Cliente - criarCliente ");

  return api
    .post<Cliente>(`/`, cliente)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][criarCliente]", error.message);
      throw error;
    });
};