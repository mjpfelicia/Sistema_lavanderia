import React, { useState } from 'react';
import './EstampaPicker.css';

const estampas = [
  'Sem descricao',
  'Liso',
  'Florido',
  'Quadriculado',
  'Listrado',
  'Poa',
  'Animal print',
  'Geometrico',
  'Xadrez',
  'Tie-dye',
  'Estampado',
  'Bordado',
];

interface EstampaPickerProps {
  selecionarEstampa: (estampa: string) => void;
}

const EstampaPicker: React.FC<EstampaPickerProps> = ({ selecionarEstampa }) => {
  const [selectedEstampa, setSelectedEstampa] = useState<string>('');

  const handleClick = (estampa: string) => {
    setSelectedEstampa(estampa);
    selecionarEstampa(estampa);
  };

  return (
    <div className="estampa-picker">
      <div className="estampa-header">
        <h3>Selecione a estampa</h3>
        <p>Exemplos: florido, liso, quadriculado, listrado e similares.</p>
      </div>

      <div className="estampa-grid">
        {estampas.map((estampa) => (
          <button
            key={estampa}
            type="button"
            className={`estampa-card ${selectedEstampa === estampa ? 'selected' : ''}`}
            onClick={() => handleClick(estampa)}
          >
            {estampa}
          </button>
        ))}
      </div>

      <div className="estampa-feedback">
        {selectedEstampa ? `Estampa selecionada: ${selectedEstampa}` : 'Clique em uma estampa'}
      </div>
    </div>
  );
};

export default EstampaPicker;
