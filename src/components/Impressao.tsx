import React from 'react';
import "./pagamento/Pagamento.css";
import { Peca } from './service/apiPeca';
import { Item } from './pagamento/Pagamento';
import { Ticket } from './service/apiTicket';

interface ImpressaoTicketProps {
  ticket: Ticket, 
  ticketNumber: string;
  total: number;
  quantidade: number;

  formaPagamento: string;
  dataRetirada: string;
  statusPagamento: string;
  dataCriacao: string;
}

const ImpressaoTicket: React.FC<ImpressaoTicketProps> = ({ 
  ticket,
  ticketNumber, 
  total, 
  quantidade, 
  formaPagamento, 
  dataRetirada, 
  statusPagamento, 
  dataCriacao 
}) => {
  console.log("ImpressaoTicket:", ticket); 

  return (
    <div className="impressao-ticket">
      <h3>Impressão do Ticket</h3>
      <p><strong>Número do Ticket:</strong> {ticketNumber}</p>
      <p><strong>Data de Criação:</strong> {dataCriacao}</p>
      <p><strong>Total de Peças:</strong> {quantidade}</p>
      <p><strong>Total a Pagar:</strong> R${total.toFixed(2)}</p>
      <p><strong>Forma de Pagamento:</strong> {formaPagamento}</p>
      <p><strong>Status do Pagamento:</strong> {statusPagamento}</p>
      <p><strong>Data de Retirada:</strong> {dataRetirada}</p>
      <h4>Itens:</h4>
      <ul>
        {ticket.items.length > 0 ? ticket.items.map((peca, idx) => (
          <li key={idx}>
            {peca.subTipo} ({peca.quantidade}) - valor R${peca.total.toFixed(2)}
          </li>
        )) : <li>Nenhum item selecionado</li>}
      </ul>
      <button onClick={() => window.print()}>Imprimir Ticket</button>
    </div>
  );
};

export default ImpressaoTicket;
