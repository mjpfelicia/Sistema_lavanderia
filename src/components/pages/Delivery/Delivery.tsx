import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BuscaCliente from '../AgendaDelivery/BuscaCliente';
import AgendaDelivery from '../AgendaDelivery/AgendaDelivery';
import { Cliente } from '../../../service/apiCliente';
import PageFrame from '../../layouts/PageFrame';

const Delivery: React.FC = () => {
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  return (
    <PageFrame
      eyebrow="Logistica"
      title={clienteSelecionado ? `Agendar delivery para ${clienteSelecionado.nome}` : 'Agenda de entregas e retiradas'}
      description={
        clienteSelecionado
          ? 'Confirme tipo, data e horario para concluir o atendimento com o mesmo visual limpo da recepcao.'
          : 'Primeiro localize o cliente. Depois seguimos para o agendamento de retirada ou entrega sem sair do fluxo principal.'
      }
      actions={
        <>
          <Link to="/Recepcao" className="page-frame-chip">Recepcao</Link>
          <Link to="/CadastroCliente" className="page-frame-chip is-primary">Novo cliente</Link>
        </>
      }
    >
      {!clienteSelecionado ? (
        <BuscaCliente onClienteSelecionado={setClienteSelecionado} />
      ) : (
        <AgendaDelivery cliente={clienteSelecionado} />
      )}
    </PageFrame>
  );
};

export default Delivery;
