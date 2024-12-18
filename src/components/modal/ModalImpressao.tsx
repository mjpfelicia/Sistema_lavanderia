import React from 'react';
import './modal.css';
import ImpressaoTicket from '../ImpressaoTicket/ImpressaoTicket';
import { Ticket } from '../../service/apiTicket';

interface Peca {
  nome: string;
  subTipo: string;
  quantidade: number;
  preco: number;
}

interface ModalImpressaoProps {
  ticket: Ticket,
  ticketNumber: string;
  total: number;
  quantidade: number;
  formaPagamento: string;
  dataRetirada: string;
  statusPagamento: string;
  pecas: Peca[];
  fecharModal: () => void;
}

const ModalImpressao: React.FC<ModalImpressaoProps> = ({
  ticket,
  ticketNumber,
  total,
  quantidade,
  formaPagamento,
  dataRetirada,
  statusPagamento,
  fecharModal
}) => {
  return (
    <div className='modalImpressao'>
      <div className='modalContentImpressao'>
        <h3>Impressão do Ticket</h3>
        <span className='close' onClick={fecharModal}>&times;</span>
        <ImpressaoTicket
          ticketNumber={ticketNumber}
          formaPagamento={formaPagamento}
          dataRetirada={dataRetirada}
          statusPagamento={statusPagamento}
          total={total}
          quantidade={quantidade}
          dataCriacao={new Date().toLocaleDateString()} 
          ticket={ticket}        
        />
      </div>
    </div>
  );
};

export default ModalImpressao;
