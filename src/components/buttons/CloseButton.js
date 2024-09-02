import { useNavigate } from 'react-router-dom';



function CloseButton() {
  const navegar = useNavigate();

  const redirecionarParaInicio = () => {
    navegar("/");
  };

  return <button onClick={redirecionarParaInicio} type="button" style={buttonStyle} className="btn-close" aria-label="Close"></button>;
}



const buttonStyle = {
 
  border: 'none',
  padding: '10px',
  cursor: 'pointer'
};
export default CloseButton;