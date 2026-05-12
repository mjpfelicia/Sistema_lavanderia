import { Link } from 'react-router-dom';
import FormularioValidacao from '../FormularioValidacao/Formulario';
import './Recepcao.css';

type IconName = 'clients' | 'piece' | 'ticket';

type Shortcut = {
  title: string;
  description: string;
  href: string;
  icon: IconName;
};

const shortcuts: Shortcut[] = [
  {
    title: 'Cadastrar cliente',
    description: 'Abra um novo cadastro quando a busca n\u00e3o localizar a pessoa.',
    href: '/CadastroCliente',
    icon: 'clients',
  },
  {
    title: 'Entrada de pe\u00e7as',
    description: 'Continue para o registro das roupas e servi\u00e7os.',
    href: '/EntradaDePeca',
    icon: 'piece',
  },
  {
    title: 'Buscar ticket',
    description: 'Consulte atendimentos j\u00e1 iniciados.',
    href: '/BuscarTicket',
    icon: 'ticket',
  },
];

const ReceptionIcon = ({ name }: { name: IconName }) => {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'clients':
      return <svg {...common}><path d="M16 19a4 4 0 0 0-8 0" /><circle cx="12" cy="9" r="3.2" /><path d="M6 18.5a3.5 3.5 0 0 0-2.5-3.2M18 18.5a3.5 3.5 0 0 1 2.5-3.2" /></svg>;
    case 'piece':
      return <svg {...common}><path d="M7 6.5h10l1 3.5-2.5 2.2V19h-7v-6.8L6 10l1-3.5Z" /><path d="M9 6.5c0 1.2 1.3 2.2 3 2.2s3-1 3-2.2" /></svg>;
    case 'ticket':
      return <svg {...common}><path d="M6 6h12a2 2 0 0 1 2 2v2.2a1.8 1.8 0 0 0 0 3.6V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.2a1.8 1.8 0 0 0 0-3.6V8a2 2 0 0 1 2-2Z" /><path d="M9 9.5h6M9 14.5h4" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
};

const Recepcao = () => {
  return (
    <div className="recepcao-page">
      <main className="recepcao-layout">
        <section className="recepcao-form-card">
          <div className="recepcao-card-heading">
            <div>
              <span className="recepcao-card-eyebrow">{'Recep\u00e7\u00e3o'}</span>
              <h1>{'Buscar cliente e iniciar o atendimento'}</h1>
              <p>{'Deixe a primeira a\u00e7\u00e3o no topo para agilizar o balc\u00e3o e facilitar a visibilidade da busca.'}</p>
            </div>
          </div>

          <FormularioValidacao />
        </section>

        <section className="recepcao-hero">
          <div className="recepcao-hero-copy">
            <span className="recepcao-kicker">{'Fluxo simples'}</span>
            <p>{'Busque o cliente, confirme os dados e siga para a entrada de pe\u00e7as sem excesso de informa\u00e7\u00e3o na tela.'}</p>
          </div>

          <div className="recepcao-hero-actions">
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.href} to={shortcut.href} className="recepcao-shortcut-card">
                <span className="recepcao-shortcut-icon">
                  <ReceptionIcon name={shortcut.icon} />
                </span>
                <div>
                  <strong>{shortcut.title}</strong>
                  <p>{shortcut.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Recepcao;
