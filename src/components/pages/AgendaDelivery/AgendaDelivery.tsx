import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { criarDelivery, Delivery, DeliveryTipo } from '../../service/apiDelivery';
import { Cliente } from '../../service/apiCliente';
import classes from "../AgendaDelivery/AgendaDelivery.module.css";

interface AgendaDeliveryProps {
  cliente: Cliente;
}

const AgendaDelivery: React.FC<AgendaDeliveryProps> = ({ cliente }) => {
  const [deliveryTipo, setDeliveryTipo] = useState<DeliveryTipo>('Entrega');
  const [deliveryData, setDeliveryData] = useState<string>('');
  const [deliveryHora, setDeliveryHora] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cupom, setCupom] = useState<Delivery | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeliveryTipo(e.target.value as DeliveryTipo);
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryData(e.target.value);
  };

  const handleHoraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryHora(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!deliveryData || deliveryHora === '') {
      setError('Por favor, selecione uma data e horário para a entrega.');
      setLoading(false);
      return;
    }

    const delivery: Delivery = {
      clienteId: cliente.id,
      deliveryTipo,
      deliveryData: new Date(`${deliveryData}T${deliveryHora}`)
    };

    try {
      await criarDelivery(delivery);
      setCupom(delivery); // Armazena os detalhes do delivery no estado do cupom
      setShowModal(true); // Mostra o modal
      alert("Delivery agendado com sucesso!");
    } catch (error) {
      setError('Erro ao agendar a entrega. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (cupom) {
      const printContent = `
        <div id="printableArea">
          <h2>Cupom de Agendamento</h2>
          <p><strong>Cliente:</strong> ${cliente.nome}</p>
          <p><strong>Endereço:</strong> ${cliente.endereco}, ${cliente.numero}, ${cliente.complemento}, ${cliente.bairro}, ${cliente.estado}, ${cliente.cep}</p>
          <p><strong>Tipo de Entrega:</strong> ${cupom.deliveryTipo}</p>
          <p><strong>Data e Hora:</strong> ${cupom.deliveryData.toLocaleString()}</p>
        </div>
      `;
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className={classes.container}>
      <div className={classes.containerForm}>
        <h2>{cliente.nome}</h2>
        <p><strong>Endereço:</strong> {cliente.endereco}, {cliente.numero}, {cliente.complemento}, {cliente.bairro}, {cliente.estado}, {cliente.cep}</p>
        <form className={classes.formulario} onSubmit={handleSubmit}>
          <div className={classes.controle_de_campo}>
            <label htmlFor="deliveryTipo">Tipo de Entrega:</label>
            <select id="deliveryTipo" value={deliveryTipo} onChange={handleTipoChange}>
              <option value="Entrega">Entrega</option>
              <option value="Retirada">Retirada</option>
            </select>
          </div>
          <div className={classes.controle_de_campo}>
            <label htmlFor="deliveryData">Data:</label>
            <input type="date" id="deliveryData" value={deliveryData} onChange={handleDataChange} required />
          </div>
          <div className={classes.controle_de_campo}>
            <label htmlFor="deliveryHora">Hora:</label>
            <input type="time" id="deliveryHora" value={deliveryHora} onChange={handleHoraChange} required />
          </div>
          {error && <p className={classes.error}>{error}</p>}
          {loading ? <p>Carregando...</p> : <button type="submit" className={classes.btn_enter}>Agendar</button>}
        </form>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cupom de Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cupom && (
            <div>
              <p><strong>Cliente:</strong> {cliente.nome}</p>
              <p><strong>Endereço:</strong> {cliente.endereco}, {cliente.numero}, {cliente.complemento}, {cliente.bairro}, {cliente.estado}, {cliente.cep}</p>
              <p><strong>Tipo de Entrega:</strong> {cupom.deliveryTipo}</p>
              <p><strong>Data e Hora:</strong> {cupom.deliveryData.toLocaleString()}</p>
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
