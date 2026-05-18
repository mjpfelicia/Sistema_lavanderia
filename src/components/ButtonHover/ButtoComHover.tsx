import { Link } from "react-router-dom";
import { Card } from "../Header/Header";
import "./ButtonHover.css";

export type BotaoHoverInput = {
  card: Card;
  ativarHover: boolean;
  className?: string;
};

const BotaoHover = ({ card, ativarHover, className = "" }: BotaoHoverInput) => {
  const stateClassName = ativarHover ? "menuCard is-active" : "menuCard";

  return (
    <Link to={card.link} className={`${stateClassName} ${className}`.trim()} aria-current={ativarHover ? "page" : undefined}>
      <span className="menuCardIconWrap">
        <img src={card.icon} width={42} height={42} alt="" className="menuCardIcon" />
      </span>
      <span className="menuCardLabel">{card.name}</span>
    </Link>
  );
};

export default BotaoHover;
