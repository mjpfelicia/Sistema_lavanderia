import React, { useState } from 'react';
import "../ButtonHover/ButtonHover.css"
const Botao = () => {
    const [ativo, setAtivo] = useState(false);

    const handleClick = () => {
        setAtivo(!ativo);
    };

    return (
        <button onClick={handleClick} className={ativo ? 'ativo' : 'estiloBase' }>
            Clique em mim
        </button>
    );
};

export default Botao;
