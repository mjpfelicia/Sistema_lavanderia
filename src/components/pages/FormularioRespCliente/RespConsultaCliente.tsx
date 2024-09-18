import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from '../FormularioRespCliente/RespConsultaCliente.module.css'

import { listarClientes, getCliente, Cliente } from "../service/apiCliente"

const RespostaConsultaCl = () => {

  const clienteVazio: Cliente = {
    nome: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    estado: '',
    cep: '',
    bairro: '',
    email: ''
  }

  const [cliente, setCliente] = useState<Cliente>(clienteVazio);

  useEffect(() => {
    const fetchClientes = async () => {
      await getCliente(1)
        .then((cliente) => setCliente(cliente))
        .catch(error => {
          setCliente(clienteVazio);

          console.log("[ERROR] getCliente2:", error.message);
        });
    };

    fetchClientes();
  }, []);


  console.info("clientes1: ", { clientes: cliente })

  return (
    <div className={classes.registerContainer}>
      <form className={classes.registerForm}>

        <div className={classes.titleCadastro}>
          <h1 >Lista de Cliente</h1>
        </div>

        <div className={classes.inputGroup}>
          <label>Nome:</label>
          <input type="text" name="nome" value={cliente.nome} />
          <div className={classes.formGroupTelefone}>
            <label>Telefone:</label>
            <input type="tel" maxLength={14} className={classes.formControl} name="telefone" value={cliente.telefone} placeholder="(__) _____-____" />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <label>Email:</label>
          <input type="text" name="email" value={cliente.email} />
          <div className={classes.formGroupEmail}>
            <label>Email:</label>
            <input type="text"className={classes.formControl} name="email" value={cliente.email} placeholder="email" />
          </div>
        </div>
        
        <div className={classes.inputGroup}>
          <label>Endereço:</label>
          <input type="text" className={classes.formControl} name="endereco" value={cliente.endereco} />
          <div className={classes.formGroupNumero}>
            <label>Número:</label>
            <input type="text" className={classes.formControl} name="numero" value={cliente.numero} />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <label>Complemento:</label>
          <input type="text" className={classes.formControl} name="complemento" value={cliente.complemento} />
          <div className={classes.formGroupCep}>
            <label>CEP:</label>
            <input type="text" className={classes.formControl} name="cep" value={cliente.cep} />
          </div>
        </div>
        <div className={classes.inputGroup}>
          <label>Estado</label>
          <input type="text" name="estado" value={cliente.estado} />
        </div>
        <div className={classes.inputGroup}>
          <label>Bairro:</label>
          <input type="text" name="bairro" value={cliente.bairro} />
        </div>
        
          <button type="submit" className={classes.registerButton}>Confirma</button>

      </form>


    </div>
  );
};

export default RespostaConsultaCl;
