import React, { useState } from 'react';
import '../AgendaDelivery/AgendaDelivery.css';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';


const AgendaDelivery: React.FC = () => {
  const [servico, setServico] = useState('');
  const [name, setName] = useState('');
  const [endereco, setEndereco] = useState('');
  const [data, setData] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, endereco, data, time });
  };

  return (
    <div className='container'>

      <form className="containerForm" onSubmit={handleSubmit}>
        <div>
          <Dropdown as={ButtonGroup}id="dropdown-menu-align-responsive-1">
            <Dropdown.Toggle id="servico">
              selecionar serviço
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/">Retirada</Dropdown.Item>
              <Dropdown.Item href="/">Entrega</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div>
          <label htmlFor="name">Nome do Cliente:</label>
          <input type="text" id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endereco">Endereço:</label>
          <input type="text" id="endereco" value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Dia:</label>
          <input type="date" id="date" value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Hora:</label>
          <input type="time" id="time" value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit">Marcar</button>
          <button type="submit">Cancela</button>
        </div>

      </form>
    </div>
  );
};

export default AgendaDelivery;
