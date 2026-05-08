import React from 'react';
import './PecasSelecionadas.css';
import { Peca } from '../../service/apiPeca';

interface PecasSelecionadasProps {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;
}

const PecasSelecionadas: React.FC<PecasSelecionadasProps> = ({ pecas, adicionarPeca }) => {
  return (
    <div className="pecas-selecionadas">
      <div className="pecas-header">
        <span className="pecas-kicker">{'Subtipos dispon\u00edveis'}</span>
        <p>{'Escolha a pe\u00e7a exata para continuar o detalhamento do atendimento.'}</p>
      </div>

      <div className="cards-container">
        {pecas.map((peca, idx) => (
          <div key={idx} className="card">
            <img src={peca.imagemUrl} alt={peca.subTipo} />
            <div className="peca-card-body">
              <h3>{peca.subTipo}</h3>
              <p>{`R$ ${peca.preco.toFixed(2)}`}</p>
            </div>
            <button onClick={() => adicionarPeca(peca)}>{'Selecionar pe\u00e7a'}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PecasSelecionadas;
