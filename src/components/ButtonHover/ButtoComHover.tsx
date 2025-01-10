import { IconContext } from "react-icons";
import { Card } from "../Header/Header";
import "./ButtonHover.css";

const card: Card = {
  name: "",
  icon: undefined,
  link: ""
};

export type BotaoHoverInput = {
  card: Card,
  ativarHover: boolean,
  className?: string 
}

const BotaoHover = ({ card, className }: BotaoHoverInput) => {
  return (
    <div className={`menu-item shadow-lg estiloBase estiloHover iconeEstiloBase ${className}`}>
      <a href={card.link} className="custom-link">
        <IconContext.Provider value={{ className: 'icon' }}>
          <img src={card.icon} width={48} height={48} alt={card.name}></img>
        </IconContext.Provider>
        {card.name}
      </a>
    </div>
  );
}

export default BotaoHover;
