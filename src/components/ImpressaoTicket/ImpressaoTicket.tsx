import React from 'react';
import '../pagamento/Pagamento.css';
import { Ticket } from '../../service/apiTicket';

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

const ImpressaoTicket: React.FC<ImpressaoTicketProps> = (props) => {
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
        <p><strong>Cliente:</strong> {props.ticket.cliente?.nome || 'Cliente do atendimento'}</p>
        <p><strong>Total de peças:</strong> {props.quantidade}</p>
        <p><strong>Total a pagar:</strong> R${props.total.toFixed(2)}</p>
        <p><strong>Forma de pagamento:</strong> {props.formaPagamento}</p>
        <p><strong>Status do pagamento:</strong> {props.statusPagamento}</p>
        <p><strong>Tipo:</strong> {props.ticket.tipoAtendimento || 'Retirada'}</p>
        <p><strong>Data de criação:</strong> {props.dataCriacao}</p>
        <p><strong>Data de entrega/retirada:</strong> {formatDataRetirada(props.dataRetirada)}</p>
        <h4>Peças</h4>
        <ul>
          {props.ticket.items.length > 0 ? props.ticket.items.map((item, idx) => (
            <li key={idx}>
              <strong>{item.subTipo}</strong> ({item.quantidade}) - valor R${item.total.toFixed(2)}
              <br />
              Serviços: {item.servicos || 'Não informado'}
              <br />
              Cor: {item.cores || 'Não informada'}
              <br />
              Marca: {item.marca || 'Não informada'}
              <br />
              Defeitos: {item.defeitos || 'Nenhum'}
            </li>
          )) : <li>Nenhum item selecionado</li>}
        </ul>
      </div>
      <button className="btnImpressao" onClick={() => window.print()}>Imprimir Ticket</button>
    </div>
  );
};

export default ImpressaoTicket;
