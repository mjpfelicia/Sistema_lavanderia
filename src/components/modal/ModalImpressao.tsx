import React from 'react';
import './modal.css';
import ImpressaoTicket from '../Impressao';
import { Peca } from '../service/apiPeca';

interface ModalImpressaoProps {
  ticketNumber: string;
  pecas: Peca[];
  total: number;
  quantidade: number;
  formaPagamento: string;
  dataRetirada: string;
  statusPagamento: string;
  dataCriacao: string;
  fecharModal: () => void;
}

const ModalImpressao: React.FC<ModalImpressaoProps> = ({ ticketNumber, pecas, total, quantidade, formaPagamento, dataRetirada, statusPagamento, dataCriacao, fecharModal }) => {
  return (
    <div className='modalImpressao'>
      <div className='modalContentImpressao'>
        <h3>Impressão do Ticket</h3>
        <span className='close' onClick={fecharModal}>&times;</span>
        <ImpressaoTicket
          ticketNumber={ticketNumber}
          pecas={pecas}
          total={total}
          quantidade={quantidade}
          formaPagamento={formaPagamento}
          dataRetirada={dataRetirada}
          statusPagamento={statusPagamento}
          dataCriacao={dataCriacao}
        />
      </div>
    </div>
  );
};

export default ModalImpressao;
