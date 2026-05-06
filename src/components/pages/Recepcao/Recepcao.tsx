import Header from "../../Header/Header";
import FormularioValidacao from '../FormularioValidacao/Formulario';
import './Recepcao.css';

const Recepcao = () => {
  return (
    <div className="recepcaoPage">
      <Header nomePagina={"Recepção"} />
      <main className="recepcaoContent">
        <section className="recepcaoHero">
          <span>Recepção</span>
          <h1>Início rápido do atendimento</h1>
          <p>
            Localize o cliente por nome ou telefone, confirme o cadastro e siga direto para o fluxo de peças com uma
            experiência mais clara e organizada.
          </p>
        </section>

        <section className="recepcaoSurface">
          <FormularioValidacao />
        </section>
      </main>
    </div>
  );
};

export default Recepcao;
