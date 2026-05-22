import React from 'react';
import { Link } from 'react-router-dom';
import PageFrame from '../../layouts/PageFrame';

const DevolucaoDoDelivery = () => {
  return (
    <PageFrame
      eyebrow="Retorno"
      title="Devolucao do delivery"
      description="Esta area agora segue a mesma linguagem da recepcao e pode receber o fluxo de devolucao sem quebrar a experiencia visual."
      actions={
        <>
          <Link to="/Delivery" className="page-frame-chip">Voltar ao delivery</Link>
          <Link to="/Recepcao" className="page-frame-chip is-primary">Abrir recepcao</Link>
        </>
      }
    >
      <div style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
        <span className="page-frame-eyebrow">Em preparacao</span>
        <h2 style={{ margin: 0 }}>Fluxo pronto para evoluir</h2>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>
          O espaco de retorno foi reorganizado para manter a mesma base visual das demais paginas.
          Quando a logica de devolucao for conectada, ela ja entra em um layout consistente com o restante do sistema.
        </p>
      </div>
    </PageFrame>
  );
};

export default DevolucaoDoDelivery;
