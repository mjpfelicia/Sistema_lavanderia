import React, { useState, useEffect } from 'react';
import { TipoPeca } from './ServicoLavagem'; 
import './ServicoLavagem.css'; 
import Pagamento from '../pagamento/Pagamento';  

// Interface que define a estrutura das peças
interface Peca {
  id: number;
  tipo: TipoPeca;
  subTipo: string;
  preco: number;
  imagemUrl: string;
}

// Interface que define as propriedades do componente Totalizador
interface TotalizadorProps {
  pecas: Peca[];
  finalizarSelecao: (ticketNumber: string) => void;
}

// Componente Totalizador
const Totalizador: React.FC<TotalizadorProps> = ({ pecas, finalizarSelecao }) => {
  // Estado para armazenar o número do ticket
  const [ticketNumber, setTicketNumber] = useState<string>('');
  // Estado para controlar a exibição do componente de pagamento
  const [showPagamento, setShowPagamento] = useState<boolean>(false);

  // useEffect para gerar um número de ticket aleatório ao montar o componente
  useEffect(() => {
    const newTicketNumber = `${Math.floor(Math.random() * 1000000) + 1}`;
    setTicketNumber(newTicketNumber);
  }, []);  

  // Função chamada ao clicar no botão "Finalizar"
  const handleFinalizar = () => {
    finalizarSelecao(ticketNumber);  
    setShowPagamento(true);  
  };

  // Agrupa as peças por subTipo e calcula a quantidade e o total de cada subtipo
  const pecasAgrupadas = pecas.reduce((acc, peca) => {
    if (acc[peca.subTipo]) {
      acc[peca.subTipo].quantidade += 1;
      acc[peca.subTipo].total += peca.preco;
    } else {
      acc[peca.subTipo] = {
        quantidade: 1,
        total: peca.preco
      };
    }
    return acc;
  }, {} as { [key: string]: { quantidade: number; total: number } });

  // Calcula o total de peças e o preço total
  const totalPecas = pecas.length;
  const totalPreco = pecas.reduce((acc, peca) => acc + peca.preco, 0);

  return (
    <div>
      {!showPagamento ? (
        <div className='totalizador'>
          <h3>Ticket</h3>
          {ticketNumber && (
            <div className="ticket-number">
              <p>Número do Ticket: {ticketNumber}</p> 
            </div>
          )}
          <div className="pecas-lista">
            {Object.entries(pecasAgrupadas).map(([subTipo, { quantidade, total }]) => (
              <p key={subTipo}>{subTipo} ({quantidade}) - valor R${total.toFixed(2)}</p>
            ))}
          </div>
          <div className="total-container">
            <p>Total de Peças: {totalPecas}</p>
            <p>Total a Pagar: R${totalPreco.toFixed(2)}</p>
          </div>
          <button onClick={handleFinalizar} className='btnFinalizar'>Finalizar</button>  
        </div>
      ) : (
        <Pagamento total={totalPreco} quantidade={totalPecas} ticketNumber={ticketNumber} /> )}
    </div>
  );
};

export default Totalizador;
