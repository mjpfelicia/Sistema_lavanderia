import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../Whatsapp/Whatsapp.css';
import Header from "../../Header/Header"

const WhatsAppIcon: React.FC = () => {
  const handleClick = () => {
    // Substitua pelo número de telefone desejado
    const phoneNumber = "5511999999999";
    const WhatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(WhatsappUrl, "_blank");
  };

  return (
    <div onClick={handleClick}>
      <Header nomePagina="header" />
      <div className="WhatsappContent" >
        <FaWhatsapp />
      </div>
    </div>
  );
};

export default WhatsAppIcon;

