import React from 'react';
import './pagamento/Pagamento.css';
import { Ticket } from './service/apiTicket';

// Definindo as propriedades aceitas pelo componente ImpressaoTicket
interface ImpressaoTicketProps {
  ticket: Ticket;
  ticketNumber: string;
  total: number;
  quantidade: number;
  formaPagamento: string;
  dataRetirada: string;
  statusPagamento: string;
  dataCriacao: string;
}

// Função principal do componente ImpressaoTicket
const ImpressaoTicket: React.FC<ImpressaoTicketProps> = (props) => {
  console.log("ImpressaoTicket:", props);

  // Formatar data e hora de retirada
  const formatDataRetirada = (dataRetirada: string) => {
    const date = new Date(dataRetirada);
    const data = date.toLocaleDateString('pt-BR');
    const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${data} às ${hora}`;
  };

  return (
    <div className="impressao-ticket">
      <h3>Impressão do Ticket</h3>
      <div id="printableArea" className="printableArea">
        <p><strong>Número do Ticket:</strong> {props.ticketNumber}</p>
        <p><strong>Total de Peças:</strong> {props.quantidade}</p>
        <p><strong>Total a Pagar:</strong> R${props.total.toFixed(2)}</p>
        <p><strong>Forma de Pagamento:</strong> {props.formaPagamento}</p>
        <p><strong>Status do Pagamento:</strong> {props.statusPagamento}</p>
        <p><strong>Data de Criação:</strong> {props.dataCriacao}</p>
        <p><strong>Data de Retirada:</strong> {formatDataRetirada(props.dataRetirada)}</p>
        <h4>Itens:</h4>
        <ul>
          {props.ticket.items.length > 0 ? props.ticket.items.map((item, idx) => (
            <li key={idx}>
              {item.subTipo} ({item.quantidade}) - valor R${item.total.toFixed(2)}
            </li>
          )) : <li>Nenhum item selecionado</li>}
        </ul>
      </div>
      <button className="btnImpressao" onClick={() => window.print()}>Imprimir Ticket</button>
    </div>
  );
};

export default ImpressaoTicket;
