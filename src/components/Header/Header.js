import React from 'react'
import "./Header.css"
import Nav from 'react-bootstrap/Nav';
import ButtonComHover from "../ButtonHover/ButtoComHover"
import { Link } from 'react-router-dom';


import { FaMap, FaWhatsapp, } from 'react-icons/fa';
import { TbTruckReturn, TbReportSearch } from "react-icons/tb";
import { GrDeliver } from "react-icons/gr";
import { PiDressDuotone, PiStorefrontDuotone } from "react-icons/pi";


const Header = ({ativaBotao}) => {

  const MyCarMenu = [
    { name: "Recepção", icon: PiStorefrontDuotone, link: "/recepcao" },
    { name: "Entrega de peças", icon: PiDressDuotone, link: "/EntregaPecas" },
    { name: "Delivery", icon: GrDeliver, link: "/delivery" },
    { name: "Retorno", icon: TbTruckReturn, link: "/retorno" },
    { name: "mapa", icon: FaMap, link: "/mapa" },
    { name: "relatório", icon: TbReportSearch, link: "/relatorio" },
    { name: "WhatsApp", icon: FaWhatsapp, link: "/Whatsapp" }

  ]
  return (
    <div>
      <h1 className='title-header'>Sistema de lavanderia</h1>
      <Nav className='responsive-menu'>
        {MyCarMenu.map((card, id) => (
          <Nav.Item key={id}>
            <ButtonComHover card={card} ativarHover={card.name == ativaBotao} />
          </Nav.Item>
        ))}
      </Nav>

    </div>)
}

export default Header;