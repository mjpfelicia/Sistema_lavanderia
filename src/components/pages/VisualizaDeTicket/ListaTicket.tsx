import React, { useState, useEffect } from 'react';
import { buscarTicket, Ticket } from '../../service/apiTicket';
import classe from "./BuscaTicket.module.css";

interface VisualizarTicketProps {
  ticketNumber: string;
}

const VisualizarTicket: React.FC<VisualizarTicketProps> = ({ ticketNumber }) => {
  // Estados para armazenar os dados do ticket, mensagens de erro e estado de carregamento
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Função para buscar o ticket com base no número do ticket
    const fetchTicket = async () => {
      try {
        console.log(`Fetching ticket: ${ticketNumber}`);
        const ticketData = await buscarTicket(ticketNumber);
        if (ticketData.length > 0) {
          const fetchedTicket = ticketData[0];
          console.log('Ticket Data:', fetchedTicket);
          setTicket(fetchedTicket);
        } else {
          throw new Error('Ticket não encontrado');
        }
      } catch (err: any) {
        console.error('Erro ao buscar o ticket:', err);
        setError(err.message || 'Não foi possível buscar o ticket.');
      } finally {
        setLoading(false);
      }
    };
    if (ticketNumber) {
      fetchTicket();
    }
  }, [ticketNumber]);

  // Formatar a data de acordo com o fuso horário do banco de dados
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    }).format(date);
  };

  // Exibe mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Exibe mensagem de erro caso ocorra um erro durante a busca
  if (error) {
    return <div>{error}</div>;
  }

  // Renderiza os detalhes do ticket caso os dados sejam buscados com sucesso
  return (
    <div className={classe.content}>
      <div className={classe.totalizador}>
        <h3>Detalhes do Ticket</h3>
        <p>Número do Ticket: {ticket?.ticketNumber}</p>
        <p>Cliente: {ticket?.cliente?.nome}</p>
        <p>Data de Criação: {formatDate(ticket?.dataCriacao)}</p>
        <p>Data de Entrega: {formatDate(ticket?.dataEntrega)}</p>
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
    </div>
  );
};

export default VisualizarTicket;
