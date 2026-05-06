import React, { useState } from 'react';
import Header from "../../Header/Header";
import VisualizarTicket from "./ListaTicket";
import styles from './BuscaTicket.module.css';

const VisualizarTicketPage = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [searchTicketNumber, setSearchTicketNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (ticketNumber.trim()) {
      setSearchTicketNumber(ticketNumber);
      setErrorMessage("");
    } else {
      setErrorMessage("Por favor, digite um número de ticket válido.");
    }
  };

  return (
    <div className={styles.pageShell}>
      <Header nomePagina="Visualizar Ticket" />

      <main className={styles.pageContent}>
        <section className={styles.heroPanel}>
          <span className={styles.eyebrow}>Busca operacional</span>
          <h1>Consultar ticket com mais contexto</h1>
          <p>
            Busque pelo número do ticket para revisar peças, entrega, pagamento e liberar a conferência com mais
            segurança.
          </p>
        </section>

        <section className={styles.searchSurface}>
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
              </>
            )}
          </div>
          {searchTicketNumber && <VisualizarTicket ticketNumber={searchTicketNumber} />}
        </section>
      </main>
    </div>
  );
};

export default VisualizarTicketPage;
