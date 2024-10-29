import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "../Home/Home";
import Recepcao from "./Recepcao/Recepcao";
import EntregaPecas from "./EntregaDePeca/EntregaPeca";
import Delivery from "./Delivery/Delivery";
import DevolucaoDoDelivery from "./DevolucaoDoDelivery/DevolucaoDoDelivery";
import Mapa from "./Mapa/Mapa";
import Relatorio from "./Relatorio/Relatorio";
import Whatsapp from "./Whatsapp/Whatsapp";
import Validacao from "./FormularioValidacao/Formulario";
import CadastroCliente from "./CadastroCliente/CadastroCliente";
import CloseButton from "../buttons/CloseButton";

const Rotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Recepcao" element={<Recepcao />} />
        <Route path="/EntregaPecas" element={<EntregaPecas/>} />
        <Route path="/Delivery" element={<Delivery />} />
        <Route path="/DevolucaoDoDelivery" element={<DevolucaoDoDelivery />} />
        <Route path="/Mapa" element={<Mapa />} />
        <Route path="/Relatorio" element={<Relatorio />} />
        <Route path="/Whatsapp" element={<Whatsapp />} />
        <Route path="/Validacao" element={<Validacao />} />
        <Route path="/CadastroCliente" element={<CadastroCliente />} />
        <Route path="/close" element={<CloseButton />} />
      </Routes>
    </BrowserRouter>
  )
};

export default Rotas;
