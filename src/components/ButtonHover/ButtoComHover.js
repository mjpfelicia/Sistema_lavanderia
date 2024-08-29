import React, { useState } from 'react';
import { IconContext } from "react-icons";
import "./ButtonHover.css"


const BotaoHover = ({ card, ativarHover }) => {

  const [isHovered, setIsHovered, estiloBase] = useState(false);

  const estiloHover = {
    background: 'var(--color-hover-clicado)',
  };

  return (
    <button className='menu-item shadow-lg  estiloBase estiloHover'
      style={isHovered || ativarHover ? { ...estiloBase, ...estiloHover } : estiloBase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      <a href={card.link}>
        <IconContext.Provider value={{ size: "2rem", color: " #0000b3" }} >
          <img src={card.icon} width={48} height={48} alt={card.name}></img>
          {/* <card.icon></card.icon> */}
        </IconContext.Provider>
        {card.name}</a>
    </button>
  );
}

export default BotaoHover;