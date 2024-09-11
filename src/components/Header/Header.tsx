import React from 'react'
import "./Header.css"
import Nav from 'react-bootstrap/Nav';
import ButtonComHover from "../ButtonHover/ButtoComHover"

import recepcao from "../../img/recepcao"
import peca from "../../img/peca.png"
import delivery from "../../img/delivery.png"
import retornoD from "../../img/retornoD.png"
import entregaDePecas from "../../img/entrega.png"
import mapa from "../../img/mapa.png"
import relatorio from "../../img/relatorio.png"
import WhatsApp from "../../img/whapp.png"


export type BotaoPaginaAtiva = {
  botaoPaginaAtiva: string
}

export type Card ={
  name: string,
  icon: any,
  link: string
}


const Header = ({ botaoPaginaAtiva }:BotaoPaginaAtiva) => {

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
          {MyCarMenu.map((card: Card, id: number) => (
            <Nav.Item key={id}>
              <ButtonComHover card={card} ativarHover={card.name == botaoPaginaAtiva} />
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </div>)
}

export default Header;