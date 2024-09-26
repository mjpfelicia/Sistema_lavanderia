import React, { useState } from 'react';
import '../AgendaDelivery/AgendaDelivery.css';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

interface FormData {
  servico: string;
  name: string;
  endereco: string;
  data: string;
  time: string;
}

const AgendaDelivery: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    servico: '',
    name: '',
    endereco: '',
    data: '',
    time: ''
  });
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleDropdownChange = (value: string) => {
    setFormData(prevState => ({
      ...prevState,
      servico: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    setSubmittedData(null);
  };

  return (
    <div className='container'>
      <form className="containerForm" onSubmit={handleSubmit}>
        <div>
          <Dropdown as={ButtonGroup} id="dropdown-menu-align-responsive-1">
            <Dropdown.Toggle id="servico">
              Selecionar Serviço
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDropdownChange('Retirada')}>Retirada</Dropdown.Item>
              <Dropdown.Item onClick={() => handleDropdownChange('Entrega')}>Entrega</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div>
          <label htmlFor="name">Nome do Cliente:</label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="endereco">Endereço:</label>
          <input type="text" id="endereco" value={formData.endereco} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="data">Dia:</label>
          <input type="date" id="data" value={formData.data} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="time">Hora:</label>
          <input type="time" id="time" value={formData.time} onChange={handleChange} required />
        </div>

        <div>
          <button type="submit">Marcar</button>
          <button type="button" onClick={() => setFormData({ servico: '', name: '', endereco: '', data: '', time: '' })}>Cancelar</button>
        </div>
      </form>

      {submittedData && (
        <>
          <div className="submittedData">
            <div id="printableArea" >
              <h3>Dados Marcados:</h3>
              <p><strong>Serviço:</strong> {submittedData.servico}</p>
              <p><strong>Nome do Cliente:</strong> {submittedData.name}</p>
              <p><strong>Endereço:</strong> {submittedData.endereco}</p>
              <p><strong>Dia:</strong> {submittedData.data}</p>
              <p><strong>Hora:</strong> {submittedData.time}</p>
            </div>
            <button type="button" className='BtnImprimir' onClick={handlePrint}>Imprimir</button>
            <button type="button" className='BtnCancelarA' onClick={handleCancel}>Cancelar Agendamento</button>

          </div>
        </>
      )}
    </div>
  );
};

export default AgendaDelivery;
