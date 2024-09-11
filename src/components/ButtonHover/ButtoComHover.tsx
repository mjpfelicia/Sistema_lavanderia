import React, { useState } from 'react';
import { IconContext } from "react-icons";
import "./ButtonHover.css"
import { Card } from '../Header/Header';


export type BotaoHoverParametros = {
  card: Card,
  ativarHover: Boolean
}
const BotaoHover = (botaoHoverParametros: BotaoHoverParametros) => {

  const [isHovered, setIsHovered] = useState(false);

  const estiloHover = {
    background: 'var(--color-hover-clicado)',
  };

  return (
    <button className='menu-item shadow-lg  estiloBase estiloHover'
      style={isHovered || botaoHoverParametros.ativarHover ? {...estiloHover } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      <a href={botaoHoverParametros.card.link}>
        <IconContext.Provider value={{ size: "2rem", color: " #0000b3" }} >
          <img src={botaoHoverParametros.card.icon} width={48} height={48} alt={botaoHoverParametros.card.name}></img>
          {/* <botaoHoverParametros.card.icon></card.icon> */}
        </IconContext.Provider>
        {card.name}</a>
    </button>
  );
}

export default BotaoHover;