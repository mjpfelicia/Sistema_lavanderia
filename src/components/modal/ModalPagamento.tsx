import React from 'react';
import './modal.css';
import Pagamento from '../pagamento/Pagamento';
import { Ticket } from '../../service/apiTicket';

interface ModalPagamentoProps {
  total: number;
  quantidade: number;
  fecharModal: () => void;
  ticketNumber: string;
  ticket: Ticket;
}

const ModalPagamento: React.FC<ModalPagamentoProps> = ({
  total,
  quantidade,
  fecharModal,
  ticketNumber,
  ticket,
}) => {
  return (
    <div className="modalPagamento">
      <div className="modalContentPagamento">
        <div className="modalPagamentoHeader">
          <div>
            <span className="modalPagamentoKicker">Finalizacao</span>
            <h3>Pagamento do atendimento</h3>
          </div>
          <button
            type="button"
            className="close closeButtonModern"
            onClick={fecharModal}
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>

        <Pagamento
          ticket={ticket}
          total={total}
          quantidade={quantidade}
          ticketNumber={ticketNumber}
          itens={[]}
        />
      </div>
    </div>
  );
};

export default ModalPagamento;
