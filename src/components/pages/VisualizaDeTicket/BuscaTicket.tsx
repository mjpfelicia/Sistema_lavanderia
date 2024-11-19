// Importa as dependências necessárias
import React, { useState } from 'react';
import Header from "../../Header/Header"; // Importa o componente de cabeçalho
import VisualizarTicket from "./ListaTicket";  // Importa o componente VisualizarTicket
import styles from './BuscaTicket.module.css'; // Importa os estilos CSS

// Componente principal que gerencia a página de visualização de tickets
const VisualizarTicketPage = () => {
  const [ticketNumber, setTicketNumber] = useState(""); // Estado para armazenar o número do ticket digitado
  const [searchTicketNumber, setSearchTicketNumber] = useState(""); // Estado para armazenar o número do ticket a ser pesquisado
  const [errorMessage, setErrorMessage] = useState(""); // Estado para a mensagem de erro

  // Função para lidar com a busca do ticket ao clicar no botão
  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (ticketNumber.trim()) {
      setSearchTicketNumber(ticketNumber); // Define o número do ticket a ser pesquisado
      setErrorMessage(""); // Limpa a mensagem de erro se houver um número válido
    } else {
      setErrorMessage("Por favor, digite um número de ticket válido."); // Define a mensagem de erro
    }
  };

  return (
    <div>
      <Header nomePagina="Delivery" />
      {/* Componente de cabeçalho */}
      <div className={styles.contentInput}>
        {!searchTicketNumber && (
          <>
            <form onSubmit={handleSearch} className={styles.inputGroup}>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Digite o número do ticket"
              />
              <button type="submit" className={styles.btn_buscar}>Buscar Ticket</button>
            </form>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {/* Exibe a mensagem de erro abaixo */}
          </>
        )}
      </div>
      {searchTicketNumber && <VisualizarTicket ticketNumber={searchTicketNumber} />}
      {/* Usa o componente VisualizarTicket */}
    </div>
  );
};

export default VisualizarTicketPage;
