import React, { useState } from 'react';
import './CaracteristicasPeca.css';

const colors = [
  'sem descricao',
  'Azul',
  'Laranja',
  'Preto',
  'Vermelho',
  'Verde',
  'Amarelo',
  'Roxo',
  'Rosa',
  'Marrom',
  'Cinza',
  'Branco',
  'Azul Claro',
  'Verde Claro',
  'Amarelo Claro',
  'Rosa Claro',
  'Cinza Claro',
  'Aqua',
  'Azul-Marinho',
  'Azul Celeste',
  'Bege',
  'Castanho',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'Dourado',
  'Fucsia',
  'Indigo',
  'Lavanda',
  'Lima',
  'Oliva',
  'Prata',
  'Salmao',
  'Turquesa',
  'Violeta',
];

const brands = [
  'Sem descricao',
  'Marca A',
  'Marca B',
  'Marca C',
  'Marca D',
  'Marca E',
  'Marca F',
  'Marca G',
  'Marca H',
  'Marca I',
  'Marca J',
  'Marca K',
  'Marca L',
  'Marca M',
  'Marca N',
  'Marca O',
  'Marca P',
];

const defects = [
  'sem descricao',
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

interface CaracteristicasPecaProps {
  onConfirm: (payload: { colors: string[]; brand: string; defects: string[] }) => void;
}

const CaracteristicasPeca: React.FC<CaracteristicasPecaProps> = ({ onConfirm }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);

  const toggleColor = (color: string) => {
    setSelectedColors((current) =>
      current.includes(color) ? current.filter((item) => item !== color) : [...current, color],
    );
  };

  const toggleDefect = (defect: string) => {
    setSelectedDefects((current) =>
      current.includes(defect) ? current.filter((item) => item !== defect) : [...current, defect],
    );
  };

  const handleConfirm = () => {
    onConfirm({
      colors: selectedColors,
      brand: selectedBrand,
      defects: selectedDefects,
    });
  };

  return (
    <div className="caracteristicas-peca">
      <div className="caracteristicas-header">
        <h3>Caracteristicas da peca</h3>
        <p>Defina cor, marca e defeitos antes de adicionar a peca ao ticket.</p>
      </div>

      <section className="caracteristicas-section">
        <div className="caracteristicas-section-header">
          <strong>Cores</strong>
          <span>Voce pode escolher mais de uma cor.</span>
        </div>
        <div className="caracteristicas-grid">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`caracteristicas-chip ${selectedColors.includes(color) ? 'selected' : ''}`}
              onClick={() => toggleColor(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </section>

      <section className="caracteristicas-section">
        <div className="caracteristicas-section-header">
          <strong>Marca</strong>
          <span>Escolha a marca principal da peca.</span>
        </div>
        <div className="caracteristicas-grid">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              className={`caracteristicas-chip ${selectedBrand === brand ? 'selected' : ''}`}
              onClick={() => setSelectedBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      <section className="caracteristicas-section">
        <div className="caracteristicas-section-header">
          <strong>Defeitos</strong>
          <span>Selecione os defeitos identificados. Esse campo pode ficar vazio.</span>
        </div>
        <div className="caracteristicas-grid">
          {defects.map((defect) => (
            <button
              key={defect}
              type="button"
              className={`caracteristicas-chip ${selectedDefects.includes(defect) ? 'selected' : ''}`}
              onClick={() => toggleDefect(defect)}
            >
              {defect}
            </button>
          ))}
        </div>
      </section>

      <div className="caracteristicas-footer">
        <span>
          {selectedColors.length} cor(es), {selectedBrand ? 'marca definida' : 'marca pendente'} e{' '}
          {selectedDefects.length} defeito(s) selecionado(s)
        </span>
        <button
          type="button"
          className="caracteristicas-confirmar"
          onClick={handleConfirm}
          disabled={!selectedColors.length || !selectedBrand}
        >
          Confirmar caracteristicas
        </button>
      </div>
    </div>
  );
};

export default CaracteristicasPeca;
