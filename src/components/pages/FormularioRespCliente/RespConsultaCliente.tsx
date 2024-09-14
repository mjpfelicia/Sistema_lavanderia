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
    bairro: ''
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
  },[]);


  console.info("clientes1: ", { clientes: cliente })

  return (
    <div style={{ width: '100vw', height: '100vh', flex: 3, padding: 60, backgroundColor: 'white', }}>
      <form className={classes.content}>
        <div>
          <h1 className={classes.titleCadastro}>Lista de Cliente</h1>
        </div>

        <div className={classes.formGroup}>
          <label>Nome:</label>
          <input type="text" className={classes.formGroupName} name="nome" value={cliente.nome} />
          <div className={classes.formGroupTelefone}>
            <label>Telefone:</label>
            <input type="tel" maxLength={14} className={classes.formControl} name="telefone" value={cliente.telefone} placeholder="(__) _____-____" />
          </div>
        </div>

        <div className={classes.formGroup}>
          <label>Endereço:</label>
          <input type="text" className={classes.formControl} name="endereco" value={cliente.endereco} />
          <div className={classes.formGroupNumero}>
            <label>Número:</label>
            <input type="text" className={classes.formControl} name="numero" value={cliente.numero} />
          </div>
        </div>
        <div className={classes.formGroup}>
          <label>Complemento:</label>
          <input type="text" className={classes.formControl} name="complemento" value={cliente.complemento} />
          <div className={classes.formGroupCep}>
            <label>CEP:</label>
            <input type="text" className={classes.formControl} name="cep" value={cliente.cep} />
          </div>
        </div>

        <div className={classes.formGroup}>
          <label>Estado</label>
          <input type="text" className={classes.formControlEstado} name="estado" value={cliente.estado} />
        </div>
        <div className={classes.formGroup}>
          <label>Bairro:</label>
          <input type="text" className={classes.formControlBairro} name="bairro" value={cliente.bairro} />
        </div>

        <button type="submit" className={classes.btn_cadastra}>Confirma</button>
      </form>


    </div>
  );
};

export default RespostaConsultaCl;
