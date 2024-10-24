// Importando React e o arquivo de estilo CSS para o serviço de lavagem
import React from 'react';
import './ServicoLavagem.css';

// Importando a interface Peca do serviço de API
import { Peca } from '../service/apiPeca';

// Importando imagens
import BLAZER from '../../img/blazer.png';
import camisa from '../../img/camisa.jpg';
import calcaSimples from '../../img/calcaSimples.png';
import vestidoSimples from '../../img/vestidoSimple.jpg';
import jaqueta from '../../img/jaquetaS.png';
import edredom from '../../img/edredom.png';
import jaleco from '../../img/jaleco.png';
import toalham from '../../img/toa.png';



// Mapeamento de URLs das imagens com base no nome das peças
const imagemUrl = {
  "BLAZER": BLAZER,
  "CAMISA": camisa,
  "CALÇA": calcaSimples,
  "VESTIDO": vestidoSimples,
  "JAQUETA": jaqueta,
  "JALECO": jaleco,
  "CAMA": edredom,
  "MESA": toalham,
}

// Definindo as propriedades aceitas pelo componente PecasSelecionadas
interface PecasSelecionadasProps {
  pecas: Peca[];
  adicionarPeca: (peca: Peca) => void;
}

// Função principal do componente PecasSelecionadas
const PecasSelecionadas: React.FC<PecasSelecionadasProps> = ({ pecas, adicionarPeca }) => {
  return (
    <div className='pecas-selecionadas'>
      <h3>Peças Similares</h3>
      <div className="cards-container">
        {pecas.map((peca, idx) => (
          <div key={idx} className="card">
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
