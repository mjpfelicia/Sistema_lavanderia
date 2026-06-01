import React, { useEffect, useState } from 'react';
import { atualizaTicket, buscarTicket, criarTicket, registrarBaixaTicket, regularizarPagamentoTicket, Ticket } from '../../../service/apiTicket';
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
  const [processandoBaixa, setProcessandoBaixa] = useState<boolean>(false);
  const [formaPagamentoBaixa, setFormaPagamentoBaixa] = useState<string>('Dinheiro');
  const [valorRecebidoBaixa, setValorRecebidoBaixa] = useState<string>('');
  const [observacaoBaixa, setObservacaoBaixa] = useState<string>('');
  const [modoBaixaFinanceira, setModoBaixaFinanceira] = useState<'receber-agora' | 'deixar-pendente'>('receber-agora');
  const [criandoEmProducao, setCriandoEmProducao] = useState<boolean>(false);

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

  useEffect(() => {
    if (!ticket) {
      return;
    }

    setFormaPagamentoBaixa(ticket.formaPagamento?.trim() || 'Dinheiro');
    setValorRecebidoBaixa(String(ticket.valorRecebido ?? ticket.total ?? 0));
    setObservacaoBaixa(ticket.observacaoBaixa || '');
    setModoBaixaFinanceira(ticket.estaPago === 'sim' ? 'receber-agora' : 'deixar-pendente');
  }, [ticket]);

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

  const handleBaixaEntrega = async () => {
    if (!ticket) {
      return;
    }

    const precisaRegistrarPagamento = modoBaixaFinanceira === 'receber-agora';
    const valorNumerico = Number(String(valorRecebidoBaixa).replace(',', '.'));

    if (precisaRegistrarPagamento) {
      if (!formaPagamentoBaixa.trim()) {
        setError('Informe a forma de pagamento para concluir a baixa.');
        return;
      }

      if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
        setError('Informe o valor recebido para concluir a baixa.');
        return;
      }
    }

    if (!window.confirm(`Registrar baixa do ticket #${ticket.ticketNumber} como entregue?`)) {
      return;
    }

    try {
      setProcessandoBaixa(true);
      const ticketBaixado = await registrarBaixaTicket(
        ticket,
        precisaRegistrarPagamento
          ? {
              marcarComoPago: true,
              formaPagamento: formaPagamentoBaixa,
              valorRecebido: valorNumerico,
              observacaoBaixa: observacaoBaixa.trim() || undefined,
            }
          : {
              deixarPendente: true,
              valorRecebido: ticket.total,
              observacaoBaixa: observacaoBaixa.trim() || undefined,
            },
      );
      setTicket(ticketBaixado);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Nao foi possivel registrar a baixa do ticket.');
    } finally {
      setProcessandoBaixa(false);
    }
  };

  const handleRegularizarPagamento = async () => {
    if (!ticket) {
      return;
    }

    const valorNumerico = Number(String(valorRecebidoBaixa).replace(',', '.'));

    if (!formaPagamentoBaixa.trim()) {
      setError('Informe a forma de pagamento para regularizar a pendencia.');
      return;
    }

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setError('Informe o valor recebido para regularizar a pendencia.');
      return;
    }

    try {
      setProcessandoBaixa(true);
      const ticketAtualizado = await regularizarPagamentoTicket(ticket, {
        formaPagamento: formaPagamentoBaixa,
        valorRecebido: valorNumerico,
        observacaoBaixa: observacaoBaixa.trim() || undefined,
      });
      setTicket(ticketAtualizado);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Nao foi possivel regularizar o pagamento.');
    } finally {
      setProcessandoBaixa(false);
    }
  };

  const handleCriarEmProducao = async () => {
    if (!ticketNumber.trim()) {
      return;
    }

    try {
      setCriandoEmProducao(true);
      const ticketCriado = await criarTicket({
        clienteId: '',
        ticketNumber: ticketNumber.trim(),
        estaPago: 'nao',
        totalPago: 0,
        items: [],
        total: 0,
        dataCriacao: new Date().toISOString(),
        dataEntrega: '',
        tipoAtendimento: 'Retirada',
        statusEntrega: 'Em producao',
        formaPagamento: '',
        statusPagamentoDescricao: 'Em producao',
      });

      setTicket({
        ...ticketCriado,
        items: ticketCriado.items || [],
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Nao foi possivel criar o ticket em producao.');
    } finally {
      setCriandoEmProducao(false);
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
    const notFound = error.toLowerCase().includes('nao encontrado');

    return (
      <section className={styles.ticketWorkspace}>
        <div className={styles.errorSurface}>
          <div className={styles.errorMessage}>{error}</div>
          {notFound && (
            <div className={styles.errorActionPanel}>
              <strong>O ticket ainda nao existe na base.</strong>
              <p>Voce pode criar um ticket em producao agora para continuar a operacao e ajustar os dados depois.</p>
              <button className={styles.primaryButton} onClick={handleCriarEmProducao} disabled={criandoEmProducao}>
                {criandoEmProducao ? 'Criando ticket...' : 'Criar ticket em producao'}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (!ticket) {
    return null;
  }

  const totalPecas = ticket.items.reduce((acc, item) => acc + item.quantidade, 0);
  const pagamentoStatus = ticket.estaPago === 'sim' ? 'Pagamento confirmado' : 'Pagamento pendente';
  const entregaStatus = ticket.statusEntrega || 'Em produção';
  const dataBaixa = ticket.dataBaixa ? formatDateTime(ticket.dataBaixa) : null;

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
            {dataBaixa && (
              <div className={styles.deliveryInfoRow}>
                <span>Baixa registrada</span>
                <strong>{dataBaixa}</strong>
              </div>
            )}
          </div>

          {ticket.estaPago !== 'sim' && (
            <div className={styles.baixaFinanceira}>
              <div className={styles.baixaFinanceiraHeader}>
                <span className={styles.sectionEyebrow}>Recebimento</span>
                <strong>Ticket ainda nao pago</strong>
              </div>
              <p className={styles.baixaFinanceiraNota}>
                Para dar baixa, precisamos registrar o pagamento agora e alimentar o caixa do dia com a forma de recebimento.
              </p>
              <div className={styles.baixaModoToggle}>
                <label className={`${styles.baixaModoOption} ${modoBaixaFinanceira === 'receber-agora' ? styles.baixaModoActive : ''}`}>
                  <input
                    type="radio"
                    name="modoBaixaFinanceira"
                    checked={modoBaixaFinanceira === 'receber-agora'}
                    onChange={() => setModoBaixaFinanceira('receber-agora')}
                  />
                  <span>Receber agora</span>
                  <small>Fecha o caixa e registra a forma de pagamento.</small>
                </label>
                <label className={`${styles.baixaModoOption} ${modoBaixaFinanceira === 'deixar-pendente' ? styles.baixaModoActive : ''}`}>
                  <input
                    type="radio"
                    name="modoBaixaFinanceira"
                    checked={modoBaixaFinanceira === 'deixar-pendente'}
                    onChange={() => setModoBaixaFinanceira('deixar-pendente')}
                  />
                  <span>Deixar pendente</span>
                  <small>Baixa a entrega agora e o recebimento fica para depois.</small>
                </label>
              </div>
              <div className={styles.baixaFinanceiraGrid}>
                {modoBaixaFinanceira === 'receber-agora' ? (
                  <>
                    <label className={styles.fieldGroup}>
                      <span>Forma de pagamento</span>
                      <div className={styles.inputWrap}>
                        <select value={formaPagamentoBaixa} onChange={(e) => setFormaPagamentoBaixa(e.target.value)}>
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="Pix">Pix</option>
                          <option value="Cartao de Credito">Cartao de Credito</option>
                          <option value="Cartao de Debito">Cartao de Debito</option>
                        </select>
                      </div>
                    </label>

                    <label className={styles.fieldGroup}>
                      <span>Valor recebido</span>
                      <div className={styles.inputWrap}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={valorRecebidoBaixa}
                          onChange={(e) => setValorRecebidoBaixa(e.target.value)}
                        />
                      </div>
                    </label>
                  </>
                ) : (
                  <div className={styles.baixaPendenteResumo}>
                    <strong>Valor pendente</strong>
                    <span>{`R$ ${ticket.total.toFixed(2)}`}</span>
                    <p>O ticket sera baixado na entrega, mas o valor entrara como pendente para receber em outro momento.</p>
                  </div>
                )}
              </div>

              <label className={styles.fieldGroup}>
                <span>Observacao da baixa</span>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    value={observacaoBaixa}
                    onChange={(e) => setObservacaoBaixa(e.target.value)}
                    placeholder="Ex.: pago no balcao, conferido com a frente"
                  />
                </div>
              </label>
            </div>
          )}

          <div className={styles.actionButtons}>
            <button
              className={styles.primaryButton}
              onClick={handleLiberarPecas}
              disabled={processandoBaixa || ticket.statusEntrega === 'Entregue'}
            >
              Liberar peças na conferência
            </button>
            <button className={styles.secondaryButton} onClick={handleBaixaEntrega} disabled={processandoBaixa || ticket.statusEntrega === 'Entregue'}>
              {processandoBaixa ? 'Registrando baixa...' : ticket.statusEntrega === 'Entregue' ? 'Baixa já registrada' : 'Dar baixa na entrega'}
            </button>
            {ticket.statusEntrega === 'Entregue' && ticket.estaPago !== 'sim' && (
              <button className={styles.secondaryButton} onClick={handleRegularizarPagamento} disabled={processandoBaixa}>
                {processandoBaixa ? 'Regularizando...' : 'Receber pendencia'}
              </button>
            )}
          </div>
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
