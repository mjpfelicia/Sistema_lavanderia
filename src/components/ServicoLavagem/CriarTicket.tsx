import React, { useState, useEffect, useMemo } from 'react';
import './ServicoLavagem.css';
import { Ticket, criarTicket } from "../service/apiTicket";
import { Peca } from '../service/apiPeca';
import { Cliente } from '../service/apiCliente';

interface TotalizadorProps {
  cliente: Cliente;
  pecas: Peca[];
  finalizarSelecao: (ticketNumber: string) => void;
  setTicket: (ticket: Ticket) => void;
}

const Totalizador: React.FC<TotalizadorProps> = ({ cliente, pecas, finalizarSelecao, setTicket }) => {
  const [ticketNumber, setTicketNumber] = useState<string>('');

  const totalPecas = useMemo(() => pecas.length, [pecas]);
  const totalPreco = useMemo(() => pecas.reduce((acc, peca) => acc + peca.preco, 0), [pecas]);

  const pecasAgrupadas = useMemo(() => {
    return pecas.reduce((acc, peca) => {
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
  }, [pecas]);

  useEffect(() => {
    const newTicketNumber = `${Math.floor(Math.random() * 1000000) + 1}`;
    setTicketNumber(newTicketNumber);
  }, []);

  const handleFinalizar = async () => {
    if (!cliente.id || !cliente.nome || !cliente.telefone) {
      alert("Por favor, preencha todos os dados do cliente antes de finalizar o pedido.");
      return;
    }

    finalizarSelecao(ticketNumber);

    const ticketToCreate: Ticket = {
      ticketNumber,
      clienteId: cliente.id.toString(),
      estaPago: "não",
      items: Object.entries(pecasAgrupadas).map(([subTipo, { quantidade, total, pecaId }]) => ({
        pecaId,
        subTipo,
        quantidade,
        total
      })),
      total: totalPreco,
      totalPago: totalPreco,
      dataCriacao: new Date().toISOString(),
      dataEntrega: ""
    };

    try {
      const ticketResponse = await criarTicket(ticketToCreate);
      console.log("criarTicket: ", { ticketResponse });
      setTicket(ticketResponse);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("[ERROR] criar ticket:", error.message);
      } else {
        console.log("[ERROR] criar ticket:", String(error));
      }
    }
  };

  return (
    <div className='totalizador'>
      <h3>Pedido</h3>
      <div>
        <p>Cliente: {cliente.nome}</p>
        <p>Telefone: {cliente.telefone}</p>
        <p>Número do Ticket: {ticketNumber}</p>
      </div>
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
  );
};

export default Totalizador;
