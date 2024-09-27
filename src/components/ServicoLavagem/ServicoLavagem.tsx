import React, { useState } from 'react';
import './ServicoLavagem.css'; 

type Peca = {
  tipo: string;
  preco: number;
};

const pecas: Peca[] = [
  { tipo: 'Camiseta', preco: 10 },
  { tipo: 'camisa', preco: 30 },
  { tipo: 'Calça', preco: 20 },
  { tipo: 'Vestido', preco: 30 },
  { tipo: 'Jaqueta', preco: 40 },
  { tipo: 'Jaleco', preco: 40 },
];

const ServicoLavagem: React.FC = () => {
  const [quantidades, setQuantidades] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState<number>(0);

  const selecionarPeca = (tipo: string, preco: number) => {
    const novaQuantidade = (quantidades[tipo] || 0) + 1;
    const novoTotal = total + preco;

    setQuantidades({ ...quantidades, [tipo]: novaQuantidade });
    setTotal(novoTotal);
  };

  return (
    <div className='Servicodelavagem'>
        <h2>Serviço de Lavagem de Roupas</h2>
      <div className='content'> 
        <div className="cards-container">
          {pecas.map((peca) => (
            <div
              key={peca.tipo}
              className="card"
              onClick={() => selecionarPeca(peca.tipo, peca.preco)}
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
    </div>
  );
};

export default ServicoLavagem;
