import React, { useState } from 'react';

interface PagamentoProps {
    total: number;
    quantidade: number;
}

const Pagamento: React.FC<PagamentoProps> = ({ total, quantidade }) => {
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
            setStatusPagamento(`Pago com ${formaPagamento} para retirada em ${dataRetirada}`);
        } else {
            setStatusPagamento(`A Pagar na Retirada em ${dataRetirada}`);
        }
    };

    return (
        <div className='pagamento'>
            <h3>Pagamento</h3>
            <p>Total a Pagar: R${total.toFixed(2)}</p>
            <label>
                Forma de Pagamento:
                <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Pix">Pix</option>
                </select>
            </label>
            <label>
                Pagamento na Retirada:
                <input type="checkbox" checked={pagamentoNaRetirada}
                    onChange={(e) => setPagamentoNaRetirada(e.target.checked)} />
            </label>
            <label>
                Data de Retirada:
                <input type="date" value={dataRetirada}
                    onChange={(e) => setDataRetirada(e.target.value)} />
            </label>
            <button onClick={handlePagamento} className='btnpagamento'>Confirmar Pagamento</button>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <p>Status do Pagamento: {statusPagamento}</p>
        </div>
    );
};

export default Pagamento;
