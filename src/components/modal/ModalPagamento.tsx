import React, { useState } from 'react';
import './modal.css'
import Pagamento from '../pagamento/Pagamento';


interface ModalPagamentoProps {
  total: number;
  quantidade: number;
  fecharModal: () => void;
}

const ModalPagamento: React.FC<ModalPagamentoProps> = ({ total, quantidade, fecharModal }) => {
  return (
    <div className='modalPagamento'>
      <div className='modalContentPagamento'>
        <span className='close' onClick={fecharModal}>&times;</span>
        <Pagamento total={total} quantidade={quantidade} ticketNumber={''} />
      </div>
    </div>
  );
};

export default ModalPagamento;

