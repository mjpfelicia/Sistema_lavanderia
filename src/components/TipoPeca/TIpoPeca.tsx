import Modal from "../modal/modal";

export type Peca = {
    tipo: TipoPeca;
    preco: number;
};

export type NomesTipoPeca =
    | "CAMISA"
    | "CALCA"
    | "VESTIDO"
    | "JAQUETA"
    | "JALECO"
    | "CAMA"
    | "TAPETE";




type TipoPeca = {
    nomeTipo: NomesTipoPeca,
    tipos: [{
        nome: string,
        preco: number
    }]
};


export const TipoPeca: React.FC<TipoPeca[]> = (tiposPecaList) => {

    return (
        <div>
            <div className='content'>
                <div className="cards-container">
                    {tiposPecaList.map(({ nomeTipo, tipos }) => (
                        <div
                            key={nomeTipo}
                            className="card"
                            onClick={() => { }} >
                            nome
                        </div>

                        ))}
                            
                        <Modal isOpen={false} onClose={() => true}>
                            <h3>Calça</h3>
                            <p>Preço: 1</p>
                            <p>Quantidade: 1</p>
                        </Modal>
                </div>
            </div>
        </div>
    )
}