import { useNavigate } from 'react-router-dom';
import { MdAddToHomeScreen } from "react-icons/md";


const CloseButton = () => {
  const navegar = useNavigate();
  const redirecionarParaInicio = () => {
    navegar("/");
  };
  return <button onClick={redirecionarParaInicio} type="button" style={{ borderRadius: '15%',border:'none', backgroundColor:'transparent' }} aria-label="Close">
    <MdAddToHomeScreen/>
   
  </button>;
}


export default CloseButton;