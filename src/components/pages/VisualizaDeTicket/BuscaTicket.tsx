import React, { useState } from 'react';
import Header from "../../Header/Header";
import ListarTicket from "./ListaTicket";

const VisualizarTicketPage = () => {
  // Estado para armazenar o número do ticket digitado pelo usuário
  const [ticketNumber, setTicketNumber] = useState("");
  // Estado para armazenar o número do ticket que será pesquisado
  const [searchTicketNumber, setSearchTicketNumber] = useState("");

  // Função para definir o número do ticket a ser pesquisado
  const handleSearch = () => {
    setSearchTicketNumber(ticketNumber);
  };

  return (
    <div>
      <Header nomePagina="Delivery" />
      <div>
        <input type="text" value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          placeholder="Digite o número do ticket"
        />
        <button onClick={handleSearch}>Buscar Ticket</button>
      </div>
      <ListarTicket ticketNumber={searchTicketNumber} />
    </div>
  );
};


export default VisualizarTicketPage;
