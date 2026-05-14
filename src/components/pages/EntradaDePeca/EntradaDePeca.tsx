import { Link, useLocation } from 'react-router-dom';
import ServicoLavagem from '../../ServicoLavagem/ServicoLavagem';
import type { Cliente } from '../../../service/apiCliente';
import './EntradaDePeca.css';

const EntradaDePeca = () => {
  const location = useLocation();
  const cliente = (location.state as { cliente?: Cliente } | null)?.cliente ?? null;

  return (
    <div className="entrada-page">
      <main className="entrada-layout">
        <section className="entrada-hero">
          <div className="entrada-hero-copy">
            <span className="entrada-kicker">{'Recep\u00e7\u00e3o de pe\u00e7as'}</span>
            <h1>{'Selecione as pe\u00e7as e monte o atendimento no novo conceito'}</h1>
            <p>{'A tela prioriza a entrada das pe\u00e7as, com menos ru\u00eddo visual e o mesmo clima limpo da nova recep\u00e7\u00e3o.'}</p>
          </div>

          <div className="entrada-hero-actions">
            <Link to="/Recepcao" className="entrada-action-link">{'Voltar para recep\u00e7\u00e3o'}</Link>
            <Link to="/BuscarTicket" className="entrada-action-link secondary">{'Buscar ticket'}</Link>
          </div>
        </section>

        <section className="entrada-service-shell">
          {!cliente ? (
            <div className="entrada-empty-state">
              <span className="entrada-kicker">Cliente obrigatorio</span>
              <h2>Selecione um cliente antes de cadastrar as pecas</h2>
              <p>
                A entrada de pecas agora depende de um cliente real selecionado. Volte para a recepcao,
                faça a busca e siga com o atendimento a partir da ficha correta.
              </p>
              <div className="entrada-hero-actions">
                <Link to="/Recepcao" className="entrada-action-link">
                  Ir para recepcao
                </Link>
                <Link to="/CadastroCliente" className="entrada-action-link secondary">
                  Cadastrar cliente
                </Link>
              </div>
            </div>
          ) : (
            <ServicoLavagem cliente={cliente} />
          )}
        </section>
      </main>
    </div>
  );
};

export default EntradaDePeca;
