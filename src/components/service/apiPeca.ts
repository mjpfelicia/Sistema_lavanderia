import axios, { AxiosError } from 'axios';
import { Peca, TipoPeca } from '../ServicoLavagem/ServicoLavagem';

export type PecaTipo = "Entrega" | "Retirada";

const api = axios.create({
  baseURL: 'http://localhost:3008',
});

export const listarPeca = async (): Promise<Peca[]> => {

  console.info("API Peca - listarPeca ");
  return api
    .get<Peca[]>('/pecas')
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][listarPeca]", error.message);
      throw error;
    });
};

export const getPeca = async (idPeca: number): Promise<Peca> => {
  console.info("API Peca - getPeca ");

  return api
    .get<Peca>(`/pecas/${idPeca}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getPeca]", error.message);
      throw error;
    });
};

export const getPecaPorTipo = async (tipoPeca:TipoPeca): Promise<Peca[]> => {
  console.info("API Peca - get Peca ", { tipoPeca });

  if (!tipoPeca) {
    throw "[getTipoPeca] Precisa do tipo de peca";
  }

  const params = `tipo=${tipoPeca}`;

  return api
    .get<Peca[]>(`/pecas?${params}`)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][getPecaPorTipo]", error.message);
      throw error;
    });
};



export const atualizaPeca = async (idPeca: string, Peca: Peca): Promise<Peca> => {
  console.info("API Peca - atualizaPeca ");

  return api
    .put<Peca>(`/pecas/${idPeca}`, Peca)
    .then(response => response.data)
    .catch((error: AxiosError) => {
      console.error("[ERROR][atualizaPeca]", error.message);
      throw error;
    });
};