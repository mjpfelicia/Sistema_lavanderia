import { useNavigate } from 'react-router-dom';
import { MdExitToApp } from "react-icons/md";
import './CloseButton.css';

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
      <MdExitToApp style={{ color: '#333' }} />
    </button>
  );
}

export default CloseButton;
