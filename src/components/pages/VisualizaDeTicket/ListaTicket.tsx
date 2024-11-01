import React, { useState, useEffect } from 'react';
import { buscarTicket, Ticket } from '../../service/apiTicket';
import classe from "./BuscaTicket.module.css";

interface VisualizarTicketProps {
  ticketNumber: string;
}

const VisualizarTicket: React.FC<VisualizarTicketProps> = ({ ticketNumber }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={classe.content}>
      <div className={classe.totalizador}>
        <h3>Detalhes do Ticket</h3>
        <p>Número do Ticket: {ticket?.ticketNumber}</p>
        <p>Cliente: {ticket?.clienteNome}</p>
        <p>Data de Criação: {ticket?.dataCriacao ? new Date(ticket.dataCriacao).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) : 'N/A'}</p>
        <p>Data de Entrega: {ticket?.dataEntrega ? new Date(ticket.dataEntrega).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : 'N/A'}</p>
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
