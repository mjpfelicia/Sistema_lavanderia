import React, { useState } from 'react';
import './ColorPicker.css';

const colors = [
  { name: 'Sem descricao', code: 'rgba(100, 116, 139, 0.4)' },
  { name: 'Azul', code: '#0000FF' },
  { name: 'Laranja', code: '#FFA500' },
  { name: 'Preto', code: '#000000' },
  { name: 'Vermelho', code: '#FF0000' },
  { name: 'Verde', code: '#008000' },
  { name: 'Amarelo', code: '#FFFF00' },
  { name: 'Roxo', code: '#800080' },
  { name: 'Rosa', code: '#FFC0CB' },
  { name: 'Marrom', code: '#8B4513' },
  { name: 'Cinza', code: '#808080' },
  { name: 'Branco', code: '#FFFFFF' },
  { name: 'Azul Claro', code: '#ADD8E6' },
  { name: 'Verde Claro', code: '#90EE90' },
  { name: 'Amarelo Claro', code: '#FFFFE0' },
  { name: 'Rosa Claro', code: '#FFB6C1' },
  { name: 'Cinza Claro', code: '#D3D3D3' },
  { name: 'Aqua', code: '#00FFFF' },
  { name: 'Azul-Marinho', code: '#000080' },
  { name: 'Azul Celeste', code: '#87CEEB' },
  { name: 'Bege', code: '#F5F5DC' },
  { name: 'Castanho', code: '#A52A2A' },
  { name: 'Chartreuse', code: '#7FFF00' },
  { name: 'Chocolate', code: '#D2691E' },
  { name: 'Coral', code: '#FF7F50' },
  { name: 'Dourado', code: '#FFD700' },
  { name: 'Fucsia', code: '#FF00FF' },
  { name: 'Indigo', code: '#4B0082' },
  { name: 'Lavanda', code: '#E6E6FA' },
  { name: 'Lima', code: '#00FF00' },
  { name: 'Oliva', code: '#808000' },
  { name: 'Prata', code: '#C0C0C0' },
  { name: 'Salmao', code: '#FA8072' },
  { name: 'Turquesa', code: '#40E0D0' },
  { name: 'Violeta', code: '#EE82EE' },
];

interface ColorPickerProps {
  selecionarCor: (cores: string[]) => void;
  finalizarSelecaoCores: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selecionarCor, finalizarSelecaoCores }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleColorClick = (colorName: string) => {
    setSelectedColors((current) => {
      const nextColors = current.includes(colorName)
        ? current.filter((item) => item !== colorName)
        : [...current, colorName];
      selecionarCor(nextColors);
      return nextColors;
    });
  };

  return (
    <div className="color-picker-cards-container">
      <div className="color-picker-header">
        <h3>Selecione as cores</h3>
        <p>Voce pode escolher mais de uma cor.</p>
      </div>

      <div className="color-picker-table">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            className={`color-picker-cell ${selectedColors.includes(color.name) ? 'selected' : ''}`}
            onClick={() => handleColorClick(color.name)}
          >
            <span className="color-swatch" style={{ backgroundColor: color.code }} aria-hidden="true"></span>
            <span className="color-label">{color.name}</span>
          </button>
        ))}
      </div>

      <div className="color-picker-code">
        {selectedColors.length ? `Cores selecionadas: ${selectedColors.join(', ')}` : 'Clique em uma ou mais cores'}
        {selectedColors.length > 0 && (
          <button className="button_ColorPicker" onClick={finalizarSelecaoCores}>
            Confirmar Cores
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
