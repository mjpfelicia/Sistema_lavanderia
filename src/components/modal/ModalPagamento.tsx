import React, { useState } from 'react';
import './modal.css';
import Pagamento from '../pagamento/Pagamento';

interface ModalPagamentoProps {
  total: number;
  quantidade: number;
  fecharModal: () => void;
  ticketNumber: string;
}

const ModalPagamento: React.FC<ModalPagamentoProps> = ({ total, quantidade, fecharModal, ticketNumber }) => {
  return (
    <div className='modalPagamento'>
      <div className='modalContentPagamento'>
        <h1> pagamento teste</h1>
        <span className='close' onClick={fecharModal}>&times;</span>
        <Pagamento total={total} quantidade={quantidade} ticketNumber={ticketNumber} />
      </div>
    </div>
  );
};

export default ModalPagamento;
