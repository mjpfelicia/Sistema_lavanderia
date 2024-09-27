import React, { useState } from 'react';
import './ServicoLavagem.css'; 

type Peca = {
  tipo: string;
  preco: number;
};

const pecas: Peca[] = [
  { tipo: 'Camiseta', preco: 10 },
  { tipo: 'Calça', preco: 20 },
  { tipo: 'Vestido', preco: 30 },
  { tipo: 'Jaqueta', preco: 40 },
  { tipo: 'Calça', preco: 20 },
  { tipo: 'Vestido', preco: 30 },
  { tipo: 'Jaqueta', preco: 40 },
];

const ServicoLavagem: React.FC = () => {
  const [quantidade, setQuantidade] = useState<number>(0);
  const [tipoPeca, setTipoPeca] = useState<string>(pecas[0].tipo);
  const [total, setTotal] = useState<number>(0);

  const calcularTotal = () => {
    const pecaSelecionada = pecas.find((peca) => peca.tipo === tipoPeca);
    if (pecaSelecionada) {
      setTotal(quantidade * pecaSelecionada.preco);
    }
  };

  return (
    <div>
      <h2>Serviço de Lavagem de Roupas</h2>
      <div className="cards-container">
        {pecas.map((peca) => (
          <div key={peca.tipo} className="card">
            <h3>{peca.tipo}</h3>
            <p>Preço: R${peca.preco.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div>

        <label>
          Tipo de peça:
          <select value={tipoPeca} onChange={(e) => setTipoPeca(e.target.value)}>
            {pecas.map((peca) => (
              <option key={peca.tipo} value={peca.tipo}>
                {peca.tipo}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantidade de peças:
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
        </label>
        <button onClick={calcularTotal}>Calcular Total</button>
        <p>Total: R${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ServicoLavagem;
