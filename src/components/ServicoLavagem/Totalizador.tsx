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

interface TotalizadorProps {
  pecas: Peca[];
}

const Totalizador: React.FC<TotalizadorProps> = ({ pecas }) => {
  const pecasAgrupadas = pecas.reduce((acc, peca) => {
    if (acc[peca.subTipo]) {
      acc[peca.subTipo].quantidade += 1;
      acc[peca.subTipo].total += peca.preco;
    } else {
      acc[peca.subTipo] = {
        quantidade: 1,
        total: peca.preco
      };
    }
    return acc;
  }, {} as { [key: string]: { quantidade: number; total: number } });

  const totalPecas = pecas.length;
  const totalPreco = pecas.reduce((acc, peca) => acc + peca.preco, 0);

  return (
    <div className='totalizador'>
      <h3>Ticket </h3>
      <div className="pecas-lista">
        {Object.entries(pecasAgrupadas).map(([subTipo, { quantidade, total }]) => (
          <p key={subTipo}>{subTipo} ({quantidade}) - valor R${total.toFixed(2)}</p>
        ))}
      </div>
      <div className="total-container">
        <p>Total de Peças: {totalPecas}</p>
        <p>Total a Pagar: R${totalPreco.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Totalizador;
