import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [content, setContent] = useState<React.ReactNode>(children);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setContent(children);
  }, [children]);

  if (!isOpen) return null;

  return (
    <div className="modalClienteAtualizar" role="dialog" aria-modal="true">
      <div className="modal-edit-client">
        {content}
        <button className="close-button" onClick={onClose} aria-label="Close modal">X</button>
      </div>
    </div>
  );
};

export default Modal;
