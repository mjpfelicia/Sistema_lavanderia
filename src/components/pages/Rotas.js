import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "../Home/Home";
import Recepcao from "./Recepcao/Recepcao.js";
import EntregaPecas from "./EntregaDePeca/EntregaPeca";
import Delivery from "./Delivery/Delivery";
import DevolucaoDoDelivery from "./DevolucaoDoDelivery/DevolucaoDoDelivery.js";
import Mapa from "./Mapa/Mapa"
import Relatorio from "./Relatorio/Relatorio.js"
import Whatsapp from "./Whatsapp"
import Validacao from "./ValidacaoDeCliente/Validacao.js"
import CadastroDeCliente from "./CadastroDeCliente/CadastroDeCliente.js"
import CloseButton from "../buttons/CloseButton.js"




const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Recepcao" element={<Recepcao />} />
                <Route path="/EntregaPecas" element={<EntregaPecas />} />
                <Route path="/Delivery" element={<Delivery />} />
                <Route path="/DevolucaoDoDelivery" element={<DevolucaoDoDelivery />} />
                <Route path="/Mapa" element={<Mapa />} />
                <Route path="/Relatorio" element={<Relatorio />} />
                <Route path="/Whatsapp" element={<Whatsapp />} />
                <Route path="/ValidacaoDeCliente" element={<Validacao />} />
                <Route path="/CadastroDeCliente" element={<CadastroDeCliente />} />
                <Route path="/" element={<CloseButton />} />


            </Routes>
        </BrowserRouter>
    )
}

export default Rotas;