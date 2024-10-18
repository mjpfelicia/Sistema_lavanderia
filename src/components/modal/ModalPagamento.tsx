import React, { useState } from 'react';
import './modal.css';
import Pagamento from '../pagamento/Pagamento';
import { Ticket } from '../service/apiTicket';

interface ModalPagamentoProps {
  total: number;
  quantidade: number;
  fecharModal: () => void;
  ticketNumber: string;
  ticket: Ticket;
}

const ModalPagamento: React.FC<ModalPagamentoProps> = ({ total, quantidade, fecharModal, ticketNumber, ticket }) => {
  return (
    <div className='modalPagamento'>
      <div className='modalContentPagamento'>
        <h3>Pagamento</h3>
        <span className='close' onClick={fecharModal}>&times;</span>
        <Pagamento ticket={ticket} total={total} quantidade={quantidade} ticketNumber={ticketNumber} itens={[]} />
      </div>
    </div>
  );
};

export default ModalPagamento;
