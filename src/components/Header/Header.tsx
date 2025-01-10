import "./Header.css";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';
import ButtonComHover from "../ButtonHover/ButtoComHover";
import CloseButton from '../buttons/CloseButton';
import recepcao from "../../img/recepcao.png";
import peca from "../../img/peca.png";
import delivery from "../../img/delivery.png";
import retornoD from "../../img/retornoD.png";
import VisualizarTicket from "../../img/entrega.png";
import mapa from "../../img/mapa.png";
import relatorio from "../../img/relatorio2.png";
import WhatsApp from "../../img/whapp.png";

export type BotaoPaginaAtiva = {
  nomePagina: string
}

export type Card = {
  name: string;
  icon: any;
  link: string;
}

const Header = ({ nomePagina }: BotaoPaginaAtiva) => {
  const MyCarMenu = [
    { name: "Recepção", icon: recepcao, link: "/recepcao" },
    { name: "Entrada de peças", icon: peca, link: "/EntradaDePeca" },
    { name: "Delivery", icon: delivery, link: "/delivery" },
    { name: "Retorno", icon: retornoD, link: "/DevolucaoDoDelivery" },
    { name: "Visualizar Ticket", icon: VisualizarTicket, link: "/BuscarTicket" },
    { name: "Mapa", icon: mapa, link: "/mapa" },
    { name: "Relatório", icon: relatorio, link: "/relatorio" },
    { name: "WhatsApp", icon: WhatsApp, link: "/Whatsapp" },
  ];

  const [expanded, setExpanded] = useState(false);

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
      <Navbar expand="lg" expanded={expanded}>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle navigation"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='responsive-menu'>
            {MyCarMenu.map((card: Card, id: number) => (
              <Nav.Item key={id}>
                <ButtonComHover
                  card={card}
                  ativarHover={card.name === nomePagina}
                  className={card.name === nomePagina ? 'active-button' : 'iconeEstiloBase'}
                />
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
