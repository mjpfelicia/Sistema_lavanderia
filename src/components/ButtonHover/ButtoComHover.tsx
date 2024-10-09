import { IconContext } from "react-icons";
import { Card } from "../Header/Header";
import "./ButtonHover.css"

const card: Card = {
  name: "",
  icon: undefined,
  link: ""
};

export type BotaoHoverInput = {
  card: Card,
  ativarHover: boolean
}

const BotaoHover = ({ card }: BotaoHoverInput) => {

  return (
    <div className='menu-item shadow-lg  estiloBase estiloHover'>

      <a href={card.link}>
        <IconContext.Provider value={{ size: "2rem", color: "#0000b3" }} >
          <img src={card.icon} width={48} height={48} alt={card.name}></img>
        </IconContext.Provider>
        {card.name}
      </a>
    </div>
  );
}

export default BotaoHover;