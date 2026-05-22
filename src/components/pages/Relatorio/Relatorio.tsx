import { Link } from 'react-router-dom';
import PageFrame from '../../layouts/PageFrame';
import Formulario from '../DetalhesCliente/DetalhesCliente';

const Relatorio = () => {
  return (
    <PageFrame
      eyebrow="Relatorios"
      title="Consulta de clientes"
      description="A area de relatorio agora herda a mesma aparencia da recepcao, mantendo os cards leves, tons frios e hierarquia visual consistente."
      actions={
        <>
          <Link to="/BuscarTicket" className="page-frame-chip">Buscar ticket</Link>
          <Link to="/CadastroCliente" className="page-frame-chip is-primary">Cadastrar cliente</Link>
        </>
      }
    >
      <Formulario />
    </PageFrame>
  );
};

export default Relatorio;
