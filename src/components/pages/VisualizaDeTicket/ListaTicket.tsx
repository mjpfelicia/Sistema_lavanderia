import React, { useState, useEffect } from 'react';
import { buscarTicket, atualizaTicket, Ticket } from '../../../service/apiTicket';
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
          if (ticketData) {
            setTicket(ticketData);
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
    if (!ticket) {
      return;
    }

    const updatedTicket = { ...ticket, [field]: value };

    try {
      await atualizaTicket(updatedTicket);
      setTicket(updatedTicket);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Não foi possível atualizar o ticket.');
    }
  };

  const handleLiberarPecas = async () => {
    if (!ticket) {
      return;
    }

    const updatedTicket = { ...ticket, statusEntrega: 'Liberado' as const };

    try {
      await atualizaTicket(updatedTicket);
      setTicket(updatedTicket);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Não foi possível liberar as peças.');
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
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className={styles.content}>
      <div className={styles.totalizador}>
        <h3>Conferência do Ticket</h3>
        <p>Número do Ticket: {ticket.ticketNumber}</p>
        <p>Cliente: {ticket.cliente?.nome || 'Cliente do atendimento'}</p>
        <p>Data de criação: {ticket.dataCriacao ? new Date(ticket.dataCriacao).toLocaleString('pt-BR') : 'Não informada'}</p>
        <p>Forma de pagamento: {ticket.formaPagamento || 'Não informado'}</p>
        <p>Entrega/retirada: {ticket.tipoAtendimento || 'Retirada'}</p>
        <p>Status da conferência: {ticket.statusEntrega || 'Em producao'}</p>
        <h4>Peças</h4>
        <ul>
          {ticket.items.map((item, index) => (
            <li key={index}>
              <strong>{item.subTipo}</strong> - Quantidade: {item.quantidade} - Total: R${item.total.toFixed(2)}
              <br />
              Serviços: {item.servicos || 'Não informado'}
              <br />
              Cor: {item.cores || 'Não informada'}
              <br />
              Marca: {item.marca || 'Não informada'}
              <br />
              Defeitos: {item.defeitos || 'Nenhum'}
            </li>
          ))}
        </ul>
        <p>Total pago: R${ticket.totalPago.toFixed(2)}</p>
        <div className={styles.inputGroup}>
          <label>
            Data de entrega:
            <input
              type="date"
              value={ticket.dataEntrega?.split('T')[0] || ""}
              onChange={handleDataChange}
              className={styles.dateInput}
            />
          </label>
          <label>
            Hora de entrega:
            <input
              type="time"
              value={ticket.dataEntrega?.split('T')[1]?.substring(0, 5) || ""}
              onChange={handleHoraChange}
              className={styles.timeInput}
            />
          </label>
        </div>
        <button className={styles.btn_buscar} onClick={handleLiberarPecas}>
          Liberar peças na conferência
        </button>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    </div>
  );
};

export default VisualizarTicket;
