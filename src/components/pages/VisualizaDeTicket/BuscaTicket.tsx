import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VisualizarTicket from "./ListaTicket";
import styles from './BuscaTicket.module.css';

const VisualizarTicketPage = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [searchTicketNumber, setSearchTicketNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedValue = ticketNumber.trim();

    if (normalizedValue) {
      setSearchTicketNumber(normalizedValue);
      setErrorMessage("");
      return;
    }

    setSearchTicketNumber("");
    setErrorMessage("Por favor, digite um número de ticket válido.");
  };

  const handleReset = () => {
    setTicketNumber("");
    setSearchTicketNumber("");
    setErrorMessage("");
  };

  return (
    <div className={styles.pageShell}>

      <main className={styles.pageContent}>
        <section className={styles.heroPanel}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Busca Operacional</span>
            <h1>Consultar ticket</h1>
            <p>
              Busque o ticket atual para revisar entrega, pagamento e liberar as peças com o visual novo do sistema.
            </p>
          </div>
          <div className={styles.heroActions}>
            <Link to="/" className={styles.actionLink}>
              Voltar para Home
            </Link>
            <Link to="/Recepcao" className={`${styles.actionLink} ${styles.secondary}`}>
              Ir para Recepção
            </Link>
          </div>
        </section>

        <section className={styles.searchSurface}>
          <div className={styles.searchHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Consulta</span>
              <h2>Buscar ticket por número</h2>
              <p>Digite o código informado no atendimento para abrir a conferência detalhada do pedido.</p>
            </div>

            {searchTicketNumber && (
              <button type="button" className={styles.secondaryButton} onClick={handleReset}>
                Nova busca
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <label className={styles.fieldGroup}>
              <span>Número do ticket</span>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="Ex.: 1024"
                />
              </div>
            </label>

            <div className={styles.searchActions}>
              <button type="submit" className={styles.primaryButton}>
                Buscar ticket
              </button>
              <button type="button" className={styles.secondaryButton} onClick={handleReset}>
                Limpar
              </button>
            </div>
          </form>

          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

          {searchTicketNumber && <VisualizarTicket ticketNumber={searchTicketNumber} />}
        </section>
      </main>
    </div>
  );
};

export default VisualizarTicketPage;
