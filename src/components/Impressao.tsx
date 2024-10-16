import React from 'react';
import "./pagamento/Pagamento.css"
import { Peca } from './service/apiPeca';

interface ImpressaoTicketProps {
  ticketNumber: string;
  pecas: Peca[];
  total: number;
  quantidade: number;
  formaPagamento: string;
  dataRetirada: string;
  statusPagamento: string;
  dataCriacao: string;
}

const ImpressaoTicket: React.FC<ImpressaoTicketProps> = ({ ticketNumber, pecas, total, quantidade, formaPagamento, dataRetirada, statusPagamento, dataCriacao }) => {
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
        {pecas.map((peca, idx) => (
          <li key={idx}>
            {peca.subTipo} ({peca.quantidade}) - valor R${peca.preco.toFixed(2)}
          </li>
        ))}
      </ul>
      <button onClick={() => window.print()}>Imprimir Ticket</button>
    </div>
  );
};

export default ImpressaoTicket