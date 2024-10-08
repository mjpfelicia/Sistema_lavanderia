import React from 'react';
import { TipoPeca } from './ServicoLavagem';
import './ServicoLavagem.css'; 

interface Peca {
  id: number;
  tipo: TipoPeca;
  subTipo: string;
  preco: number;
  imagemUrl: string;
}

interface PecasSelecionadasProps {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;
}

const PecasSelecionadas: React.FC<PecasSelecionadasProps> = ({ pecas, adicionarPeca }) => {
  return (
    <div className='pecas-selecionadas'>
      <h3>Peças Similares</h3>
      <div className="cards-container">
        {pecas.map((peca) => (
          <div key={peca.id} className="card">
            <img src={peca.imagemUrl} alt={peca.subTipo} className="card-image" />
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
