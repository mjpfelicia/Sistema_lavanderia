import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from '../FormularioRespCliente/RespConsultaCliente.module.css';
import { getCliente, Cliente } from "../../service/apiCliente";

interface RespostaConsultaClProps {
  onClienteEncontrado: (cliente: Cliente) => void;
}

const RespostaConsultaCl: React.FC<RespostaConsultaClProps> = ({ onClienteEncontrado }) => {
  const clienteVazio: Cliente = {
    nome: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    estado: '',
    cep: '',
    bairro: '',
    email: '',
    id: 0,
  };

  const [cliente, setCliente] = useState<Cliente>(clienteVazio);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const cliente = await getCliente(1);
        setCliente(cliente);
        onClienteEncontrado(cliente);
      } catch (error) {
        setCliente(clienteVazio);
        console.log("[ERROR] getCliente2:");
      }
    };
    fetchClientes();
  }, [onClienteEncontrado]);

  console.info("clientes1: ", { clientes: cliente });

  return (
    <div className={classes.registerContainer}>
      <form className={classes.registerForm}>
        <div className={classes.titleCadastro}>
          <h1>Lista de Cliente</h1>
        </div>
        <div className={classes.inputGroup}>
          <label>Nome:</label>
          <input type="text" name="nome" value={cliente.nome} readOnly />
          <div className={classes.formGroupTelefone}>
            <label>Telefone:</label>
            <input type="tel" maxLength={14} className={classes.formControl} name="telefone" value={cliente.telefone} placeholder="(__) _____-____" readOnly />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <label>Email:</label>
          <input type="text" name="email" value={cliente.email} readOnly />
          <div className={classes.formGroupEmail}>
            <label>Email:</label>
            <input type="text" className={classes.formControl} name="email" value={cliente.email} placeholder="email" readOnly />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <label>Endereço:</label>
          <input type="text" className={classes.formControl} name="endereco" value={cliente.endereco} readOnly />
          <div className={classes.formGroupNumero}>
            <label>Número:</label>
            <input type="text" className={classes.formControl} name="numero" value={cliente.numero} readOnly />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <label>Complemento:</label>
          <input type="text" className={classes.formControl} name="complemento" value={cliente.complemento} readOnly />
          <div className={classes.formGroupCep}>
            <label>CEP:</label>
            <input type="text" className={classes.formControl} name="cep" value={cliente.cep} readOnly />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <label>Estado</label>
          <input type="text" name="estado" value={cliente.estado} readOnly />
        </div>
        <div className={classes.inputGroup}>
          <label>Bairro:</label>
          <input type="text" name="bairro" value={cliente.bairro} readOnly />
        </div>
      </form>
    </div>
  );
};

export default RespostaConsultaCl;
