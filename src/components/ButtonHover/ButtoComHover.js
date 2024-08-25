import React, { useState } from 'react';
import { IconContext } from "react-icons";
import "./ButtonHover.css"


const BotaoHover = ({ card }) => {

  const [isHovered, setIsHovered, estiloBase] = useState(false);

  const estiloHover = {
    color: 'White',
    background: 'linear-gradient(to top, #33ccff 34%, #3333ff 100%)',
  };


  return (
    <button className='menu-item shadow-lg rounded estiloBase estiloHover'
      style={isHovered ? { ...estiloBase, ...estiloHover } : estiloBase}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <a href={card.link}>
        <IconContext.Provider value={{ size: "2rem", color: "blue" }}>
          <card.icon></card.icon>
        </IconContext.Provider>
        {card.name}</a>
    </button>
  );
}

export default BotaoHover;