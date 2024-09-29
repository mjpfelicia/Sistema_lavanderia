import React, { useState, useMemo } from 'react';
import './ServicoLavagem.css';
import Modal from './modalServico';
import '../ServicoLavagem/ModalServico.css'

export type TipoPeca =
  | "CAMISA"
  | "CALCA"
  | "VESTIDO"
  | "JAQUETA"
  | "JALECO"
  | "CAMA"
  | "TAPETE";

export type Peca = {
  id: number;
  tipo: TipoPeca;
  preco: number;
};

const pecas: Peca[] = [
  { id: 1, tipo: 'CALCA', preco: 10.5 },
  { id: 2, tipo: 'CAMISA', preco: 30.4 },
  { id: 3, tipo: 'CALCA', preco: 20.1 },
  { id: 4, tipo: 'VESTIDO', preco: 30.4 },
  { id: 5, tipo: 'JAQUETA', preco: 40.3 },
  { id: 6, tipo: 'JALECO', preco: 40.9 },
  { id: 7, tipo: 'CAMA', preco: 40.9 },
  { id: 8, tipo: 'TAPETE', preco: 40.9 },

];

const pecasSimilares: { [key in TipoPeca]: Peca[] } = {
  CAMISA: [
    { id: 7, tipo: 'CAMISA', preco: 25.0 },
    { id: 8, tipo: 'CAMISA', preco: 28.0 },
    { id: 8, tipo: 'CAMISA', preco: 28.0 },
    { id: 8, tipo: 'CAMISA', preco: 28.0 },
    { id: 8, tipo: 'CAMISA', preco: 28.0 },
  ],
  CALCA: [
    { id: 9, tipo: 'CALCA', preco: 15.0 },
    { id: 10, tipo: 'CALCA', preco: 18.0 },
    { id: 10, tipo: 'CALCA', preco: 18.0 },
    { id: 10, tipo: 'CALCA', preco: 18.0 },
    { id: 10, tipo: 'CALCA', preco: 18.0 },
  ],
  VESTIDO: [
    { id: 11, tipo: 'VESTIDO', preco: 35.0 },
    { id: 12, tipo: 'VESTIDO', preco: 32.0 },
    { id: 12, tipo: 'VESTIDO', preco: 32.0 },
    { id: 12, tipo: 'VESTIDO', preco: 32.0 },
    { id: 12, tipo: 'VESTIDO', preco: 32.0 },
  ],
  JAQUETA: [
    { id: 13, tipo: 'JAQUETA', preco: 45.0 },
    { id: 14, tipo: 'JAQUETA', preco: 50.0 },
    { id: 14, tipo: 'JAQUETA', preco: 50.0 },
    { id: 14, tipo: 'JAQUETA', preco: 50.0 },
    { id: 14, tipo: 'JAQUETA', preco: 50.0 },
  ],
  JALECO: [
    { id: 15, tipo: 'JALECO', preco: 42.0 },
    { id: 16, tipo: 'JALECO', preco: 44.0 },
    { id: 16, tipo: 'JALECO', preco: 44.0 },
    { id: 16, tipo: 'JALECO', preco: 44.0 },
    { id: 16, tipo: 'JALECO', preco: 44.0 },
  ],
  CAMA: [
    { id: 17, tipo: 'CAMA', preco: 42.0 },
    { id: 18, tipo: 'CAMA', preco: 42.0 },
    { id: 18, tipo: 'CAMA', preco: 42.0 },
    { id: 18, tipo: 'CAMA', preco: 42.0 },
    { id: 18, tipo: 'CAMA', preco: 42.0 },

  ],
  TAPETE: [
    { id: 18, tipo: 'TAPETE', preco: 42.0 },
    { id: 20, tipo: 'TAPETE', preco: 42.0 },
    { id: 20, tipo: 'TAPETE', preco: 42.0 },
    { id: 20, tipo: 'TAPETE', preco: 42.0 },
    { id: 20, tipo: 'TAPETE', preco: 42.0 },


  ]
};

const ServicoLavagem: React.FC = () => {
  const [quantidades, setQuantidades] = useState<{ [key: string]: number }>({});
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);

  const selecionarPeca = (tipo: TipoPeca, preco: number) => {
    const novaQuantidade = (quantidades[tipo] || 0) + 1;
    setQuantidades({ ...quantidades, [tipo]: novaQuantidade });
  };

  const abrirModal = (peca: Peca) => {
    setPecaSelecionada(peca);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPecaSelecionada(null);
  };

  const total = useMemo(() => {
    return Object.entries(quantidades).reduce((acc, [tipo, quantidade]) => {
      const peca = pecas.find((peca) => peca.tipo === tipo);
      return acc + (peca ? peca.preco * quantidade : 0);
    }, 0);
  }, [quantidades]);

  return (
    <div className='Servicodelavagem'>
      <h2>Serviço de Lavagem de Roupas</h2>
      <div className='content'>
        <div className="cards-container">
          {pecas.map((peca) => (
            <div
              key={peca.id}
              className="card"
              onClick={() => abrirModal(peca)}
            >
              <h3>{peca.tipo}</h3>
              <p>Preço: R${peca.preco.toFixed(2)}</p>
              <p>Quantidade: {quantidades[peca.tipo] || 0}</p>
            </div>
          ))}
        </div>

        <div className="resumo">
          <h3>Resumo</h3>
          <ul>
            {Object.entries(quantidades).map(([tipo, quantidade]) => (
              <li key={tipo}>
                {tipo}: {quantidade} peça(s) - R${(quantidade * pecas.find((peca) => peca.tipo === tipo)!.preco).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total a pagar: R${total.toFixed(2)}</p>
        </div>
      </div>

      {modalAberto && pecaSelecionada && (
        <Modal onClose={fecharModal}>
          <h3>Peças Similares a {pecaSelecionada.tipo}</h3>
          <div className="cards-container">
            {pecasSimilares[pecaSelecionada.tipo].map((peca) => (
              <div
                key={peca.id}
                className="card"
                onClick={() => selecionarPeca(peca.tipo, peca.preco)}
              >
                <h3>{peca.tipo}</h3>
                <p>Preço: R${peca.preco.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ServicoLavagem;
