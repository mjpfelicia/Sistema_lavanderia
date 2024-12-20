import React, { useState } from 'react';
import './DefectPicker.css';

const defects = [
  'sem descrição',
  'Rasgado',
  'Manchado',
  'Desbotado',
  'Faltando Botão',
  'Rasgão no Tecido',
  'Zíper Quebrado',
  'Furo',
  'Desfiado',
  'Costura Solta',
  'Tecido Esticado',
  'Desgaste',
  'Bolor',
  'Encolhido',
  'Mancha de Tinta',
  'Parte Queimada',
  'Orlas Desgastadas',
  'Partes Soltas',
  'Elasticidade Perdida',
  'Fecho Defeituoso',
  'Rasgo nas Costuras'
];

console.log(defects);

interface DefectPickerProps {
  selecionarDefeito: (defeito: string) => void;
  confirmarDefeitos: () => void;
}

const DefectPicker: React.FC<DefectPickerProps> = ({ selecionarDefeito, confirmarDefeitos }) => {
  const [selectedDefect, setSelectedDefect] = useState<string>('');

  const handleDefectClick = (defect: string) => {
    setSelectedDefect(defect);
    selecionarDefeito(defect);
  };

  return (
    <div className="defect-picker">
      <div className="defect-table">
        {defects.map((defect, index) => (
          <div
            key={index}
            className={`defect-cell ${selectedDefect === defect ? 'selected' : ''}`}
            onClick={() => handleDefectClick(defect)}
          >
            {defect}
          </div>
        ))}
      </div>
      <div className="defect-code">
        {selectedDefect ? `Defeito selecionado: ${selectedDefect}` : 'Clique em um defeito'}
      </div>
      <button className='button-defect' onClick={confirmarDefeitos}>Confirmar Defeitos</button>
    </div>
  );
};

export default DefectPicker;
