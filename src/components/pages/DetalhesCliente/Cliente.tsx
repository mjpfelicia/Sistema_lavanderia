
import React, { useState } from 'react';
import classes from '../DetalhesCliente/DetalhesCliente.module.css';
import { Cliente as ClienteInterface } from '../../../service/apiCliente';
import AtualizaCliente from '../../AtualizaCliente/AtualizaCliente';
import Modal from '../../modal/modal';
import BtnAtualiza from '../../buttons/BtnAtualizar';


interface ClienteProps {
  cliente: ClienteInterface;
  onEdit: (cliente: ClienteInterface) => void;
}

const Cliente: React.FC<ClienteProps> = ({ cliente, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
    onEdit(cliente);
    console.log("onEdit", { isModalOpen });
    console.log("setClienteSelecionado", { cliente });
  };

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.cliente}>
          <h2>{cliente?.nome} </h2>
          <span>{cliente?.endereco.endereco}, {cliente?.endereco.numero},</span>
          <span>{cliente?.telefone},</span>
          <span>{cliente?.email}</span>
        </div>
        <div className={classes.btnAtualiza}>
          <BtnAtualiza onClick={handleEditClick} />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Atualizar cliente</h2>
        <AtualizaCliente cliente={cliente} onUpdate={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Cliente;

