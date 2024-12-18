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

const Rotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Recepcao" element={<Recepcao />} />
        <Route path="/EntradaDePeca" element={<EntradaDePeca />} />
        <Route path="/BuscarTicket" element={<BuscarTicket />} />
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
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;
