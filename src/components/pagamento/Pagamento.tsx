import React, { useState } from 'react';
import './Pagamento.css';

interface PagamentoProps {
  total: number;
  quantidade: number;
  ticketNumber: string;
  confirmarPagamento: (formaPagamento: string, dataRetirada: string, statusPagamento: string) => void;
}

const Pagamento: React.FC<PagamentoProps> = ({ total, quantidade, ticketNumber, confirmarPagamento }) => {
  const [formaPagamento, setFormaPagamento] = useState<string>('Cartão de Crédito');
  const [pagamentoNaRetirada, setPagamentoNaRetirada] = useState<boolean>(false);
  const [dataRetirada, setDataRetirada] = useState<string>('');
  const [statusPagamento, setStatusPagamento] = useState<string>('A Pagar');
  const [erro, setErro] = useState<string>('');

  const handlePagamento = () => {
    if (!dataRetirada) {
      setErro('Data de retirada não agendada');
      return;
    }
    setErro('');
    if (!pagamentoNaRetirada) {
      setStatusPagamento(`Pago com ${formaPagamento}`);
    } else {
      setStatusPagamento('A Pagar na Retirada');
    }
    confirmarPagamento(formaPagamento, dataRetirada, statusPagamento);
  };

  return (
    <div className='pagamento'>
      <p>Número do Ticket: {ticketNumber}</p>
      <p>Total de Peças: {quantidade}</p>
      <p>Total a Pagar: R${total.toFixed(2)}</p>
      <div>
        <label>
          Pagamento na Retirada:
          <input type="checkbox" checked={pagamentoNaRetirada}
            onChange={(e) => setPagamentoNaRetirada(e.target.checked)} />
        </label>
        Forma de Pagamento:
        <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
        </select>
      </div>
      <div>
        <label>
          Data de Retirada:
          <input type="date" value={dataRetirada}
            onChange={(e) => setDataRetirada(e.target.value)} />
        </label>
      </div>
      <button onClick={handlePagamento} className='btnpagamento'>Confirmar Pagamento</button>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <p>Status do Pagamento: {statusPagamento}</p>
      <p>Retirada em: {dataRetirada || 'Data não agendada'}</p>
    </div>
  );
};

export default Pagamento;
