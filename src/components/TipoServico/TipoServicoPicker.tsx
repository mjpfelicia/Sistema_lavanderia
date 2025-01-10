import React, { useState } from 'react';
import './TipoServicoPicker.css';

const servicos = [
  'Lavagem',
  'so lavar',
  'So Passar',
  'Costura',
  'Tingimento',
  'Higienização',
  'Impermeabilização',

];

interface TipoServicoPickerProps {
  selecionarServico: (servicos: string[]) => void;
}

const TipoServicoPicker: React.FC<TipoServicoPickerProps> = ({ selecionarServico }) => {
  const [selectedServicos, setSelectedServicos] = useState<string[]>([]);

  const handleServicoClick = (servico: string) => {
    setSelectedServicos((prevSelectedServicos) =>
      prevSelectedServicos.includes(servico)
        ? prevSelectedServicos.filter(s => s !== servico)
        : [...prevSelectedServicos, servico]
    );
  };

  const handleConfirm = () => {
    selecionarServico(selectedServicos);
  };

  return (
    <div className="servico-picker">
      <h3>Selecione o Tipo de Serviço</h3>
      <div className="servico-table">
        {servicos.map((servico, index) => (
          <div
            key={index}
            className={`servico-cell ${selectedServicos.includes(servico) ? 'selected' : ''}`}
            onClick={() => handleServicoClick(servico)}>
            {servico}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button className='button-TipoServicoPicker' onClick={handleConfirm}>Confirmar Serviços</button>
      </div>
    </div>
  );
};

export default TipoServicoPicker;
