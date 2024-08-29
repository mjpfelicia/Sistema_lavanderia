import React from 'react'
import "./Header.css"
import Nav from 'react-bootstrap/Nav';
import ButtonComHover from "../ButtonHover/ButtoComHover"

import recepcao from "../../img/recepcao.png"
import peca from "../../img/peca.png"
import delivery from "../../img/delivery.png"
import retornoD from "../../img/retornoD.png"
import entregaDePecas from "../../img/entrega.png"
import mapa from "../../img/mapa.png"
import relatorio from "../../img/relatorio.png"
import WhatsApp from "../../img/whapp.png"







const Header = ({ ativaBotao }) => {

  const MyCarMenu = [
    { name: "Recepção", icon: recepcao, link: "/recepcao" },
    { name: "Entrega de peças", icon: peca, link: "/EntregaPecas" },
    { name: "Delivery", icon: delivery, link: "/delivery" },
    { name: "Retorno", icon: retornoD, link: "/retorno" },
    { name: "EntregaDePeca", icon: entregaDePecas, link: "/EntregaPecas" },
    { name: "Mapa", icon: mapa, link: "/mapa" },
    { name: "Relatório", icon: relatorio, link: "/relatorio" },
    { name: "WhatsApp", icon: WhatsApp, link: "/Whatsapp" }

  ]
  return (
    <div>
      <div className='Header'>
        <h1 className='title-header'>Sistema de lavanderia</h1>
        <Nav className='responsive-menu'>
          {MyCarMenu.map((card, id) => (
            <Nav.Item key={id}>
              <ButtonComHover card={card} ativarHover={card.name == ativaBotao} />
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </div>)
}

export default Header;