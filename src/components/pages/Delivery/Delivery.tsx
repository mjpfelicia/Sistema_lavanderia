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
          ? 'Valide os tickets em aberto, escolha entre entregar um ticket existente ou agendar nova retirada e confirme o horario.'
          : 'Primeiro localize o cliente por nome ou telefone. Depois o sistema vai validar tickets em aberto e exigir a definicao do proximo passo.'
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
