//dependências e arquivos de estilo
import React from 'react';
import "./pagamento/Pagamento.css";
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
const ImpressaoTicket: React.FC<ImpressaoTicketProps> = (impressaoTicketProps) => {
    console.log("ImpressaoTicket:", impressaoTicketProps);

    return (
        <div className="impressao-ticket" >
            <h3>Impressão do Ticket</h3>
            <div id="printableArea" className='printableArea'>
                <p><strong>Número do Ticket:</strong> {impressaoTicketProps.ticketNumber}</p>
                <p><strong>Total de Peças:</strong> {impressaoTicketProps.quantidade}</p>
                <p><strong>Total a Pagar:</strong> R${impressaoTicketProps.total.toFixed(2)}</p>
                <p><strong>Forma de Pagamento:</strong> {impressaoTicketProps.formaPagamento}</p>
                <p><strong>Status do Pagamento:</strong> {impressaoTicketProps.statusPagamento}</p>
                <p><strong>Data de Criação:</strong> {impressaoTicketProps.dataCriacao}</p>
                <p><strong>Data de Retirada:</strong> {impressaoTicketProps.dataRetirada}</p>
                <h4>Itens:</h4>
                <ul>
                    {impressaoTicketProps.ticket.items.length > 0 ? impressaoTicketProps.ticket.items.map((peca, idx) => (
                        <li key={idx}>
                            {peca.subTipo} ({peca.quantidade}) - valor R${peca.total.toFixed(2)}
                        </li>
                    )) : <li>Nenhum item selecionado</li>}
                </ul>
            </div>
            <button className='btnImpressao' onClick={() => window.print()}>Imprimir Ticket</button>
        </div>
    );
};


export default ImpressaoTicket;
