import React, { useState, useEffect } from 'react';
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
  
  // Calcula o total de peças e o preço total das peças
  const totalPecas = pecas.length;
  const totalPreco = pecas.reduce((acc, peca) => acc + peca.preco, 0);
  
  // Agrupa as peças pelo subTipo
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
  
  useEffect(() => {
    // Gera um novo número de ticket aleatório
    const newTicketNumber = `${Math.floor(Math.random() * 1000000) + 1}`;
    setTicketNumber(newTicketNumber);
  }, []);
  
  const handleFinalizar = async () => {
    finalizarSelecao(ticketNumber);
    
    // Cria um novo ticket com as peças agrupadas e outras informações do cliente
    const ticketToCreate: Ticket = {
      ticketNumber,
      clienteId: cliente.id,
      estaPago: "não",
      items: Object.entries(pecasAgrupadas).map(([subTipo, { quantidade, total, pecaId }]) => ({
        pecaId,
        subTipo,
        quantidade,
        total
      })),
      total: totalPreco,
      totalPago: totalPreco,
      dataCriacao: new Date().toISOString()
    };
    
    // Envia a requisição para criar o ticket
    await criarTicket(ticketToCreate)
      .then((ticketResponse) => {
        console.log("criarTicket: ", { ticketResponse });
        setTicket(ticketResponse);
      })
      .catch(error => {
        console.log("[ERROR] criar ticket:", error.message);
      });
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
