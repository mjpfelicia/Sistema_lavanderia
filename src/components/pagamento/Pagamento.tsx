import React, { useState } from 'react';
import './Pagamento.css';
import ImpressaoTicket from '../Impressao';
import { Ticket } from '../service/apiTicket';

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
  const [statusPagamento, setStatusPagamento] = useState<string>('A Pagar');
  const [erro, setErro] = useState<string>('');
  const [mostrarImpressao, setMostrarImpressao] = useState<boolean>(false);

  const handlePagamento = () => {
    if (!dataRetirada) {
      setErro('Data de retirada não agendada');
      return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(dataRetirada);

    if (dataSelecionada < hoje) {
      setErro('Data de retirada não pode ser anterior ao dia atual');
      return;
    }

    setErro('');
    
    if (pagamentoNaRetirada) {
      setStatusPagamento('A Pagar na Retirada');
    } else {
      setStatusPagamento(`Pago com ${formaPagamento}`);
    }

    console.log("Dados antes de setMostrarImpressao:", { ticketNumber, formaPagamento, dataRetirada, statusPagamento, itens });
    setMostrarImpressao(true);
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
          <div>
            <label>
              Pagamento na Retirada:
              <input type="checkbox" checked={pagamentoNaRetirada} onChange={handlePagamentoNaRetiradaChange} />
            </label>
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
          </div>
          <div>
            <label>
              Data de Retirada:
              <input type="date" value={dataRetirada} onChange={(e) => setDataRetirada(e.target.value)} />
            </label>
          </div>
          <button onClick={handlePagamento} className='btnpagamento'>Confirmar Pagamento</button>
          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          <p>Status do Pagamento: {statusPagamento}</p>
          <p>Retirada em: {dataRetirada || 'Data não agendada'}</p>
        </div>
      ) : (
        <ImpressaoTicket 
          ticketNumber={ticketNumber}
          formaPagamento={formaPagamento || 'Pagamento na Retirada'}
          dataRetirada={dataRetirada}
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
