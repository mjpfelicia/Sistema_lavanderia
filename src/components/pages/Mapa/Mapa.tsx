import { Link } from 'react-router-dom';
import PageFrame from '../../layouts/PageFrame';
import MapaComponent from './MapaComponent';

const Mapa = () => {
  return (
    <PageFrame
      eyebrow="Localizacao"
      title="Mapa operacional"
      description="Acompanhe a referencia geografica usada pela equipe dentro da mesma paleta clara, com leitura mais limpa para rotas e atendimento."
      actions={
        <>
          <Link to="/Delivery" className="page-frame-chip">Agenda de delivery</Link>
          <Link to="/Recepcao" className="page-frame-chip is-primary">Recepcao</Link>
        </>
      }
    >
      <MapaComponent />
    </PageFrame>
  );
};

export default Mapa;
