import React, { useState } from 'react';
import './Pagamento.css';
import ImpressaoTicket from '../ImpressaoTicket/ImpressaoTicket';
import { Ticket, atualizaTicket } from '../../service/apiTicket';

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

const Pagamento: React.FC<PagamentoProps> = ({ total, quantidade, ticketNumber, ticket }) => {
  const [formaPagamento, setFormaPagamento] = useState<string>('Cartao de Credito');
  const [pagamentoNaRetirada, setPagamentoNaRetirada] = useState<boolean>(false);
  const [tipoAtendimento, setTipoAtendimento] = useState<'Entrega' | 'Retirada'>('Retirada');
  const [dataRetirada, setDataRetirada] = useState<string>('');
  const [horaRetirada, setHoraRetirada] = useState<string>('');
  const [statusPagamento, setStatusPagamento] = useState<string>('A Pagar');
  const [erro, setErro] = useState<string>('');
  const [mostrarImpressao, setMostrarImpressao] = useState<boolean>(false);

  const handlePagamento = async () => {
    if (!dataRetirada) {
      setErro(`Data de ${tipoAtendimento.toLowerCase()} não agendada`);
      return;
    }

    if (!horaRetirada) {
      setErro(`Hora de ${tipoAtendimento.toLowerCase()} não agendada`);
      return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(`${dataRetirada}T${horaRetirada}:00`);
    const offset = dataSelecionada.getTimezoneOffset();
    const adjustedDataSelecionada = new Date(dataSelecionada.getTime() - offset * 60 * 1000);

    if (adjustedDataSelecionada < hoje) {
      setErro(`Data de ${tipoAtendimento.toLowerCase()} não pode ser anterior ao dia atual`);
      return;
    }

    setErro('');
    ticket.dataEntrega = adjustedDataSelecionada.toISOString();
    ticket.tipoAtendimento = tipoAtendimento;

    if (pagamentoNaRetirada) {
      setStatusPagamento('A pagar na retirada');
      ticket.estaPago = "nÃ£o";
      ticket.formaPagamento = 'Pagamento na retirada';
      ticket.statusPagamentoDescricao = 'A pagar na retirada';
    } else {
      const status = `Pago com ${formaPagamento}`;
      setStatusPagamento(status);
      ticket.estaPago = "sim";
      ticket.formaPagamento = formaPagamento;
      ticket.statusPagamentoDescricao = status;
    }

    ticket.statusEntrega = 'Aguardando retirada';

    try {
      await atualizaTicket(ticket);
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
      setStatusPagamento('A pagar na retirada');
      setFormaPagamento('');
    } else {
      setFormaPagamento('Cartao de Credito');
      setStatusPagamento('Pago com Cartao de Credito');
    }
  };

  return (
    <>
      {!mostrarImpressao ? (
        <div className='pagamento'>
          <p>Número do Ticket: {ticketNumber}</p>
          <p>Total de Peças: {quantidade}</p>
          <p>Total a Pagar: R${total.toFixed(2)}</p>

          <label>
            Entrega ou retirada:
            <select value={tipoAtendimento} onChange={(e) => setTipoAtendimento(e.target.value as 'Entrega' | 'Retirada')}>
              <option value="Retirada">Retirada</option>
              <option value="Entrega">Entrega</option>
            </select>
          </label>

          <div className="checkbox-container">
            <label>
              Pagamento na retirada:
              <input type="checkbox" checked={pagamentoNaRetirada} onChange={handlePagamentoNaRetiradaChange} />
            </label>
          </div>

          {!pagamentoNaRetirada && (
            <label>
              Forma de pagamento:
              <select value={formaPagamento} onChange={handleFormaPagamentoChange}>
                <option value="Cartao de Credito">Cartão de Crédito</option>
                <option value="Cartao de Debito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
              </select>
            </label>
          )}

          <div>
            <label>
              Data de {tipoAtendimento.toLowerCase()}:
              <input type="date" value={dataRetirada} onChange={(e) => setDataRetirada(e.target.value)} />
            </label>
            <label>
              Hora de {tipoAtendimento.toLowerCase()}:
              <input type="time" value={horaRetirada} onChange={(e) => setHoraRetirada(e.target.value)} />
            </label>
          </div>

          <button onClick={handlePagamento} className='btnpagamento'>Confirmar atendimento</button>
          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          <p>Status do pagamento: {statusPagamento}</p>
          <p>{tipoAtendimento}: {dataRetirada ? `${dataRetirada} às ${horaRetirada}` : 'Data e hora não agendadas'}</p>
        </div>
      ) : (
        <ImpressaoTicket
          ticketNumber={ticketNumber}
          formaPagamento={ticket.formaPagamento || 'Pagamento na retirada'}
          dataRetirada={`${dataRetirada}T${horaRetirada}:00.000Z`}
          statusPagamento={ticket.statusPagamentoDescricao || statusPagamento}
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
