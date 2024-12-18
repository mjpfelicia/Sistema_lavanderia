
import React from 'react';

// Definindo as propriedades aceitas pelo componente Modal
interface ModalProps {
  children: React.ReactNode;
}

// Função principal do componente Modal
const Step: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className="cards-container">
      {children}
    </div>
  );
};


export default Step;
