import React from 'react';
import './PecasSelecionadas.css';
import { Peca } from '../../service/apiPeca';

// Mapeamento de URLs das imagens com base no nome das peças
const imagemUrl = {
  "BLAZER": 'path/to/blazer.png',
  "CAMISA": 'path/to/camisa.jpg',
  "CALÇA": 'path/to/calcaSimples.png',
  "VESTIDO": 'path/to/vestidoSimples.jpg',
  "JAQUETA": 'path/to/jaquetaS.png',
  "JALECO": 'path/to/jaleco.png',
  "CAMA": 'path/to/edredom.png',
  "MESA": 'path/to/toa.png',
};

// Definindo as propriedades aceitas pelo componente PecasSelecionadas
interface PecasSelecionadasProps {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;
}

// Função principal do componente PecasSelecionadas
const PecasSelecionadas: React.FC<PecasSelecionadasProps> = ({ pecas, adicionarPeca }) => {
  return (
    <div className='pecas-selecionadas'>
      <div className="cards-container">
        {pecas.map((peca, idx) => (
          <div key={idx} className="card">
            <img src={peca.imagemUrl} alt={peca.subTipo} />
            <h3>{peca.subTipo}</h3>
            <p>Preço: R${peca.preco.toFixed(2)}</p>
            <button onClick={() => adicionarPeca(peca)}>Adicionar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PecasSelecionadas;
