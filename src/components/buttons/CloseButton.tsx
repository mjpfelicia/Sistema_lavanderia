import { useNavigate } from 'react-router-dom';
import { MdExitToApp } from "react-icons/md"; // Novo ícone
import './CloseButton.css'; // Importando o arquivo CSS

const CloseButton = () => {
  const navigate = useNavigate();

  const redirecionarParaInicio = () => {
    navigate("/");
  };

  return (
    <button
      onClick={redirecionarParaInicio}
      type="button"
      className="close-button"
      aria-label="Close"
    >
      <MdExitToApp /> {/* Novo ícone */}
    </button>
  );
}

export default CloseButton;
