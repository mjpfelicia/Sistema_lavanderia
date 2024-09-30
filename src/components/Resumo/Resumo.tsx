import React, { useMemo } from 'react';
import { Peca } from '../ServicoLavagem/ServicoLavagem';

type ResumoProp = {
    carrinho: Peca[]
}

const Resumo: React.FC<ResumoProp> = ({ carrinho }) => {
    const valorTotal = useMemo(() => {
        console.log("carrinho",carrinho)
        return carrinho.reduce((total, item) => total + item.preco, 0);
    }, [carrinho]);

    const itensResumo = useMemo(() => {
        console.log("carrinho2",carrinho)
        return carrinho.map((item, idx) => (
            <li key={item.id}>
                {item.tipo}: {idx + 1} peça(s) - R${item.preco.toFixed(2)}
            </li>
        ));
    }, [carrinho]);

    return (
        <div className="resumo">
            <h3>Resumo 1</h3>
            <ul>
                {itensResumo}
            </ul>
            <p>Total a pagar: R${valorTotal.toFixed(2)}</p>
        </div>
    );
};

export default Resumo;
