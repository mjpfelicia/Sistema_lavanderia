import React, { useState, useMemo } from 'react';
import './ServicoLavagem.css';
import Modal from './modalServico';
import '../ServicoLavagem/ModalServico.css'
import { TipoPecaComp } from '../TipoPeca/TipoPeca';
import Resumo from '../Resumo/Resumo';

export type TipoPeca =
  | "CAMISA"
  | "CALCA"
  | "VESTIDO"
  | "JAQUETA"
  | "JALECO"
  | "CAMA"
  | "TAPETE";

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
  | "CAMA 2"
  | "TAPETE 1"
  | "TAPETE 2";

export type Peca = {
  id: number;
  tipo: TipoPeca
  subTipo: SubTipos;
  preco: number;
};


const pecasSimilares: { [key in TipoPeca]: Peca[] } = {
  CAMISA: [
    { id: 7, tipo: "CAMISA", subTipo: 'CAMISA 2', preco: 25.0 },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA 2', preco: 28.0 },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA 2', preco: 28.0 },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA 1', preco: 28.0 },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA 1', preco: 28.0 },
  ],
  CALCA: [
    { id: 9, tipo: "CALCA", subTipo: 'CALCA 1', preco: 15.0 },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA 1', preco: 18.0 },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA 2', preco: 18.0 },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA 1', preco: 18.0 },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA 2', preco: 18.0 },
  ],
  VESTIDO: [
    { id: 11, tipo: "VESTIDO", subTipo: 'VESTIDO 1', preco: 35.0 },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO 2', preco: 32.0 },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO 2', preco: 32.0 },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO 1', preco: 32.0 },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO 1', preco: 32.0 },
  ],
  JAQUETA: [
    { id: 13, tipo: "JAQUETA", subTipo: 'JAQUETA 2', preco: 45.0 },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA 1', preco: 50.0 },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA 2', preco: 50.0 },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA 1', preco: 50.0 },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA 1', preco: 50.0 },
  ],
  JALECO: [
    { id: 15, tipo: "JALECO", subTipo: 'JALECO 1', preco: 42.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 1', preco: 44.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 1', preco: 44.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 2', preco: 44.0 },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO 2', preco: 44.0 },
  ],
  CAMA: [
    { id: 17, tipo: "CAMA", subTipo: 'CAMA 1', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 2', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 2', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 2', preco: 42.0 },
    { id: 18, tipo: "CAMA", subTipo: 'CAMA 1', preco: 42.0 },

  ],
  TAPETE: [
    { id: 18, tipo: "TAPETE", subTipo: 'TAPETE 1', preco: 42.0 },
    { id: 20, tipo: "TAPETE", subTipo: 'TAPETE 2', preco: 42.0 },
    { id: 20, tipo: "TAPETE", subTipo: 'TAPETE 2', preco: 42.0 },
    { id: 20, tipo: "TAPETE", subTipo: 'TAPETE 1', preco: 42.0 },
    { id: 20, tipo: "TAPETE", subTipo: 'TAPETE 1', preco: 42.0 },
  ]
};

const ServicoLavagem: React.FC = () => {
  const carrinho: Peca[] = [];

  const addPecas = (peca: Peca) => {
    console.log("addPeca", { peca });
    carrinho.push(peca);

    console.log("carrinho", { carrinho });
  }

  return (
    <div className='Servicodelavagem'>
      <h2>Serviço de Lavagem de Roupas</h2>
      <div className='content'>
        <div className="cards-container">
          {Object.entries(pecasSimilares).map(([nome, pecas], id) => (
            <TipoPecaComp key={id} nomeTipo={nome as TipoPeca} tipos={pecas} selecionadaPeca={addPecas} />
          ))}
        </div>

        <Resumo carrinho={carrinho} />
      </div>
    </div>
  );
};

export default ServicoLavagem;
