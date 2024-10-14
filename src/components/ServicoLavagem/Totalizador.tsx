import React, { useState, useEffect } from 'react';
import './ServicoLavagem.css';
import { Ticket, criarTicket } from "../service/apiTicket"
import { Peca } from '../service/apiPeca';

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

  // Calcula o total de peças e o preço total
  const totalPecas = pecas.length;
  const totalPreco = pecas.reduce((acc, peca) => acc + peca.preco, 0);

  // Agrupa as peças por subTipo e calcula a quantidade e o total de cada subtipo
  const pecasAgrupadas = pecas.reduce((acc, peca) => {
    if (acc[peca.subTipo]) {
      acc[peca.subTipo].quantidade += 1;
      acc[peca.subTipo].total += peca.preco;
      acc[peca.subTipo].pecaId = peca.id;
    } else {
      acc[peca.subTipo] = {
        quantidade: 1,
        total: peca.preco,
        pecaId: peca.id
      };
    }
    return acc;
  }, {} as { [key: string]: { quantidade: number; total: number, pecaId: string } });



  // useEffect para gerar um número de ticket aleatório ao montar o componente
  useEffect(() => {
    const newTicketNumber = `${Math.floor(Math.random() * 1000000) + 1}`;
    setTicketNumber(newTicketNumber);
  }, []);

  const [ticketCriado, criaTicket] = useState<Ticket>();

  // Função chamada ao clicar no botão "Finalizar"
  const handleFinalizar = async () => {
    finalizarSelecao(ticketNumber);
    setShowPagamento(true);

    const ticketToCreate: Ticket = {
      ticketNumber,
      clienteId: 1,
      estaPago: "não",
      items: Object.entries(pecasAgrupadas).map(([subTipo, { quantidade, total, pecaId }]) => ({
        pecaId,
        subTipo,
        quantidade,
        total
      })),
      total: totalPreco,
      totalPago: totalPreco
    }

    console.log("Ticket: ", { ticketToCreate })

    await criarTicket(ticketToCreate)
      .then((ticketResponse) => criaTicket(ticketResponse))
      .catch(error => {
        console.log("[ERROR] criar ticket:", error.message);
      });

  };

  return (
    <div>
      {!showPagamento && (
        <div className='totalizador'>
          <h3>Ticket</h3>
          {ticketNumber && (
            <div className="ticket-number">
              <p>Número do Ticket: {ticketNumber}</p>
            </div>
          )}
          <div className="pecas-lista">
            {Object.entries(pecasAgrupadas).map(([subTipo, { quantidade, total }], idx) => (
              <p key={idx}>{subTipo} ({quantidade}) - valor R${total.toFixed(2)}</p>
            ))}
          </div>
          <div className="total-container">
            <p>Total de Peças: {totalPecas}</p>
            <p>Total a Pagar: R${totalPreco.toFixed(2)}</p>
          </div>
          <button onClick={handleFinalizar} className='btnFinalizar'>Finalizar</button>
        </div>
      )}
    </div>
  );
};

export default Totalizador;
