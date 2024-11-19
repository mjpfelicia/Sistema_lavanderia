import React, { useState } from 'react';
import './Pagamento.css';
import ImpressaoTicket from '../ImpressaoTicket/ImpressaoTicket';
import { Ticket, atualizaTicket } from '../service/apiTicket';

export interface Item {
  nome: string;
  subTipo: string;
  quantidade: number;
  preco: number;
}

interface PagamentoProps {
  total: number;
  quantidade: number;
  ticketNumber: string;
  itens: Item[];
  ticket: Ticket;
}

const Pagamento: React.FC<PagamentoProps> = ({ total, quantidade, ticketNumber, itens, ticket }) => {
  console.log("[Pagamento]: ", { ticket });

  const [formaPagamento, setFormaPagamento] = useState<string>('Cartão de Crédito');
  const [pagamentoNaRetirada, setPagamentoNaRetirada] = useState<boolean>(false);
  const [dataRetirada, setDataRetirada] = useState<string>('');
  const [horaRetirada, setHoraRetirada] = useState<string>('');
  const [statusPagamento, setStatusPagamento] = useState<string>('A Pagar');
  const [erro, setErro] = useState<string>('');
  const [mostrarImpressao, setMostrarImpressao] = useState<boolean>(false);

  const handlePagamento = async () => {
    if (!dataRetirada) {
      setErro('Data de retirada não agendada');
      return;
    }
    if (!horaRetirada) {
      setErro('Hora de retirada não agendada');
      return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(`${dataRetirada}T${horaRetirada}:00`);

    const offset = dataSelecionada.getTimezoneOffset();
    const adjustedDataSelecionada = new Date(dataSelecionada.getTime() - offset * 60 * 1000);

    if (adjustedDataSelecionada < hoje) {
      setErro('Data de retirada não pode ser anterior ao dia atual');
      return;
    }
    setErro('');

    ticket.dataEntrega = adjustedDataSelecionada.toISOString();

    if (pagamentoNaRetirada) {
      setStatusPagamento('A Pagar na Retirada');
      ticket.estaPago = "não";
    } else {
      setStatusPagamento(`Pago com ${formaPagamento}`);
      ticket.estaPago = "sim";
    }

    try {
      const ticketAtualizo = await atualizaTicket(ticket);
      console.log("Dados antes de setMostrarImpressao:", {
        ticketNumber: ticketAtualizo.ticketNumber,
        formaPagamento,
        dataRetirada: ticketAtualizo.dataEntrega,
        statusPagamento: ticketAtualizo.estaPago,
        itens: ticketAtualizo.items
      });

      setMostrarImpressao(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("[ERROR] atualizaTicket:", error.message);
      } else {
        console.log("[ERROR] atualizaTicket:", String(error));
      }
    }
  };

  const handleFormaPagamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormaPagamento(e.target.value);
    if (!pagamentoNaRetirada) {
      setStatusPagamento(`Pago com ${e.target.value}`);
    }
  };

  const handlePagamentoNaRetiradaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagamentoNaRetirada(e.target.checked);
    if (e.target.checked) {
      setStatusPagamento('A Pagar na Retirada');
      setFormaPagamento('');
    } else {
      setStatusPagamento(`Pago com ${formaPagamento}`);
      setFormaPagamento('Cartão de Crédito');
    }
  };

  return (
    <>
      {!mostrarImpressao ? (
        <div className='pagamento'>
          <p>Número do Ticket: {ticketNumber}</p>
          <p>Total de Peças: {quantidade}</p>
          <p>Total a Pagar: R${total.toFixed(2)}</p>
          <div className="checkbox-container">
            <label>
              Pagamento na Retirada:
              <input type="checkbox" checked={pagamentoNaRetirada} onChange={handlePagamentoNaRetiradaChange} />
            </label>
          </div>
          {!pagamentoNaRetirada && (
            <label>
              Forma de Pagamento:
              <select value={formaPagamento} onChange={handleFormaPagamentoChange}>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
              </select>
            </label>
          )}
          <div>
            <label>
              Data de Retirada:
              <input type="date" value={dataRetirada} onChange={(e) => setDataRetirada(e.target.value)} />
            </label>
            <label>
              Hora de Retirada:
              <input type="time" value={horaRetirada} onChange={(e) => setHoraRetirada(e.target.value)} />
            </label>
          </div>
          <button onClick={handlePagamento} className='btnpagamento'>Confirmar Pagamento</button>
          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          <p>Status do Pagamento: {statusPagamento}</p>
          <p>Retirada em: {dataRetirada ? `${dataRetirada} às ${horaRetirada}` : 'Data e hora não agendadas'}</p>
        </div>
      ) : (
        <ImpressaoTicket
          ticketNumber={ticketNumber}
          formaPagamento={formaPagamento || 'Pagamento na Retirada'}
          dataRetirada={`${dataRetirada}T${horaRetirada}:00.000Z`}
          statusPagamento={statusPagamento}
          total={total}
          quantidade={quantidade}
          dataCriacao={new Date().toLocaleDateString()}
          ticket={ticket}
        />
      )}
    </>
  );
};

export default Pagamento; 
