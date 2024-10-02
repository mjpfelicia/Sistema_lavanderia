import React, { useState, useMemo, useCallback } from 'react';
import './ServicoLavagem.css';
import ModalS from '../ServicoLavagem/modalServico';
import '../ServicoLavagem/ServicoLavagem.css'
import Cliente from '../pages/DetalhesCliente/Cliente';
import peca from '../../img/peca.png';
import vestidoSimples from '../../img/vestidoSimple.jpg';
import vestidoEspecial from '../../img/vestidoEspecial,.jpg';
import vestidoRenda from '../../img/vestidoRenda.jpg';
import calcaEspecial from '../../img/calcaEspecial.jpg';
import calcaSimples from '../../img/calcaSimples.png';
import { Modal } from 'react-bootstrap';



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
  imagem: string;
};
export type SubTipos =
  | "CAMISA 1"
  | "CAMISA ESPECIAL"
  | "CAMISA SOCIAL"
  | "CALCA 1"
  | "CALCA ESPECIAL"
  | "CALCA SOCIAL"
  | "VESTIDO 1"
  | "VESTIDO ESPECIAL"
  | "VESTIDO DE RENDA"
  | "JAQUETA 1"
  | "JAQUETA ESPECIAL"
  | "JAQUETA FORRADA"
  | "JALECO 1"
  | "JALECO ESPECIAL"
  | "JALECO AVENTAL"
  | "CAMA 1"
  | "LENÇOL"
  | "EDREDOM";

// Dados das peças similares
const pecasSimilares: { [key in TipoPeca]: Peca[] } = {
  CAMISA: [
    { id: 7, tipo: "CAMISA", subTipo: 'CAMISA 1', preco: 25.0, imagem: peca },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA ESPECIAL', preco: 29.0, imagem: peca },
    { id: 8, tipo: "CAMISA", subTipo: 'CAMISA SOCIAL', preco: 29.0, imagem: peca },
  ],
  CALCA: [
    { id: 9, tipo: "CALCA", subTipo: 'CALCA 1', preco: 15.0, imagem: calcaSimples },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA ESPECIAL', preco: 18.0, imagem: calcaEspecial },
    { id: 10, tipo: "CALCA", subTipo: 'CALCA SOCIAL', preco: 19.0, imagem: calcaEspecial },
  ],
  VESTIDO: [
    { id: 11, tipo: "VESTIDO", subTipo: 'VESTIDO 1', preco: 35.0, imagem: vestidoSimples },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO ESPECIAL', preco: 32.0, imagem: vestidoEspecial },
    { id: 12, tipo: "VESTIDO", subTipo: 'VESTIDO DE RENDA', preco: 32.0, imagem: vestidoRenda },
  ],
  JAQUETA: [
    { id: 13, tipo: "JAQUETA", subTipo: 'JAQUETA ESPECIAL', preco: 45.0, imagem: peca },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA 1', preco: 55.0, imagem: peca },
    { id: 14, tipo: "JAQUETA", subTipo: 'JAQUETA FORRADA', preco: 50.0, imagem: peca },
  ],
  CAMA: [
    { id: 17, tipo: "CAMA", subTipo: 'CAMA 1', preco: 42.0, imagem: peca },
    { id: 18, tipo: "CAMA", subTipo: 'LENÇOL', preco: 42.0, imagem: peca },
    { id: 18, tipo: "CAMA", subTipo: 'EDREDOM', preco: 40.0, imagem: peca },
  ],
  JALECO: [
    { id: 15, tipo: "JALECO", subTipo: 'JALECO 1', preco: 42.0, imagem: peca },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO ESPECIAL', preco: 48.0, imagem: peca },
    { id: 16, tipo: "JALECO", subTipo: 'JALECO AVENTAL', preco: 44.0, imagem: peca },
  ]
};

