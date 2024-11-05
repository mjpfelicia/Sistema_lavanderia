import React, { useState } from 'react';
import Header from "../../Header/Header";
import ListarTicket from "./ListaTicket";
import classe from './BuscaTicket.module.css';

const VisualizarTicketPage = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [searchTicketNumber, setSearchTicketNumber] = useState("");

  // Função para definir o número do ticket a ser pesquisado
  const handleSearch = () => {
    setSearchTicketNumber(ticketNumber);
  };

  return (
    <div>
      <Header nomePagina="Delivery" />
      <div className={classe.contentInpult} >
        <input type="text" value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          placeholder="Digite o número do ticket"
        />
        <button className={classe.btn_buscar} onClick={handleSearch}>Buscar Ticket</button>
      </div>
      <ListarTicket ticketNumber={searchTicketNumber} />
    </div>
  );
};


export default VisualizarTicketPage;