import axios from 'axios';


const urlBackend = "https://api.exemplo.com"
const api = axios.create({
    baseURL: 'https://api.exemplo.com', // substitua pela URL da sua API
});
export type ValidaClienteParametros = {
    nome: string,
    telefone: number,
    password: string

}

//TODO: gerar documentação
export const valida = (parametros: ValidaClienteParametros) => {
    api.post(urlBackend + '/endpoint', { 
        nome: parametros.nome, 
        telefone: parametros.telefone, 
        password:parametros.password 
    }).then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
};



export default api;