const ServicoLavagem: React.FC = () => {
  const [quantidades, setQuantidades] = useState<{ [key in SubTipos]?: number }>({});
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  const [carrinho, setCarrinho] = useState<Peca[]>([]);
  const [contadorPeca, setContadorPeca] = useState<number>(1);
  const [contadorCliente, setContadorCliente] = useState<number>(1);
  const [contadorResumo, setContadorResumo] = useState<number>(1);
  const [pagamento, setPagamento] = useState<string>('');
  const [dataEntrega, setDataEntrega] = useState<string>('');
  const [etapa, setEtapa] = useState<'resumo' | 'pagamento' | 'impressao'>('resumo');

  const selecionarPeca = useCallback((peca: Peca) => {
    const novaQuantidade = (quantidades[peca.subTipo] || 0) + 1;
    setQuantidades(prev => ({ ...prev, [peca.subTipo]: novaQuantidade }));
    adicionarItem(peca);
  }, [quantidades]);

  const adicionarItem = useCallback((peca: Peca) => {
    const pecaComId = { ...peca, id: contadorPeca };
    setCarrinho(prevItems => [...prevItems, pecaComId]);
    setContadorPeca(prev => prev + 1);
  }, [contadorPeca]);

  const abrirModal = useCallback((peca: Peca) => {
    setPecaSelecionada(peca);
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setPecaSelecionada(null);
  }, []);

  const total = useMemo(() => {
    return carrinho.reduce((acc, peca) => acc + peca.preco, 0);
  }, [carrinho]);

  const resumo = useMemo(() => {
    const resumoMap: { [key: string]: { quantidade: number; precoTotal: number } } = {};

    carrinho.forEach((peca) => {
      if (resumoMap[peca.subTipo]) {
        resumoMap[peca.subTipo].quantidade += 1;
        resumoMap[peca.subTipo].precoTotal += peca.preco;
      } else {
        resumoMap[peca.subTipo] = { quantidade: 1, precoTotal: peca.preco };
      }
    });

    return resumoMap;
  }, [carrinho]);

  const gerarIdCliente = useCallback(() => {
    const idCliente = contadorCliente;
    setContadorCliente(prev => prev + 1);
    return idCliente;
  }, [contadorCliente]);

  const finalizarResumo = useCallback(() => {
    setEtapa('pagamento');
  }, []);

  const confirmarPagamento = useCallback(() => {
    setEtapa('impressao');
  }, []);

  const imprimirTicket = useCallback(() => {
    const idResumo = contadorResumo;
    setContadorResumo(prev => prev + 1);
    const ticket = `
      Resumo ID: ${idResumo}
      Cliente ID: ${gerarIdCliente()}
      Total a pagar: R$${total.toFixed(2)}
      Forma de Pagamento: ${pagamento}
      Data de Entrega: ${dataEntrega}
    `;
    console.log(ticket);
    
  }, [gerarIdCliente, total, pagamento, dataEntrega, contadorResumo]);

  return (
    <div className='Servicodelavagem'>
      <h2>Serviço de Lavagem de Roupas</h2>
      <div className='content'>
        {etapa === 'resumo' && (
          <>
            <div className="cards-container">
              {Object.entries(pecasSimilares).map(([nome, pecas], idx) => (
                <div key={idx} className="card" onClick={() => abrirModal(pecas[0])}>
                  <img src={pecas[0].imagem} alt={pecas[0].subTipo} className="card-image" />
                  <h3>{nome}</h3>
                </div>
              ))}
            </div>

            <div className="resumo">
              <h3>Resumo</h3>
              <ul>
                {Object.entries(resumo).map(([subTipo, { quantidade, precoTotal }]) => (
                  <li key={subTipo}>
                    {subTipo}: {quantidade} peça(s) - R${precoTotal.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p>Total a pagar: R${total.toFixed(2)}</p>
              <button onClick={finalizarResumo}>Finalizar</button>
            </div>
          </>
        )}

        {etapa === 'pagamento' && (
          <div>
            <h3>Forma de Pagamento e Data de Entrega</h3>
            <label>
              Forma de Pagamento:
              <select value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
                <option value="">Selecione</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
              </select>
            </label>
            <label>
              Data de Entrega:
              <input
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
              />
            </label>
            <button onClick={confirmarPagamento}>Confirmar Pagamento</button>
          </div>
        )}

        {etapa === 'impressao' && (
          <div>
            <h3>Impressão do Ticket</h3>
            <div>
              <p>Resumo ID: {contadorResumo}</p>
              <p>Cliente ID: {contadorCliente}</p>
              <p>Total a pagar: R${total.toFixed(2)}</p>
              <p>Forma de Pagamento: {pagamento}</p>
              <p>Data de Entrega: {dataEntrega}</p>
            </div>
            <button onClick={imprimirTicket}>Imprimir Ticket</button>
          </div>
        )}
      </div>

      {pecaSelecionada && (
        <ModalS onClose={fecharModal}>
          <h3>Peças Similares</h3>
          <div className="cards-container">
            {pecasSimilares[pecaSelecionada.tipo].map((peca) => (
              <div key={peca.id} className="card" onClick={() => selecionarPeca(peca)}>
                <img src={peca.imagem} alt={peca.subTipo} className="card-image" />
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
