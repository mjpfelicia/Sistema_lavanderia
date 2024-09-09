import { useNavigate } from 'react-router-dom';
import { FcHome } from "react-icons/fc";
import { BiBorderRadius } from 'react-icons/bi';



const CloseButton = () => {
  const navegar = useNavigate();
  const redirecionarParaInicio = () => {
    navegar("/");
  };
  return <button onClick={redirecionarParaInicio} type="button" style={buttonStyle}  aria-label="Close">
    <FcHome />
  </button>;
}



const buttonStyle = {

  border: 'none',
  // padding: '10px',
  cursor: 'pointer',
  animationDuration: '9s',

};
export default CloseButton;