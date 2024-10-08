import React, { useState, useCallback } from 'react';
import ModalS from '../ServicoLavagem/modalServico';
import { getPecaPorTipo } from '../service/apiPeca';
import PecasSelecionadas from './PecasSelecionadas';
import Totalizador from './Totalizador';
import '../ServicoLavagem/ServicoLavagem.css';

// imagens
import BLAZER from '../../img/blazer.png';
import camisa from '../../img/camisa.jpg';
import calcaSimples from '../../img/calcaSimples.png';
import vestidoSimples from '../../img/vestidoSimple.jpg';
import jaqueta from '../../img/jaquetaS.png';
import edredom from '../../img/edredom.png';
import jaleco from '../../img/jaleco.png';
import toalham from '../../img/toa.png';





const tipoPecaImage = {
  "BLAZER": BLAZER,
  "CAMISA": camisa,
  "CALÇA": calcaSimples,
  "VESTIDO": vestidoSimples,
  "JAQUETA": jaqueta,
  "JALECO": jaleco,
  "CAMA": edredom,
  "MESA": toalham,
}

export type TipoPeca =
  | "BLAZER"
  | "CAMISA"
  | "CALÇA"
  | "VESTIDO"
  | "JAQUETA"
  | "JALECO"
  | "CAMA"
  | "MESA";

const tipoPecaLista: TipoPeca[] = [
  "BLAZER",
  "CAMISA",
  "CALÇA",
  "VESTIDO",
  "JAQUETA",
  "JALECO",
  "CAMA",
  "MESA",
]

export type Peca = {
  id: number;
  tipo: TipoPeca;
  subTipo: string;
  preco: number;
  imagemUrl: string;
};



const ServicoLavagem: React.FC = () => {
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [pecasSelecionadas, setPecasSelecionada] = useState<Peca[]>([]);
  const [pecasAdicionadas, setPecasAdicionadas] = useState<Peca[]>([]);

  const abrirModal = useCallback(async (peca: TipoPeca) => {
    const pecaResponse = await getPecaPorTipo(peca);
    setPecasSelecionada(pecaResponse);
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setPecasSelecionada([]);
  }, []);

  const adicionarPeca = (peca: Peca) => {
    setPecasAdicionadas(prevPecas => [...prevPecas, peca]);
  };

  return (
    <div className='Servicodelavagem'>
      <h2>Serviço de Lavagem de Roupas</h2>
      <div className='content'>
        <div className="cards-container">
          {tipoPecaLista.map((peca, idx) => (
            <div key={idx} className="card" onClick={() => abrirModal(peca)}>
              <img src={tipoPecaImage[peca]} alt={peca} className="card-image" />
              <h3>{peca}</h3>
            </div>
          ))}
        </div>
        {modalAberto && (
          <ModalS onClose={fecharModal}>
            <PecasSelecionadas pecas={pecasSelecionadas} adicionarPeca={adicionarPeca} />
          </ModalS>
        )}
        <Totalizador pecas={pecasAdicionadas} />
      </div>
    </div>
  );
};

export default ServicoLavagem;

