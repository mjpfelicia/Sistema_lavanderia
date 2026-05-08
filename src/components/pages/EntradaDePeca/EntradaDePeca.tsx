import { Link } from 'react-router-dom';
import ServicoLavagem from '../../ServicoLavagem/ServicoLavagem';
import './EntradaDePeca.css';

const EntradaDePeca = () => {
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
          <ServicoLavagem
            cliente={{
              id: 0,
              nome: '',
              email: '',
              telefone: '',
              endereco: {
                endereco: '',
                numero: '',
                estado: '',
                cep: '',
                bairro: '',
                complemento: '',
              },
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default EntradaDePeca;
