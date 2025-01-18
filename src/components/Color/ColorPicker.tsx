import React, { useState } from 'react';
import './ColorPicker.css';

const colors = [
  { name: 'sem descrição', code: 'rgba(0, 0, 0, 0.4)' }, 
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
  { name: 'Salmão', code: '#FA8072' },
  { name: 'Turquesa', code: '#40E0D0' },
  { name: 'Violeta', code: '#EE82EE' }
];

interface ColorPickerProps {
  selecionarCor: (cor: string) => void;
  finalizarSelecaoCores: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selecionarCor, finalizarSelecaoCores }) => {
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleColorClick = (color: { name: string, code: string }) => {
    if (selectedColor === color.code) {
      console.log(`Cor confirmada: ${color.name}`);
    } else {
      setSelectedColor(color.code);
      selecionarCor(color.name);
    }
  };

  return (
    <div className="color-picker-cards-container">
      <div className="color-picker-table">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`color-picker-cell ${selectedColor === color.code ? 'selected' : ''}`}
            style={{ backgroundColor: color.code }}
            onClick={() => handleColorClick(color)}
          >
            {color.name}
          </div>
        ))}
      </div>
      <div className="color-picker-code">
        {selectedColor ? `Cor selecionada: ${colors.find(color => color.code === selectedColor)?.name}` : ''}
        {selectedColor && (
          <button className='button_ColorPicker' onClick={finalizarSelecaoCores}>Confirmar Cores</button>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
