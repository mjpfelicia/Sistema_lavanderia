// Importando dependências e arquivos de estilo
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

// Definindo tipos para propriedades
export type BotaoPaginaAtiva = { 
  nomePagina: string
}

export type Card = { 
  name: string; 
  icon: any; 
  link: string;
}

// Função principal do componente Header
const Header = (botaoPaginaAtiva: BotaoPaginaAtiva) => { 
  // Definindo o menu
  const MyCarMenu = [ 
    { name: "Recepção", icon: recepcao, link: "/recepcao" },
    { name: "Entrada de peças", icon: peca, link: "/EntregaPecas" },
    { name: "Delivery", icon: delivery, link: "/delivery" },
    { name: "Retorno", icon: retornoD, link: "/DevolucaoDoDelivery" },
    { name: "visualizar ticket", icon: VisualizarTicket, link: "/BuscarTicket" },
    { name: "Mapa", icon: mapa, link: "/mapa" },
    { name: "Relatório", icon: relatorio, link: "/relatorio" },
    { name: "WhatsApp", icon: WhatsApp, link: "/Whatsapp" },
  ];

  // Definindo estado para controle de expansão do menu
  const [expanded, setExpanded] = useState(false);

  // Renderizando o componente
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
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='responsive-menu'>
            {MyCarMenu.map((card: Card, id: number) => ( 
              <Nav.Item key={id}>
                <ButtonComHover 
                  card={card} 
                  ativarHover={card.name === botaoPaginaAtiva.nomePagina} 
                />
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}


export default Header;
