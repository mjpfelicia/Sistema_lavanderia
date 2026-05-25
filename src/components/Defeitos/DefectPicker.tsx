import React, { useState } from 'react';
import './DefectPicker.css';

const defects = [
  'Sem descricao',
  'Rasgado',
  'Manchado',
  'Desbotado',
  'Faltando Botao',
  'Rasgao no tecido',
  'Ziper quebrado',
  'Furo',
  'Desfiado',
  'Costura solta',
  'Tecido esticado',
  'Desgaste',
  'Bolor',
  'Encolhido',
  'Mancha de tinta',
  'Parte queimada',
  'Orlas desgastadas',
  'Partes soltas',
  'Elasticidade perdida',
  'Fecho defeituoso',
  'Rasgo nas costuras',
];

interface DefectPickerProps {
  selecionarDefeito: (defeitos: string[]) => void;
  confirmarDefeitos: () => void;
}

const DefectPicker: React.FC<DefectPickerProps> = ({ selecionarDefeito, confirmarDefeitos }) => {
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);

  const handleDefectClick = (defect: string) => {
    setSelectedDefects((current) => {
      const nextDefects = current.includes(defect)
        ? current.filter((item) => item !== defect)
        : [...current, defect];
      selecionarDefeito(nextDefects);
      return nextDefects;
    });
  };

  return (
    <div className="defect-picker">
      <div className="defect-header">
        <h3>Selecione os defeitos</h3>
        <p>Marque um ou mais defeitos. Se nao houver, pode deixar vazio.</p>
      </div>

      <div className="defect-table">
        {defects.map((defect) => (
          <button
            key={defect}
            type="button"
            className={`defect-cell ${selectedDefects.includes(defect) ? 'selected' : ''}`}
            onClick={() => handleDefectClick(defect)}
          >
            {defect}
          </button>
        ))}
      </div>

      <div className="defect-code">
        {selectedDefects.length ? `Defeitos selecionados: ${selectedDefects.join(', ')}` : 'Clique em um ou mais defeitos'}
      </div>

      <button className="button-defect" onClick={confirmarDefeitos}>
        Confirmar Defeitos
      </button>
    </div>
  );
};

export default DefectPicker;
