import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "../Home/Home";
import Recepcao from "./Recepcao/Recepcao";
import EntradaDePeca from "./EntradaDePeca/EntradaDePeca";
import BuscarTicket from "./VisualizaDeTicket/BuscaTicket";
import Delivery from "./Delivery/Delivery";
import DevolucaoDoDelivery from "./DevolucaoDoDelivery/DevolucaoDoDelivery";
import Mapa from "./Mapa/Mapa";
import Relatorio from "./Relatorio/Relatorio";
import Whatsapp from "./Whatsapp/Whatsapp";
import Validacao from "./FormularioValidacao/Formulario";
import CadastroCliente from "./CadastroCliente/CadastroCliente";
import CloseButton from "../buttons/CloseButton";
import AgendamentoEntrega from "./AgendaDelivery/AgendaDelivery";
import AdminDashboard from "./Admin/AdminDashboard";
import RelatorioFinanceiro from "./Admin/RelatorioFinanceiro";
import PendenciasRecebimento from "./Admin/PendenciasRecebimento";
import AdminPlaceholder from "./Admin/AdminPlaceholder";
import TicketsEntreguesHoje from "./TicketsEntreguesHoje/TicketsEntreguesHoje";
import TicketsBaixados from "./TicketsBaixados/TicketsBaixados";
import TicketsPendentes from "./TicketsPendentes/TicketsPendentes";
import PecasEmAtraso from "./PecasEmAtraso/PecasEmAtraso";
import ParaEntregarHoje from "./ParaEntregarHoje/ParaEntregarHoje";

const Rotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Recepcao" element={<Recepcao />} />
        <Route path="/EntradaDePeca" element={<EntradaDePeca />} />
        <Route path="/BuscarTicket" element={<BuscarTicket />} />
        <Route path="/BuscarTicket/:ticketNumber" element={<BuscarTicket />} />
        <Route path="/Delivery" element={<Delivery />} />
        <Route path="/DevolucaoDoDelivery" element={<DevolucaoDoDelivery />} />
        <Route path="/Mapa" element={<Mapa />} />
        <Route path="/Relatorio" element={<Relatorio />} />
        <Route path="/Whatsapp" element={<Whatsapp />} />
        <Route path="/Validacao" element={<Validacao />} />
        <Route path="/CadastroCliente" element={<CadastroCliente />} />
        <Route path="/close" element={<CloseButton />} />
        <Route path="/agendamento/:id" element={<AgendamentoEntrega cliente={{
          id: 0,
          nome: "",
          email: "",
          telefone: "",
          endereco: {
            endereco: "",
            numero: "",
            estado: "",
            cep: "",
            bairro: "",
            complemento: ""
          },
        }}/>} />
        <Route path="/tickets-em-aberto" element={<TicketsPendentes />} />
        <Route path="/tickets-baixados" element={<TicketsBaixados />} />
        <Route path="/tickets-entregues-hoje" element={<TicketsEntreguesHoje />} />
        <Route path="/pecas-em-atraso" element={<PecasEmAtraso />} />
        <Route path="/para-entregar-hoje" element={<ParaEntregarHoje />} />
        
        {/* Rotas Administrativas */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/financeiro" element={<RelatorioFinanceiro />} />
        <Route path="/admin/pendencias-recebimento" element={<PendenciasRecebimento />} />
        <Route path="/admin/tickets" element={<AdminPlaceholder title="Gestão de Tickets" description="Gerencie todos os tickets da lavanderia" icon="🎫" />} />
        <Route path="/admin/clientes" element={<AdminPlaceholder title="Clientes" description="Cadastro e histórico de clientes" icon="👥" />} />
        <Route path="/admin/delivery" element={<AdminPlaceholder title="Entregas" description="Controle de entregas e retiradas" icon="🚚" />} />
        <Route path="/admin/configuracoes" element={<AdminPlaceholder title="Configurações" description="Ajustes do sistema" icon="⚙️" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;
