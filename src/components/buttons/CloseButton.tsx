// Importando a função de navegação do react-router-dom e o ícone de adicionar à tela inicial
import { useNavigate } from 'react-router-dom';
import { MdAddToHomeScreen } from "react-icons/md";

// Função principal do componente CloseButton
const CloseButton = () => {
  // Inicializando a navegação com useNavigate
  const navegar = useNavigate();

  // Função para redirecionar para a página inicial
  const redirecionarParaInicio = () => {
    navegar("/");
  };

  // Renderizando o botão com o ícone e configurando o estilo
  return (
    <button
      onClick={redirecionarParaInicio}
      type="button"
      style={{ borderRadius: '15%', border: 'none', backgroundColor: 'transparent' }}
      aria-label="Close"
    >
      <MdAddToHomeScreen />
    </button>
  );
}

// Exportando o componente
export default CloseButton;
