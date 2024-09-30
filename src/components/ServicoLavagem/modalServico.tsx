import React from 'react';
import classe from './ModalServico.module.css';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className={classe.overlay}   onClick={onClose}>
      <div className={classe.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
        <button className="close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default Modal;
