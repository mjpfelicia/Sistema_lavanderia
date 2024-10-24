
import React from 'react';
import classe from './ModalServico.module.css';

// Definindo as propriedades aceitas pelo componente Modal
interface ModalProps { 
  onClose: () => void; 
  children: React.ReactNode;
}

// Função principal do componente Modal
const Modal: React.FC<ModalProps> = ({ onClose, children }) => { 
  return ( 
    // O overlay do modal, que fecha o modal ao ser clicado
    <div className={classe.overlay} onClick={onClose}> 
      {/* Conteúdo do modal, impede propagação do clique para o overlay */}
      <div className={classe.modalContent} onClick={(e) => e.stopPropagation()}> 
        {/* Botão para fechar o modal */}
        <button className={classe.closeButton} onClick={onClose}>x</button> 
        {children}
      </div>
    </div>
  );
};


export default Modal;
