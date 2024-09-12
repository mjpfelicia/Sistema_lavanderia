import React from 'react'
import "./Header.css"
import Nav from 'react-bootstrap/Nav';
import ButtonComHover from "../ButtonHover/ButtoComHover"
import CloseButton from '../buttons/CloseButton';

const recepcao = require("../../img/recepcao.png");
const peca = require("../../img/peca.png");
const delivery = require("../../img/delivery.png");
const retornoD = require("../../img/retornoD.png");
const entregaDePecas = require("../../img/entrega.png");
const mapa = require("../../img/mapa.png");
const relatorio = require("../../img/relatorio2.png");
const WhatsApp = require("../../img/whapp.png");

export type BotaoPaginaAtiva ={
  nomePagina: string
}

export type Card = {
  name: string;
  icon: any;
  link: string;
}

const Header = (botaoPaginaAtiva :BotaoPaginaAtiva) => {

  const MyCarMenu = [
    { name: "Recepção", icon: recepcao, link: "/recepcao" },
    { name: "Entrada de peças", icon: peca, link: "/EntregaPecas" },
    { name: "Delivery", icon: delivery, link: "/delivery" },
    { name: "Retorno", icon: retornoD, link: "/DevolucaoDoDelivery" },
    { name: "Entrega de Peças", icon: entregaDePecas, link: "/EntregaPecas" },
    { name: "Mapa", icon: mapa, link: "/mapa" },
    { name: "Relatório", icon: relatorio, link: "/relatorio" },
    { name: "WhatsApp", icon: WhatsApp, link: "/Whatsapp" },

  ]
  
  return (
    <div>
      <div className='HeaderContent'>
        <div className='headerTitle'>
          <h1 className='title-header'>Sistema de lavanderia</h1>
        </div>
        <div className='linkCadastro'>
          <a href="/CadastroCliente">Cadastrar Cliente</a>
        </div>

        <CloseButton />

      </div>

      <Nav className='responsive-menu'>
        {MyCarMenu.map((card:Card, id: number) => (
          <Nav.Item key={id}>
            <ButtonComHover card={card} ativarHover={card.name === botaoPaginaAtiva.nomePagina} />
          </Nav.Item>
        ))}
      </Nav>
    </div>
  )
}

export default Header;