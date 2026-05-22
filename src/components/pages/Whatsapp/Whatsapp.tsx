import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import './Whatsapp.css';
import PageFrame from '../../layouts/PageFrame';

const WhatsAppIcon: React.FC = () => {
  const handleClick = () => {
    const phoneNumber = '5511999999999';
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <PageFrame
      eyebrow="Canal rapido"
      title="Atendimento via WhatsApp"
      description="Abra a conversa oficial em um ponto de contato que acompanha a mesma identidade visual da recepcao e das telas operacionais."
      actions={
        <>
          <Link to="/Recepcao" className="page-frame-chip">Recepcao</Link>
          <button type="button" className="page-frame-chip is-primary" onClick={handleClick}>
            Abrir conversa
          </button>
        </>
      }
    >
      <button type="button" className="WhatsappContent" onClick={handleClick}>
        <span className="whatsapp-badge">Clique para abrir o WhatsApp</span>
        {FaWhatsapp({})}
        <p>Atalho direto para continuar o atendimento fora do balcao.</p>
      </button>
    </PageFrame>
  );
};

export default WhatsAppIcon;
