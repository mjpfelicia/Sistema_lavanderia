import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "../Home/Home";
import Recepcao from "./Recepcao";
import EntregaPecas from "./EntregaPeca";
import Delivery from "./Delivery";
import Retorno from "./Retorno";
import Mapa from "./Mapa"
import Relatorio from "./Relatorio"
import Whatsapp from "./Whatsapp"
import Validacao from "./Validacao.js"
import CadastroDeCliente from "./CadastroDeCliente.js"
import CloseButton from "../buttons/CloseButton.js"




const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Recepcao" element={<Recepcao />} />
                <Route path="/EntregaPecas" element={<EntregaPecas />} />
                <Route path="/Delivery" element={<Delivery />} />
                <Route path="/Retorno" element={<Retorno />} />
                <Route path="/Mapa" element={<Mapa />} />
                <Route path="/Relatorio" element={<Relatorio />} />
                <Route path="/Whatsapp" element={<Whatsapp />} />
                <Route path="/Validacao" element={<Validacao />} />
                <Route path="/CadastroDeCliente" element={<CadastroDeCliente />} />
                <Route path="/CloseButton" element={<Home />} />


            </Routes>
        </BrowserRouter>
    )
}

export default Rotas;