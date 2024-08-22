import './App.css';
import { useState } from 'react';
import Header from "./components/Header/Header.js";
import { FaMap, FaRegCopy, FaWhatsapp, } from 'react-icons/fa';
import { TbTruckReturn } from "react-icons/tb";
import { GrDeliver } from "react-icons/gr";
import { PiDressDuotone } from "react-icons/pi";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import { PiStorefrontDuotone } from "react-icons/pi";




// 
const MyCarMenu = [
  { name: "Recepção", icon: PiStorefrontDuotone },
  { name: "Entrega de peças", icon: PiDressDuotone },
  { name: "Delivery", icon: GrDeliver },
  { name: "Retorno", icon: TbTruckReturn },
  { name: "mapa", icon: FaMap },
  { name: "relatório", icon: TbReportSearch },
  { name: "WhatsApp", icon: FaWhatsapp }

]



function App() {
  return (
    <div className="App">
      <Header listaDeMenu={MyCarMenu} />
    </div>
  );
}

export default App;
