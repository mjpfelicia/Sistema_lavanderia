import "./Header.css";
import { Link } from 'react-router-dom';
import ButtonComHover from "../ButtonHover/ButtoComHover";
import CloseButton from '../buttons/CloseButton';
import recepcao from "../../img/recepcao.png";
import peca from "../../img/peca.png";
import delivery from "../../img/delivery.png";
import retornoD from "../../img/retornoD.png";
import visualizarTicket from "../../img/entrega.png";
import mapa from "../../img/mapa.png";
import relatorio from "../../img/relatorio2.png";
import whatsApp from "../../img/whapp.png";

export type BotaoPaginaAtiva = {
  nomePagina: string;
};

export type Card = {
  name: string;
  icon: string;
  link: string;
};

const menuCards: Card[] = [
  { name: "Recepção", icon: recepcao, link: "/recepcao" },
  { name: "Entrada de peças", icon: peca, link: "/EntradaDePeca" },
  { name: "Delivery", icon: delivery, link: "/delivery" },
  { name: "Retorno", icon: retornoD, link: "/DevolucaoDoDelivery" },
  { name: "Visualizar Ticket", icon: visualizarTicket, link: "/BuscarTicket" },
  { name: "Mapa", icon: mapa, link: "/mapa" },
  { name: "Relatório", icon: relatorio, link: "/relatorio" },
  { name: "WhatsApp", icon: whatsApp, link: "/Whatsapp" },
];

const Header = ({ nomePagina }: BotaoPaginaAtiva) => {
  return (
    <header className="appHeader">
      <div className="headerContent">
        <div className="headerBrand">
          <div className="headerBrandMark">SL</div>
          <div className="headerTitle">
            <h1 className="titleHeader">Sistema de lavanderia</h1>
            <p className="titleSubheader">Recepção, produção, entrega e consulta em um fluxo só.</p>
          </div>
        </div>

        <div className="headerActions">
          <Link to="/CadastroCliente" className="headerPrimaryLink">
            Cadastrar cliente
          </Link>
          <CloseButton />
        </div>
      </div>


    </header>
  );
};

export default Header;
