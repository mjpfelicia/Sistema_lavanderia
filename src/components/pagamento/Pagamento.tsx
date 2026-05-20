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
  const [statusPagamento, setStatusPagamento] = useState<string>('A pagar');
  const [erro, setErro] = useState<string>('');
  const [mostrarImpressao, setMostrarImpressao] = useState<boolean>(false);
  const [processandoPagamento, setProcessandoPagamento] = useState<boolean>(false);
  const [dadosConfirmados, setDadosConfirmados] = useState<{
    formaPagamento: string;
    statusPagamento: string;
    dataRetirada: string;
  } | null>(null);

  const handlePagamento = async () => {
    if (!ticket.id) {
      setErro('O ticket ainda nao terminou de ser criado. Aguarde alguns segundos e tente novamente.');
      return;
    }

    if (!dataRetirada) {
      setErro(`Data de ${tipoAtendimento.toLowerCase()} nao agendada`);
      return;
    }

    if (!horaRetirada) {
      setErro(`Hora de ${tipoAtendimento.toLowerCase()} nao agendada`);
      return;
    }

    const hoje = new Date();
    const dataSelecionada = new Date(`${dataRetirada}T${horaRetirada}:00`);
    const offset = dataSelecionada.getTimezoneOffset();
    const adjustedDataSelecionada = new Date(dataSelecionada.getTime() - offset * 60 * 1000);

    if (adjustedDataSelecionada < hoje) {
      setErro(`Data de ${tipoAtendimento.toLowerCase()} nao pode ser anterior ao dia atual`);
      return;
    }

    setErro('');
    ticket.dataEntrega = adjustedDataSelecionada.toISOString();
    ticket.tipoAtendimento = tipoAtendimento;

    if (pagamentoNaRetirada) {
      setStatusPagamento('A pagar na retirada');
      ticket.estaPago = 'não';
      ticket.formaPagamento = 'Pagamento na retirada';
      ticket.statusPagamentoDescricao = 'A pagar na retirada';
    } else {
      const status = `Pago com ${formaPagamento}`;
      setStatusPagamento(status);
      ticket.estaPago = 'sim';
      ticket.formaPagamento = formaPagamento;
      ticket.statusPagamentoDescricao = status;
    }

    ticket.statusEntrega = 'Aguardando retirada';

    try {
      setProcessandoPagamento(true);
      await atualizaTicket(ticket);
      setDadosConfirmados({
        formaPagamento: ticket.formaPagamento || 'Pagamento na retirada',
        statusPagamento: ticket.statusPagamentoDescricao || statusPagamento,
        dataRetirada: `${dataRetirada}T${horaRetirada}:00.000Z`,
      });
      setMostrarImpressao(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('[ERROR] atualizaTicket:', error.message);
        setErro(`Nao foi possivel finalizar o pagamento: ${error.message}`);
      } else {
        console.log('[ERROR] atualizaTicket:', String(error));
        setErro('Nao foi possivel finalizar o pagamento.');
      }
    } finally {
      setProcessandoPagamento(false);
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
        <div className="pagamento">
          <div className="pagamento-resumo-grid">
            <div className="pagamento-resumo-card">
              <span>Numero do ticket</span>
              <strong>{ticketNumber}</strong>
            </div>
            <div className="pagamento-resumo-card">
              <span>Total de pecas</span>
              <strong>{quantidade}</strong>
            </div>
            <div className="pagamento-resumo-card destaque">
              <span>Total a pagar</span>
              <strong>{`R$ ${total.toFixed(2)}`}</strong>
            </div>
          </div>

          <div className="pagamento-form-grid">
            <label>
              Entrega ou retirada
              <select
                value={tipoAtendimento}
                onChange={(e) => setTipoAtendimento(e.target.value as 'Entrega' | 'Retirada')}
              >
                <option value="Retirada">Retirada</option>
                <option value="Entrega">Entrega</option>
              </select>
            </label>

            <label>
              Data de {tipoAtendimento.toLowerCase()}
              <input type="date" value={dataRetirada} onChange={(e) => setDataRetirada(e.target.value)} />
            </label>

            <label>
              Hora de {tipoAtendimento.toLowerCase()}
              <input type="time" value={horaRetirada} onChange={(e) => setHoraRetirada(e.target.value)} />
            </label>
          </div>

          <div className="checkbox-container">
            <label className="checkbox-card">
              <span>Pagamento na retirada</span>
              <input
                type="checkbox"
                checked={pagamentoNaRetirada}
                onChange={handlePagamentoNaRetiradaChange}
              />
            </label>
          </div>

          {!pagamentoNaRetirada && (
            <label>
              Forma de pagamento
              <select value={formaPagamento} onChange={handleFormaPagamentoChange}>
                <option value="Cartao de Credito">Cartao de Credito</option>
                <option value="Cartao de Debito">Cartao de Debito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
              </select>
            </label>
          )}

          <button onClick={handlePagamento} className="btnpagamento" disabled={processandoPagamento}>
            {processandoPagamento ? 'Finalizando...' : 'Confirmar atendimento'}
          </button>

          {erro && <p className="pagamento-erro">{erro}</p>}

          <div className="pagamento-status-card">
            <p><strong>Status do pagamento:</strong> {statusPagamento}</p>
            <p>
              <strong>{tipoAtendimento}:</strong>{' '}
              {dataRetirada ? `${dataRetirada} as ${horaRetirada}` : 'Data e hora nao agendadas'}
            </p>
          </div>
        </div>
      ) : (
        <ImpressaoTicket
          ticketNumber={ticketNumber}
          formaPagamento={dadosConfirmados?.formaPagamento || ticket.formaPagamento || 'Pagamento na retirada'}
          dataRetirada={dadosConfirmados?.dataRetirada || `${dataRetirada}T${horaRetirada}:00.000Z`}
          statusPagamento={dadosConfirmados?.statusPagamento || ticket.statusPagamentoDescricao || statusPagamento}
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
