import React, { useEffect, useState } from 'react';
import { atualizaTicket, buscarTicket, Ticket } from '../../../service/apiTicket';
import styles from './BuscaTicket.module.css';

interface VisualizarTicketProps {
  ticketNumber: string;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Não informado';
  }

  return new Date(value).toLocaleString('pt-BR');
};

const getEntregaTone = (status?: Ticket['statusEntrega']) => {
  switch (status) {
    case 'Liberado':
      return styles.statusSuccess;
    case 'Pronto':
      return styles.statusInfo;
    case 'Aguardando retirada':
      return styles.statusWarning;
    default:
      return styles.statusNeutral;
  }
};

const VisualizarTicket: React.FC<VisualizarTicketProps> = ({ ticketNumber }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketNumber.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const ticketData = await buscarTicket(ticketNumber);

        if (ticketData) {
          setTicket(ticketData);
          setError(null);
        } else {
          setTicket(null);
          setError('Ticket não encontrado.');
        }
      } catch (err: any) {
        setError(err.message || 'Não foi possível buscar o ticket.');
        setTicket(null);
      } finally {
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
    return <div className={styles.infoBanner}>Carregando ticket...</div>;
  }

  if (error && !ticket) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!ticket) {
    return null;
  }

  const totalPecas = ticket.items.reduce((acc, item) => acc + item.quantidade, 0);
  const pagamentoStatus = ticket.estaPago === 'sim' ? 'Pagamento confirmado' : 'Pagamento pendente';
  const entregaStatus = ticket.statusEntrega || 'Em produção';

  return (
    <section className={styles.ticketWorkspace}>
      <div className={styles.ticketHero}>
        <div className={styles.ticketHeroHeader}>
          <div>
            <span className={styles.sectionEyebrow}>Conferência</span>
            <h3>Ticket #{ticket.ticketNumber}</h3>
            <p>Dados atuais do ticket para conferência e atualização.</p>
          </div>

          <div className={`${styles.statusBadge} ${getEntregaTone(ticket.statusEntrega)}`}>{entregaStatus}</div>
        </div>
      </div>

      <div className={styles.ticketGrid}>
        <article className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Cliente</span>
              <h4>Dados principais</h4>
            </div>
          </div>

          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span>Cliente</span>
              <strong>{ticket.cliente?.nome || 'Cliente do atendimento'}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Criado em</span>
              <strong>{formatDateTime(ticket.dataCriacao)}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Pagamento</span>
              <strong>{ticket.formaPagamento || 'Não informado'}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Status financeiro</span>
              <strong>{ticket.statusPagamentoDescricao || pagamentoStatus}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Atendimento</span>
              <strong>{ticket.tipoAtendimento || 'Retirada'}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Total pago</span>
              <strong>{formatCurrency(ticket.totalPago)}</strong>
            </div>
          </div>
        </article>

        <article className={styles.detailCard}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Entrega</span>
              <h4>Programação</h4>
            </div>
          </div>

          <div className={styles.scheduleGrid}>
            <label className={styles.fieldGroup}>
              <span>Data de entrega</span>
              <div className={styles.inputWrap}>
                <input
                  type="date"
                  value={ticket.dataEntrega?.split('T')[0] || ""}
                  onChange={handleDataChange}
                  className={styles.dateInput}
                />
              </div>
            </label>

            <label className={styles.fieldGroup}>
              <span>Hora de entrega</span>
              <div className={styles.inputWrap}>
                <input
                  type="time"
                  value={ticket.dataEntrega?.split('T')[1]?.substring(0, 5) || ""}
                  onChange={handleHoraChange}
                  className={styles.timeInput}
                />
              </div>
            </label>
          </div>

          <div className={styles.deliveryInfo}>
            <div className={styles.deliveryInfoRow}>
              <span>Entrega prevista</span>
              <strong>{formatDateTime(ticket.dataEntrega)}</strong>
            </div>
            <div className={styles.deliveryInfoRow}>
              <span>Status atual</span>
              <strong>{entregaStatus}</strong>
            </div>
          </div>

          <button className={styles.primaryButton} onClick={handleLiberarPecas}>
            Liberar peças na conferência
          </button>
        </article>
      </div>

      <article className={styles.detailCard}>
        <div className={styles.cardHeader}>
          <div>
            <span className={styles.sectionEyebrow}>Peças</span>
            <h4>Itens do ticket</h4>
          </div>
          <div className={styles.ticketTotal}>{totalPecas} peça(s)</div>
        </div>

        <div className={styles.itemsGrid}>
          {ticket.items.map((item, index) => (
            <div key={`${item.subTipo}-${index}`} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <strong>{item.subTipo}</strong>
                <span>{item.quantidade} un.</span>
              </div>

              <div className={styles.itemMetaGrid}>
                <div>
                  <span>Serviços</span>
                  <strong>{item.servicos || 'Não informado'}</strong>
                </div>
                <div>
                  <span>Cor</span>
                  <strong>{item.cores || 'Não informada'}</strong>
                </div>
                <div>
                  <span>Marca</span>
                  <strong>{item.marca || 'Não informada'}</strong>
                </div>
                <div>
                  <span>Defeitos</span>
                  <strong>{item.defeitos || 'Nenhum'}</strong>
                </div>
              </div>

              <div className={styles.itemTotalRow}>
                <span>Total do item</span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            </div>
          ))}
        </div>
      </article>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </section>
  );
};

export default VisualizarTicket;
