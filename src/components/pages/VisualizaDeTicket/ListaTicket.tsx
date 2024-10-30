import React, { useState, useEffect } from 'react';
// Importa a função para buscar o ticket e a interface Ticket
import { buscarTicket, Ticket } from '../../service/apiTicket';

// Define as props que o componente vai receber
interface VisualizarTicketProps {
  ticketNumber: string;
}

// Função personalizada para formatar datas
const formatDate = (date: string | number | Date) => {
  const d = new Date(date);
  const day = (`0${d.getDate()}`).slice(-2);
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const VisualizarTicket: React.FC<VisualizarTicketProps> = ({ ticketNumber }) => {
  // Estados para armazenar o ticket, erros e status de carregamento
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect para buscar os dados do ticket quando o número do ticket mudar
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        console.log(`Fetching ticket: ${ticketNumber}`);
        const ticketData = await buscarTicket(ticketNumber);
        if (ticketData) {
          setTicket(ticketData); // Atualiza o estado do ticket com os dados recebidos
          console.log('Ticket Data:', ticketData);
        } else {
          throw new Error('Ticket não encontrado'); // Lança um erro se o ticket não for encontrado
        }
      } catch (err: any) {
        console.error('Erro ao buscar o ticket:', err);
        setError(err.message || 'Não foi possível buscar o ticket.'); // Atualiza o estado de erro com a mensagem apropriada
      } finally {
        setLoading(false); // Define o estado de carregamento como false
      }
    };

    if (ticketNumber) {
      fetchTicket(); // Chama a função para buscar o ticket
    }
  }, [ticketNumber]); // Dependência do useEffect

  if (loading) {
    return <div>Carregando...</div>; // Renderiza o estado de carregamento
  }

  if (error) {
    return <div>{error}</div>; // Renderiza a mensagem de erro
  }

  // Renderiza os dados do ticket se disponíveis
  return (
    <div>
      <h3>Detalhes do Ticket</h3>
      <p>Número do Ticket: {ticket?.ticketNumber}</p>
      <p>Cliente: {ticket?.clienteId}</p>
      <p>Data de Criação: {ticket?.dataCriacao ? formatDate(ticket.dataCriacao) : 'Data não disponível'}</p>
      <h4>Itens</h4>
      <ul>
        {ticket?.items.map((item, index) => (
          <li key={index}>
            {item.subTipo} - Quantidade: {item.quantidade} - Total: R${item.total.toFixed(2)}
          </li>
        ))}
      </ul>
      <p>Total Pago: R${ticket?.totalPago.toFixed(2)}</p>
    </div>
  );
};

export default VisualizarTicket;
