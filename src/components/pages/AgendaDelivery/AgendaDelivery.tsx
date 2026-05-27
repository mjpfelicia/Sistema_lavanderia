import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { criarDelivery, Delivery, DeliveryTipo } from '../../../service/apiDelivery';
import { Cliente } from '../../../service/apiCliente';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import classes from "../AgendaDelivery/AgendaDelivery.module.css";

interface AgendaDeliveryProps {
  cliente: Cliente;
}

type DeliveryAction = 'existing-ticket' | 'new-pickup';

const formatAddress = (cliente: Cliente) =>
  [
    cliente.endereco.endereco,
    cliente.endereco.numero,
    cliente.endereco.complemento,
    cliente.endereco.bairro,
    cliente.endereco.estado,
    cliente.endereco.cep,
  ]
    .filter(Boolean)
    .join(', ');

const AgendaDelivery: React.FC<AgendaDeliveryProps> = ({ cliente }) => {
  const [deliveryData, setDeliveryData] = useState<string>('');
  const [deliveryHora, setDeliveryHora] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cupom, setCupom] = useState<Delivery | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ticketsCliente, setTicketsCliente] = useState<Ticket[]>([]);
  const [carregandoTickets, setCarregandoTickets] = useState<boolean>(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<DeliveryAction | null>(null);

  useEffect(() => {
    let ativo = true;

    const carregarTickets = async () => {
      setCarregandoTickets(true);
      setError(null);

      try {
        const tickets = await listarTickets();
        if (!ativo) {
          return;
        }

        const ticketsDoCliente = tickets
          .filter((ticket) => ticket.clienteId === String(cliente.id))
          .sort((a, b) => {
            const dataA = new Date(a.dataCriacao || 0).getTime();
            const dataB = new Date(b.dataCriacao || 0).getTime();
            return dataB - dataA;
          });

        setTicketsCliente(ticketsDoCliente);
        setSelectedTicketId(ticketsDoCliente[0]?.id || '');
      } catch (ticketError) {
        console.error('Erro ao buscar tickets do cliente para delivery', ticketError);
        if (ativo) {
          setError('Nao foi possivel validar os tickets do cliente agora.');
          setTicketsCliente([]);
        }
      } finally {
        if (ativo) {
          setCarregandoTickets(false);
        }
      }
    };

    carregarTickets();

    return () => {
      ativo = false;
    };
  }, [cliente.id]);

  const ticketsElegiveis = useMemo(
    () => ticketsCliente.filter((ticket) => ticket.statusEntrega !== 'Liberado'),
    [ticketsCliente],
  );

  useEffect(() => {
    if (carregandoTickets) {
      return;
    }

    if (ticketsElegiveis.length === 0) {
      setSelectedAction('new-pickup');
      setSelectedTicketId('');
      return;
    }

    setSelectedTicketId((currentTicketId) => {
      if (currentTicketId && ticketsElegiveis.some((ticket) => ticket.id === currentTicketId)) {
        return currentTicketId;
      }

      return ticketsElegiveis[0]?.id || '';
    });
  }, [carregandoTickets, ticketsElegiveis]);

  const ticketSelecionado = useMemo(
    () => ticketsElegiveis.find((ticket) => ticket.id === selectedTicketId) || ticketsElegiveis[0] || null,
    [selectedTicketId, ticketsElegiveis],
  );

  const deliveryTipo: DeliveryTipo = selectedAction === 'new-pickup' ? 'Retirada' : 'Entrega';
  const actionLabel =
    selectedAction === 'existing-ticket' ? 'Entregar ticket existente' : selectedAction === 'new-pickup' ? 'Agendar nova retirada' : '';
  const totalPecasTicketSelecionado = ticketSelecionado?.items.reduce((acc, item) => acc + item.quantidade, 0) || 0;
  const etapaAtual = !selectedAction ? 1 : selectedAction === 'existing-ticket' && !ticketSelecionado ? 2 : 3;
  const resumoTickets = ticketsElegiveis.length === 0 ? 'Nenhum ticket em aberto' : `${ticketsElegiveis.length} ticket(s) em aberto`;

  const handleSelectAction = (action: DeliveryAction) => {
    setSelectedAction(action);
    setError(null);

    if (action === 'existing-ticket' && ticketsElegiveis.length > 0) {
      setSelectedTicketId((currentTicketId) => currentTicketId || ticketsElegiveis[0]?.id || '');
      return;
    }

    setSelectedTicketId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedAction) {
      setError('Selecione primeiro se deseja entregar um ticket existente ou agendar uma nova retirada.');
      setLoading(false);
      return;
    }

    if (selectedAction === 'existing-ticket' && !ticketSelecionado) {
      setError('Selecione um ticket em aberto para concluir a entrega.');
      setLoading(false);
      return;
    }

    if (!deliveryData || deliveryHora === '') {
      setError('Por favor, selecione uma data e horario para o delivery.');
      setLoading(false);
      return;
    }

    const deliveryDate = new Date(`${deliveryData}T${deliveryHora}`);

    if (Number.isNaN(deliveryDate.getTime())) {
      setError('Data ou horario invalido para o delivery.');
      setLoading(false);
      return;
    }

    const delivery: Delivery = {
      clienteId: cliente.id,
      ticketNumber: selectedAction === 'existing-ticket' ? ticketSelecionado?.ticketNumber : undefined,
      deliveryTipo,
      deliveryData: deliveryDate,
    };

    try {
      const deliveryCriado = await criarDelivery(delivery);
      setCupom(deliveryCriado);
      setShowModal(true);
    } catch (requestError) {
      console.error('Erro ao agendar delivery', requestError);
      setError('Erro ao agendar o delivery. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!cupom) {
      return;
    }

    const printContent = `
      <div id="printableArea">
        <h2>Cupom de Agendamento</h2>
        <p><strong>Cliente:</strong> ${cliente.nome}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <p><strong>Endereco:</strong> ${formatAddress(cliente)}</p>
        <p><strong>Acao:</strong> ${actionLabel}</p>
        ${ticketSelecionado ? `<p><strong>Ticket:</strong> ${ticketSelecionado.ticketNumber}</p>` : ''}
        <p><strong>Tipo:</strong> ${cupom.deliveryTipo}</p>
        <p><strong>Data e Hora:</strong> ${new Date(cupom.deliveryData).toLocaleString()}</p>
      </div>
    `;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className={classes.container}>
      <div className={classes.containerForm}>
        <div className={classes.heroCard}>
          <div>
            <span className={classes.eyebrow}>Cliente selecionado</span>
            <h2>{cliente.nome}</h2>
            <p>{formatAddress(cliente)}</p>
          </div>
          <div className={classes.heroMeta}>
            <div className={classes.metaBadge}>
              <span>Telefone</span>
              <strong>{cliente.telefone}</strong>
            </div>
            <div className={classes.metaBadge}>
              <span>Status</span>
              <strong>{resumoTickets}</strong>
            </div>
          </div>
        </div>

        <div className={classes.progressSteps} aria-label="Etapas do fluxo de delivery">
          <div className={`${classes.progressStep} ${etapaAtual >= 1 ? classes.progressStepActive : ''}`}>
            <strong>1</strong>
            <span>Escolha a acao</span>
          </div>
          <div className={`${classes.progressStep} ${etapaAtual >= 2 && selectedAction === 'existing-ticket' ? classes.progressStepActive : ''}`}>
            <strong>2</strong>
            <span>Confirme o ticket</span>
          </div>
          <div className={`${classes.progressStep} ${etapaAtual >= 3 ? classes.progressStepActive : ''}`}>
            <strong>3</strong>
            <span>Agende data e hora</span>
          </div>
        </div>

        {carregandoTickets ? (
          <div className={classes.stageCard}>
            <h3>Validando historico do cliente</h3>
            <p>Estamos conferindo os tickets em aberto antes de liberar o agendamento.</p>
          </div>
        ) : (
          <div className={classes.workflowGrid}>
            <section className={classes.stageCard}>
              <div className={classes.stageHeader}>
                <span className={classes.stageIndex}>Etapa 1</span>
                <div>
                  <h3>Como deseja seguir?</h3>
                  <p>
                    {ticketsElegiveis.length > 0
                      ? 'Escolha entre finalizar uma entrega pendente ou abrir uma nova retirada.'
                      : 'Nenhum ticket em aberto foi encontrado. O fluxo abaixo ja esta preparado para nova retirada.'}
                  </p>
                </div>
              </div>

              <div className={classes.actionGrid}>
                {ticketsElegiveis.length > 0 && (
                  <button
                    type="button"
                    className={`${classes.actionButton} ${selectedAction === 'existing-ticket' ? classes.actionButtonActive : ''}`}
                    onClick={() => handleSelectAction('existing-ticket')}
                  >
                    <span className={classes.actionPill}>Entrega</span>
                    <strong>Entregar Ticket Existente</strong>
                    <span>Vincula este atendimento a um ticket em aberto do cliente.</span>
                  </button>
                )}

                <button
                  type="button"
                  className={`${classes.actionButton} ${selectedAction === 'new-pickup' ? classes.actionButtonActive : ''}`}
                  onClick={() => handleSelectAction('new-pickup')}
                >
                  <span className={classes.actionPill}>Retirada</span>
                  <strong>Agendar Nova Retirada</strong>
                  <span>Cria uma coleta nova sem depender de ticket ja aberto.</span>
                </button>
              </div>
            </section>

            {selectedAction === 'existing-ticket' && ticketsElegiveis.length > 0 && (
              <section className={classes.stageCard}>
                <div className={classes.stageHeader}>
                  <span className={classes.stageIndex}>Etapa 2</span>
                  <div>
                    <h3>Escolha o ticket</h3>
                    <p>Selecione qual ticket em aberto sera atendido neste delivery.</p>
                  </div>
                </div>

                <div className={classes.ticketPanelCompact}>
                  <div className={classes.ticketPanelHeader}>
                    <span>Tickets disponiveis</span>
                    <strong>{ticketsElegiveis.length}</strong>
                  </div>
                  <div className={classes.ticketList}>
                    {ticketsElegiveis.map((ticket) => (
                      <button
                        key={ticket.id}
                        type="button"
                        className={`${classes.ticketCard} ${ticketSelecionado?.id === ticket.id ? classes.ticketCardActive : ''}`}
                        onClick={() => {
                          setSelectedTicketId(ticket.id || '');
                          setError(null);
                        }}
                      >
                        <strong>Ticket #{ticket.ticketNumber}</strong>
                        <span>Status: {ticket.statusEntrega || 'Em producao'}</span>
                        <span>{ticket.items.reduce((acc, item) => acc + item.quantidade, 0)} peca(s)</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section className={classes.stageCard}>
              <div className={classes.stageHeader}>
                <span className={classes.stageIndex}>{selectedAction === 'existing-ticket' ? 'Etapa 3' : 'Etapa 2'}</span>
                <div>
                  <h3>Confirmar agenda</h3>
                  <p>Preencha data e horario apenas depois de definir claramente o tipo do atendimento.</p>
                </div>
              </div>

              {selectedAction ? (
                <div className={classes.selectionSummary}>
                  <strong>Resumo da decisao</strong>
                  <span>{actionLabel}</span>
                  <span>Tipo do atendimento: {deliveryTipo}</span>
                  {selectedAction === 'existing-ticket' && ticketSelecionado && (
                    <span>Ticket #{ticketSelecionado.ticketNumber} com {totalPecasTicketSelecionado} peca(s).</span>
                  )}
                  {selectedAction === 'new-pickup' && (
                    <span>Nova coleta sem vinculacao com ticket ja existente.</span>
                  )}
                </div>
              ) : (
                <div className={classes.emptyState}>
                  Escolha uma das opcoes acima para liberar o agendamento.
                </div>
              )}

              <form className={classes.formulario} onSubmit={handleSubmit}>
                <div className={classes.formGrid}>
                  <div className={classes.controle_de_campo}>
                    <label htmlFor="deliveryTipo">Tipo do atendimento</label>
                    <input id="deliveryTipo" type="text" value={selectedAction ? deliveryTipo : 'Aguardando selecao'} readOnly />
                  </div>
                  <div className={classes.controle_de_campo}>
                    <label htmlFor="deliveryData">Data</label>
                    <input type="date" id="deliveryData" value={deliveryData} onChange={(e) => setDeliveryData(e.target.value)} required />
                  </div>
                  <div className={classes.controle_de_campo}>
                    <label htmlFor="deliveryHora">Hora</label>
                    <input type="time" id="deliveryHora" value={deliveryHora} onChange={(e) => setDeliveryHora(e.target.value)} required />
                  </div>
                </div>
                {error && <p className={classes.error}>{error}</p>}
                {loading ? <p>Carregando...</p> : <button type="submit" className={classes.btn_enter} disabled={!selectedAction}>Confirmar agendamento</button>}
              </form>
            </section>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cupom de Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cupom && (
            <div>
              <p><strong>Cliente:</strong> {cliente.nome}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p><strong>Endereco:</strong> {formatAddress(cliente)}</p>
              <p><strong>Acao:</strong> {actionLabel}</p>
              {ticketSelecionado && <p><strong>Ticket:</strong> #{ticketSelecionado.ticketNumber}</p>}
              <p><strong>Tipo de Entrega:</strong> {cupom.deliveryTipo}</p>
              <p><strong>Data e Hora:</strong> {new Date(cupom.deliveryData).toLocaleString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Imprimir Cupom
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AgendaDelivery;
