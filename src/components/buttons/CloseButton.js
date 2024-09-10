import { useNavigate } from 'react-router-dom';
import { FcHome } from "react-icons/fc";
import { BiBorderRadius } from 'react-icons/bi';
import { MdAddToHomeScreen } from "react-icons/md";




const CloseButton = () => {
  const navegar = useNavigate();
  const redirecionarParaInicio = () => {
    navegar("/");
  };
  return <button onClick={redirecionarParaInicio} type="button" style={{ borderRadius: '15%',border:'solid 1px #000', backgroundColor:'#d6effb' }} aria-label="Close">
    <MdAddToHomeScreen/>
   
  </button>;
}



const buttonStyle = {

  border: 'none',
  // padding: '10px',
  cursor: 'pointer',
  animationDuration: '9s',
  borderRadius:'50', 


};
export default CloseButton;