// Importa as dependências necessárias
import React, { useState, useEffect } from 'react';
import { buscarTicket, atualizaTicket, Ticket } from '../../../service/apiTicket'; // Importa as funções e tipos do serviço de tickets
import styles from './BuscaTicket.module.css'; // Importa os estilos CSS

// Define a interface das props do componente
interface VisualizarTicketProps {
  ticketNumber: string;
}

// Componente principal que exibe os detalhes do ticket
const VisualizarTicket: React.FC<VisualizarTicketProps> = ({ ticketNumber }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null); // Estado para armazenar os detalhes do ticket
  const [error, setError] = useState<string | null>(null); // Estado para armazenar mensagens de erro
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o estado de carregamento

  // useEffect para buscar o ticket assim que o número do ticket mudar
  useEffect(() => {
    const fetchTicket = async () => {
      if (ticketNumber.trim()) {
        setLoading(true); // Define o estado de carregamento como true
        try {
          const ticketData = await buscarTicket(ticketNumber); // Chama a função para buscar o ticket
          if (ticketData) {
            const fetchedTicket = ticketData;
            setTicket(fetchedTicket); // Define os detalhes do ticket no estado
            setError(null); // Limpa qualquer mensagem de erro
          } else {
            setTicket(null);
            setError('Ticket não encontrado'); // Define mensagem de erro se o ticket não for encontrado
          }
        } catch (err: any) {
          setError(err.message || 'Não foi possível buscar o ticket.'); // Define mensagem de erro em caso de falha na busca
          setTicket(null);
        } finally {
          setLoading(false); // Define o estado de carregamento como false
        }
      } else {
        setLoading(false);
      }
    };
    fetchTicket(); // Chama a função para buscar o ticket
  }, [ticketNumber]);

  // Função para atualizar um campo específico do ticket
  const handleUpdate = async (field: string, value: string) => {
    if (ticket) {
      const updatedTicket = { ...ticket, [field]: value };

      try {
        await atualizaTicket(updatedTicket); // Chama a função para atualizar o ticket
        setTicket(updatedTicket); // Atualiza o estado com o ticket atualizado
        setError(null); // Limpa qualquer mensagem de erro
      } catch (err: any) {
        setError(err.message || 'Não foi possível atualizar o ticket.'); // Define mensagem de erro em caso de falha na atualização
      }
    }
  };

  // Função para lidar com a mudança da data de entrega
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const currentTime = ticket?.dataEntrega?.split('T')[1] || '00:00:00.000Z';
    handleUpdate('dataEntrega', `${newDate}T${currentTime}`);
  };

  // Função para lidar com a mudança da hora de entrega
  const handleHoraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    const currentDate = ticket?.dataEntrega?.split('T')[0] || '';
    handleUpdate('dataEntrega', `${currentDate}T${newTime}:00.000Z`);
  };

  // Exibe mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Exibe mensagem de erro se houver erro e nenhum ticket foi encontrado
  if (error && !ticket) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  // Não exibe nada se não houver ticket e não estiver carregando
  if (!ticket) {
    return null;
  }

  // Renderiza os detalhes do ticket
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
        {error && <div className={styles.errorMessage}>{error}</div>}
         {/* Exibe a mensagem de erro */}
      </div>
    </div>
  );
};

export default VisualizarTicket;
