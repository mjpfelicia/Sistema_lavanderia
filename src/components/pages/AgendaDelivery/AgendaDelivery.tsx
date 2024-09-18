import React, { useState } from 'react';
import '../AgendaDelivery/AgendaDelivery.css';

const AgendaDelivery: React.FC = () => {
  const [name, setName] = useState('');
  const [endereco, setEndereco] = useState('');
  const [data, setData] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, endereco, data, time });
  };

  return (
    <form className="containerForm" onSubmit={handleSubmit}>
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
        <label htmlFor="date">Data:</label>
        <input type="date" id="date" value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="time">Hora:</label>
        <input type="time"  id="time" value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <button type="submit">Marcar</button>
    </form>
  );
};

export default AgendaDelivery;
