
import React, { useState } from 'react';
import classes from '../DetalhesCliente/DetalhesCliente.module.css';
import { Cliente as ClienteInterface } from '../service/apiCliente';
import AtualizaCliente from '../../AtualizaCliente';
import Modal from '../../modal/modal';

interface ClienteProps {
  cliente: ClienteInterface;
  onEdit: (cliente: ClienteInterface) => void;
}

const Cliente: React.FC<ClienteProps> = ({ cliente }) => {
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteInterface | null>(null);
  const handleUpdate = (clienteAtualizado: ClienteInterface) => {
    setClienteSelecionado(null);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onEdit = () => {

    setIsModalOpen(true);
    setClienteSelecionado(cliente);

    console.log("onEdit", { isModalOpen });
    console.log("setClienteSelecionado", { cliente });
  }

  return (
    <>
      <div className={classes.wrapper}>
      
          <div className={classes.cliente}>
            <h2>{cliente?.nome}</h2>
            <p>{cliente?.endereco}</p>
            <p>{cliente?.numero}</p>
            <p>{cliente?.telefone}</p>
            <p>{cliente?.email}</p>
          </div>
          <div className={classes.btnAtualiza}>
            <button onClick={() => onEdit()} className="btn btn-link">
              Editar
            </button>
          </div>
        </div>
  

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Atualizar cliente</h2>
        <AtualizaCliente cliente={cliente} onUpdate={handleUpdate} />
      </Modal>

    </>

  );
};

export default Cliente;
