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
    return `${data} as ${hora}`;
  };

  return (
    <div className="impressao-ticket">
      <h3>Impressao do Ticket</h3>
      <div id="printableArea" className="printableArea">
        <p><strong>Numero do Ticket:</strong> {props.ticketNumber}</p>
        <p><strong>Cliente:</strong> {props.ticket.cliente?.nome || 'Cliente do atendimento'}</p>
        <p><strong>Total de pecas:</strong> {props.quantidade}</p>
        <p><strong>Total a pagar:</strong> R${props.total.toFixed(2)}</p>
        <p><strong>Forma de pagamento:</strong> {props.formaPagamento}</p>
        <p><strong>Status do pagamento:</strong> {props.statusPagamento}</p>
        <p><strong>Tipo:</strong> {props.ticket.tipoAtendimento || 'Retirada'}</p>
        <p><strong>Data de criacao:</strong> {props.dataCriacao}</p>
        <p><strong>Data de entrega/retirada:</strong> {formatDataRetirada(props.dataRetirada)}</p>
        <h4>Pecas</h4>
        <ul>
          {props.ticket.items.length > 0 ? props.ticket.items.map((item, idx) => (
            <li key={idx}>
              <strong>{item.subTipo}</strong> ({item.quantidade}) - valor R${item.total.toFixed(2)}
              <br />
              Servicos: {item.servicos || 'Nao informado'}
              <br />
              Cor: {item.cores || 'Nao informada'}
              <br />
              Estampa: {item.estampa || 'Nao informada'}
              <br />
              Marca: {item.marca || 'Nao informada'}
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
