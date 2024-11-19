import React, { useState } from 'react';
import Header from "../../Header/Header";
import BuscaCliente from "../AgendaDelivery/BuscaCliente";
import AgendaDelivery from "../AgendaDelivery/AgendaDelivery";
import { Cliente } from '../../service/apiCliente';

const Delivery: React.FC = () => {
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  return (
    <div>
      <Header nomePagina="Delivery" />
      {!clienteSelecionado ? (
        <BuscaCliente onClienteSelecionado={setClienteSelecionado} />
      ) : (
        <AgendaDelivery cliente={clienteSelecionado} />
      )}
    </div>
  );
}

export default Delivery;
