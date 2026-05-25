import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { criarDelivery, Delivery, DeliveryTipo } from '../../../service/apiDelivery';
import { Cliente } from '../../../service/apiCliente';
import { listarTickets, Ticket } from '../../../service/apiTicket';
import classes from "../AgendaDelivery/AgendaDelivery.module.css";

interface AgendaDeliveryProps {
  cliente: Cliente;
}

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
  const [deliveryTipo, setDeliveryTipo] = useState<DeliveryTipo>('Entrega');
  const [deliveryData, setDeliveryData] = useState<string>('');
  const [deliveryHora, setDeliveryHora] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cupom, setCupom] = useState<Delivery | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [ticketsCliente, setTicketsCliente] = useState<Ticket[]>([]);
  const [carregandoTickets, setCarregandoTickets] = useState<boolean>(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');

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

  const ticketSelecionado = useMemo(
    () => ticketsElegiveis.find((ticket) => ticket.id === selectedTicketId) || ticketsElegiveis[0] || null,
    [selectedTicketId, ticketsElegiveis],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!ticketSelecionado) {
      setError('Este cliente ainda nao possui ticket disponivel para agendar delivery.');
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
      ticketNumber: ticketSelecionado.ticketNumber,
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
    if (!cupom || !ticketSelecionado) {
      return;
    }

    const printContent = `
      <div id="printableArea">
        <h2>Cupom de Agendamento</h2>
        <p><strong>Cliente:</strong> ${cliente.nome}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <p><strong>Endereco:</strong> ${formatAddress(cliente)}</p>
        <p><strong>Ticket:</strong> ${ticketSelecionado.ticketNumber}</p>
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
        <h2>{cliente.nome}</h2>
        <p><strong>Endereco:</strong> {formatAddress(cliente)}</p>

        {carregandoTickets ? (
          <p>Validando tickets do cliente...</p>
        ) : ticketsElegiveis.length === 0 ? (
          <div className={classes.error}>
            Este cliente nao possui ticket disponivel para entrega ou retirada. Cadastre ou atualize um ticket antes de agendar o delivery.
          </div>
        ) : (
          <>
            <div className={classes.controle_de_campo}>
              <label htmlFor="ticketSelecionado">Ticket do cliente</label>
              <select
                id="ticketSelecionado"
                value={ticketSelecionado?.id || ''}
                onChange={(e) => setSelectedTicketId(e.target.value)}
              >
                {ticketsElegiveis.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    Ticket #{ticket.ticketNumber} - {ticket.statusEntrega || 'Em producao'}
                  </option>
                ))}
              </select>
            </div>

            {ticketSelecionado && (
              <p>
                <strong>Ticket validado:</strong> #{ticketSelecionado.ticketNumber} |{' '}
                {ticketSelecionado.items.reduce((acc, item) => acc + item.quantidade, 0)} peca(s)
              </p>
            )}

            <form className={classes.formulario} onSubmit={handleSubmit}>
              <div className={classes.controle_de_campo}>
                <label htmlFor="deliveryTipo">Tipo de Entrega:</label>
                <select id="deliveryTipo" value={deliveryTipo} onChange={(e) => setDeliveryTipo(e.target.value as DeliveryTipo)}>
                  <option value="Entrega">Entrega</option>
                  <option value="Retirada">Retirada</option>
                </select>
              </div>
              <div className={classes.controle_de_campo}>
                <label htmlFor="deliveryData">Data:</label>
                <input type="date" id="deliveryData" value={deliveryData} onChange={(e) => setDeliveryData(e.target.value)} required />
              </div>
              <div className={classes.controle_de_campo}>
                <label htmlFor="deliveryHora">Hora:</label>
                <input type="time" id="deliveryHora" value={deliveryHora} onChange={(e) => setDeliveryHora(e.target.value)} required />
              </div>
              {error && <p className={classes.error}>{error}</p>}
              {loading ? <p>Carregando...</p> : <button type="submit" className={classes.btn_enter}>Agendar</button>}
            </form>
          </>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cupom de Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cupom && ticketSelecionado && (
            <div>
              <p><strong>Cliente:</strong> {cliente.nome}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p><strong>Endereco:</strong> {formatAddress(cliente)}</p>
              <p><strong>Ticket:</strong> #{ticketSelecionado.ticketNumber}</p>
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
