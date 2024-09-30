import React, { useState, useMemo } from 'react';
import Modal from "../modal/modal";
import { Peca, TipoPeca } from "../ServicoLavagem/ServicoLavagem";

type NomeTipoPeca = {
    nomeTipo: TipoPeca,
    tipos: Peca[],
    selecionadaPeca: (peca: Peca) => void
}

export const TipoPecaComp: React.FC<NomeTipoPeca> = ({ nomeTipo, tipos, selecionadaPeca }) => {
    const [modalAberto, setModalAberto] = useState<boolean>(false);
    const [pecaSelecionada, setPecaSelecionada] = useState<Peca[] | null>(null);

    const abrirModal = (pecas: Peca[]) => {
        setPecaSelecionada(pecas);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setPecaSelecionada(null);
    };

    return (
        <div>
            <div className='content'>
                <div className="cards-container">
                    <div
                        className="card"
                        onClick={() => abrirModal(tipos)} >
                        {nomeTipo}
                    </div>
                </div>
            </div>

            {pecaSelecionada && (
                <Modal isOpen={modalAberto} onClose={() => fecharModal()}>
                    <h3>{nomeTipo}</h3>
                    {pecaSelecionada.map((peca, id) => (
                        <div
                            key={id}
                            className="card"
                            onClick={() => selecionadaPeca(peca)}>
                            <h3>{peca.tipo}</h3>
                            <p>Preço: R${peca.preco.toFixed(2)}</p>
                        </div>

                    ))}

                </Modal>
            )}

        </div>
    )
}