import React, { useState } from 'react';
import './BrandPicker.css';

const brands = [
  'Sem descrição',
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
  'Marca P'
];


interface BrandPickerProps {
  selecionarMarca: (marca: string) => void;
}

const BrandPicker: React.FC<BrandPickerProps> = ({ selecionarMarca }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    selecionarMarca(brand);
  };

  return (
    <div className="brand-picker">
      <div className="brand-table">
        {brands.map((brand, index) => (
          <div
            key={index}
            className={`brand-cell ${selectedBrand === brand ? 'selected' : ''}`}
            onClick={() => handleBrandClick(brand)} >
            {brand}
          </div>
        ))}
      </div>
      <div className="brand-code">
        {selectedBrand ? `Marca selecionada: ${selectedBrand}` : 'Clique em uma marca'}
      </div>
    </div>
  );
};

export default BrandPicker;
