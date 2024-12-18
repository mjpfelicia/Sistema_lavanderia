import React, { useState, useEffect, useMemo } from 'react';
import './ServicoLavagem.css';
import { Ticket, criarTicket } from "../../service/apiTicket";
import { Peca } from '../../service/apiPeca';
import { Cliente } from '../../service/apiCliente';

interface CriarTickerProps {
  cliente: Cliente;
  pecas: Peca[];
  finalizarSelecao: (ticketNumber: string) => void;
  setTicket: (ticket: Ticket) => void;
}

const colorNames = {
  '#0000FF': 'Azul',
  '#FFA500': 'Laranja',
  '#000000': 'Preto',
  '#FF0000': 'Vermelho',
  '#008000': 'Verde',
  '#FFFF00': 'Amarelo',
  '#800080': 'Roxo',
  '#FFC0CB': 'Rosa',
  '#8B4513': 'Marrom',
  '#808080': 'Cinza',
  '#FFFFFF': 'Branco',
  '#ADD8E6': 'Azul Claro',
  '#90EE90': 'Verde Claro',
  '#FFFFE0': 'Amarelo Claro',
  '#FFB6C1': 'Rosa Claro',
  '#D3D3D3': 'Cinza Claro'
} as const;

type ColorCode = keyof typeof colorNames;

const CriarTicket: React.FC<CriarTickerProps> = ({ cliente, pecas, finalizarSelecao, setTicket }) => {
  const [ticketNumber, setTicketNumber] = useState<string>('');

  const totalPecas = useMemo(() => pecas.length, [pecas]);
  const totalPreco = useMemo(() => pecas.reduce((acc, peca) => acc + peca.preco, 0), [pecas]);

  const pecasAgrupadas = useMemo(() => {
    return pecas.reduce((acc, peca) => {
      const key = `${peca.subTipo}-${peca.cor}-${peca.marca}-${peca.defeito}`;
      if (acc[key]) {
        acc[key].quantidade += 1;
        acc[key].total += peca.preco * (peca.quantidade || 1);
      } else {
        acc[key] = {
          quantidade: 1,
          total: peca.preco * (peca.quantidade || 1),
          pecaId: peca.id,
          cor: peca.cor,
          marca: peca.marca,
          defeito: peca.defeito
        };
      }
      return acc;
    }, {} as { [key: string]: { quantidade: number; total: number, pecaId: string, cor: string, marca: string, defeito: string } });
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
      items: Object.entries(pecasAgrupadas).map(([key, { quantidade, total, pecaId, cor, marca, defeito }]) => ({
        pecaId,
        subTipo: key.split('-')[0],
        quantidade,
        total,
        cor: colorNames[cor as ColorCode] || cor,
        marca,
        defeito
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
      <h3>Resumo do Pedido</h3>
      <div className="cliente-info">
        <p><strong>Cliente:</strong> {cliente.nome}</p>
        <p><strong>Telefone:</strong> {cliente.telefone}</p>
        <p><strong>Número do Ticket:</strong> {ticketNumber}</p>
      </div>
      <div className="pecas-lista">
        {Object.entries(pecasAgrupadas).map(([key, { quantidade, total, cor, marca, defeito }], idx) => (
          <p key={idx}>{key.split('-')[0]} ({quantidade}) - Cor: {colorNames[cor as ColorCode] || cor}, Marca: {marca}, Defeito: {defeito} - R${total.toFixed(2)}</p>
        ))}
      </div>
      <div className="total-container">
        <p><strong>Total de Peças:</strong> {totalPecas}</p>
        <p><strong>Total a Pagar:</strong> R${totalPreco.toFixed(2)}</p>
      </div>
      <button onClick={handleFinalizar} className='btnFinalizar'>Finalizar</button>
    </div>
  );
};

export default CriarTicket;
