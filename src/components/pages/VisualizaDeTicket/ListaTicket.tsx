// VisualizarTicket.tsx
import React, { useState, useEffect } from 'react';
import { buscarTicket, atualizaTicket, Ticket } from '../../service/apiTicket';
import styles from './BuscaTicket.module.css';

interface VisualizarTicketProps {
  ticketNumber: string;
}

const VisualizarTicket: React.FC<VisualizarTicketProps> = ({ ticketNumber }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTicket = async () => {
      if (ticketNumber.trim()) {
        setLoading(true);
        try {
          const ticketData = await buscarTicket(ticketNumber);
          if (ticketData.length > 0) {
            const fetchedTicket = ticketData[0];
            setTicket(fetchedTicket);
            setError(null);
          } else {
            setTicket(null);
            setError('Ticket não encontrado');
          }
        } catch (err: any) {
          setError(err.message || 'Não foi possível buscar o ticket.');
          setTicket(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketNumber]);

  const handleUpdate = async (field: string, value: string) => {
    if (ticket) {
      const updatedTicket = { ...ticket, [field]: value };

      try {
        await atualizaTicket(updatedTicket);
        setTicket(updatedTicket);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Não foi possível atualizar o ticket.');
      }
    }
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const currentTime = ticket?.dataEntrega?.split('T')[1] || '00:00:00.000Z';
    handleUpdate('dataEntrega', `${newDate}T${currentTime}`);
  };

  const handleHoraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    const currentDate = ticket?.dataEntrega?.split('T')[0] || '';
    handleUpdate('dataEntrega', `${currentDate}T${newTime}:00.000Z`);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error && !ticket) {
    return <div>{error}</div>;
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className={styles.content}>
      <div className={styles.totalizador}>
        <h3>Detalhes do Ticket</h3>
        <p>Número do Ticket: {ticket.ticketNumber}</p>
        <p>Cliente: {ticket.cliente?.nome}</p>
        <p>Data de Criação: {new Date(ticket.dataCriacao!).toLocaleString('pt-BR')}</p>
        <h4>Itens</h4>
        <ul>
          {ticket.items.map((item, index) => (
            <li key={index}>
              {item.subTipo} - Quantidade: {item.quantidade} - Total: R${item.total.toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Total Pago: R${ticket.totalPago.toFixed(2)}</p>
        <div className={styles.inputGroup}>
          <label>
            Data de Entrega:
            <input
              type="date"
              value={ticket.dataEntrega?.split('T')[0] || ""}
              onChange={handleDataChange}
              className={styles.dateInput}
            />
          </label>
          <label>
            Hora de Entrega:
            <input
              type="time"
              value={ticket.dataEntrega?.split('T')[1].substring(0, 5) || ""}
              onChange={handleHoraChange}
              className={styles.timeInput}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default VisualizarTicket;
