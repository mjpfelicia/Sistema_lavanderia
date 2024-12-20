import axios, { AxiosError } from 'axios';

export type TipoPeca =
  | "BLAZER"
  | "CAMISA"
  | "CALÇA"
  | "VESTIDO"
  | "JAQUETA"
  | "JALECO"
  | "CAMA"
  | "MESA";

// Interface que define a estrutura das peças
export interface Peca {
  [x: string]: any;
  defeito: string;
  id: string;
  tipo: TipoPeca;
  subTipo: string;
  cor: string;
  marca: string;
    preco: number;
  quantidade: number;
  imagemUrl: string;
}



export type PecaTipo = "Entrega" | "Retirada";

const api = axios.create({
  baseURL: 'http://localhost:3008/peca',
});

export const listarPeca = async (): Promise<Peca[]> => {

  console.info("API Peca - listarPeca ");
  return api
    .get<Peca[]>('/')
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][listarPeca]", error.message);
      throw error;
    });
};

export const getPeca = async (idPeca: number): Promise<Peca> => {
  console.info("API Peca - getPeca ");

  return api
    .get<Peca>(`//${idPeca}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getPeca]", error.message);
      throw error;
    });
};

export const getPecaPorTipo = async (tipoPeca:TipoPeca): Promise<Peca[]> => {
  console.info("API Peca - get Peça tipoPeca: ", { tipoPeca });
 
  if (!tipoPeca) {
    throw "[getTipoPeca] Precisa do tipo de peça";
  }

  const params = `tipo=${tipoPeca}`;

  return api
    .get<Peca[]>(`/?${params}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getPecaPorTipo]", error.message);
      throw error;
    });
};



export const atualizaPeca = async (idPeca: string, Peca: Peca): Promise<Peca> => {
  console.info("API Peca - atualizaPeca ");

  return api
    .put<Peca>(`//${idPeca}`, Peca)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaPeca]", error.message);
      throw error;
    });
};