import React from 'react';
import './modal.css';
import Pagamento from '../pagamento/Pagamento';

interface ModalPagamentoProps {
  total: number;
  quantidade: number;
  fecharModal: () => void;
  ticketNumber: string;
  confirmarPagamento: (formaPagamento: string, dataRetirada: string, statusPagamento: string) => void;
}

const ModalPagamento: React.FC<ModalPagamentoProps> = ({ total, quantidade, fecharModal, ticketNumber, confirmarPagamento }) => {
  return (
    <div className='modalPagamento'>
      <div className='modalContentPagamento'>
        <h3>Pagamento</h3>
        <span className='close' onClick={fecharModal}>&times;</span>
        <Pagamento total={total} quantidade={quantidade} ticketNumber={ticketNumber} confirmarPagamento={confirmarPagamento} />
      </div>
    </div>
  );
};

export default ModalPagamento;
