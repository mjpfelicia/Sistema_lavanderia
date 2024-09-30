import React, { useState, useMemo } from 'react';
import './ServicoLavagem.css';
import ModalS from '../ServicoLavagem/modalServico';
import '../ServicoLavagem/ServicoLavagem.css'

export type TipoPeca =
  | "CAMISA"
  | "CALCA"
  | "VESTIDO"
  | "JAQUETA"
  | "JALECO"
  | "CAMA";


export type Peca = {
  id: number;
  tipo: TipoPeca;
  subTipo: SubTipos;
  preco: number;
};
export type SubTipos =
  | "CAMISA 1"
  | "CAMISA 2"
  | "CALCA 1"
  | "CALCA 2"
  | "VESTIDO 1"
  | "VESTIDO 2"
  | "JAQUETA 1"
  | "JAQUETA 2"
  | "JALECO 1"
  | "JALECO 2"
  | "CAMA 1"
  | "CAMA 2";

const pecasSimilares: { [key in TipoPeca]: Peca[] } = {
  CAMISA: [
    { id: 7, tipo: "CAMISA", subTipo: 'CAMISA 1', preco: 25.0 },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA 2', preco: 28.0 },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA 2', preco: 28.0 },
  ],
  CALCA: [
    { id: 9, tipo: "CALCA", subTipo: 'CALCA 1', preco: 15.0 },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA 1', preco: 18.0 },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA 2', preco: 18.0 },
  ],
  VESTIDO: [
    { id: 11, tipo: "VESTIDO", subTipo: 'VESTIDO 1', preco: 35.0 },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO 2', preco: 32.0 },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO 2', preco: 32.0 },
  ],
  JAQUETA: [
    { id: 13, tipo: "JAQUETA", subTipo: 'JAQUETA 2', preco: 45.0 },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA 1', preco: 50.0 },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA 2', preco: 50.0 },
  ],
  CAMA: [
    { id: 17, tipo: "CAMA", subTipo: 'CAMA 1', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 2', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 2', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 2', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 1', preco: 42.0 },
  ],
  JALECO: [
    { id: 15, tipo: "JALECO", subTipo: 'JALECO 1', preco: 42.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 1', preco: 44.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 1', preco: 44.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 2', preco: 44.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 2', preco: 44.0 },
  ]
};

const ServicoLavagem: React.FC = () => {
  const [quantidades, setQuantidades] = useState<{ [key in SubTipos]?: number }>({
    "CALCA 1": 0
  });
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [carrinho, addCarrinho] = useState<Peca[]>([])

  const selecionarPeca = (peca: Peca) => {
    const novaQuantidade = (quantidades[peca.subTipo] || 0) + 1;
    const qtd = { ...quantidades, [peca.subTipo]: novaQuantidade };

    setQuantidades(qtd);
    adicionarItem(peca);
  };

  const adicionarItem = (peca: Peca) => {
    addCarrinho(prevItems => [...prevItems, peca]);
  };

  const abrirModal = (peca: Peca) => {
    setPecaSelecionada(peca);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(true);
    setPecaSelecionada(null);
  };

  const total = useMemo(() => {
    return carrinho.reduce((acc, peca) => {
      return acc + peca.preco;
    }, 0);
  }, [quantidades]);

  return (
    <div className='Servicodelavagem'>
      <h2>Serviço de Lavagem de Roupas</h2>
      <div className='content'>
        <div className="cards-container">
          {Object.entries(pecasSimilares).map(([nome, pecas], idx) => (
            <div key={idx} className="card" onClick={() => abrirModal(pecas[0])}    >
              <h3>{nome}</h3>
            </div>
          ))}
        </div>

        <div className="resumo">
          <h3>Resumo</h3>
          <ul>
            {carrinho.map(({ id, preco, subTipo }) => (
              <li key={id}>

                {subTipo}: {preco.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total a pagar: R${total.toFixed(2)}</p>
        </div>

      </div>

      {pecaSelecionada && (
        <ModalS onClose={fecharModal} >
          <h3>Peças Similares </h3>

          <div className="cards-container">
            {pecasSimilares[pecaSelecionada.tipo].map((peca) => (
              <div key={peca.id} className="card" onClick={() => selecionarPeca(peca)}  >
                <h3>{peca.subTipo}</h3>
                <p>Preço: R${peca.preco.toFixed(2)}</p>
              </div>
            ))}
          </div>

        </ModalS>
      )}
    </div>
  );
};

export default ServicoLavagem;
