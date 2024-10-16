import React, { useState, useCallback } from 'react';
import ModalS from '../modal/modalServico';
import { getPecaPorTipo, Peca, TipoPeca } from '../service/apiPeca';
import PecasSelecionadas from './PecasSelecionadas';
import Totalizador from './Totalizador';
import '../ServicoLavagem/ServicoLavagem.css';
import ModalPagamento from '../modal/ModalPagamento';
import ModalImpressao from '../modal/ModalImpressao';

// imagens
import BLAZER from '../../img/blazer.png';
import camisa from '../../img/camisa.jpg';
import calcaSimples from '../../img/calcaSimples.png';
import vestidoSimples from '../../img/vestidoSimple.jpg';
import jaqueta from '../../img/jaquetaS.png';
import edredom from '../../img/edredom.png';
import jaleco from '../../img/jaleco.png';
import toalham from '../../img/toa.png';

const tipoPecaImage = {
  "BLAZER": BLAZER,
  "CAMISA": camisa,
  "CALÇA": calcaSimples,
  "VESTIDO": vestidoSimples,
  "JAQUETA": jaqueta,
  "JALECO": jaleco,
  "CAMA": edredom,
  "MESA": toalham,
}

const tipoPecaLista: TipoPeca[] = [
  "BLAZER",
  "CAMISA",
  "CALÇA",
  "VESTIDO",
  "JAQUETA",
  "JALECO",
  "CAMA",
  "MESA",
]

const ServicoLavagem: React.FC = () => {
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [pecasSelecionadas, setPecasSelecionada] = useState<Peca[]>([]);
  const [pecasAdicionadas, setPecasAdicionadas] = useState<Peca[]>([]);
  const [mostrarPagamento, setMostrarPagamento] = useState<boolean>(false);
  const [mostrarImpressao, setMostrarImpressao] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [dataCriacao, setDataCriacao] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<string>('');
  const [dataRetirada, setDataRetirada] = useState<string>('');
  const [statusPagamento, setStatusPagamento] = useState<string>('');

  const abrirModal = useCallback(async (peca: TipoPeca) => {
    const pecaResponse = await getPecaPorTipo(peca);
    setPecasSelecionada(pecaResponse);
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setPecasSelecionada([]);
  }, []);

  const adicionarPeca = (peca: Peca) => {
    setPecasAdicionadas(prevPecas => [...prevPecas, peca]);
  };

  const finalizarSelecao = (ticketNumber: string) => {
    setTicketNumber(ticketNumber);
    const currentDate = new Date().toLocaleString();
    setDataCriacao(currentDate);
    setMostrarPagamento(true);
  };

  const fecharModalPagamento = () => {
    setMostrarPagamento(false);
  };

  const confirmarPagamento = (forma: string, data: string, status: string) => {
    setFormaPagamento(forma);
    setDataRetirada(data);
    setStatusPagamento(status);
    setMostrarPagamento(false);
    setMostrarImpressao(true);
  };

  const fecharModalImpressao = () => {
    setMostrarImpressao(false);
  };

  const totalPecas = pecasAdicionadas.length;
  const totalPreco = pecasAdicionadas.reduce((acc, peca) => acc + peca.preco, 0);

  return (
    <div className='Servicodelavagem'>
      <h2>Serviço de Lavagem de Roupas</h2>
      <div className='content'>
        <div className="cards-container">
          {tipoPecaLista.map((peca, idx) => (
            <div key={idx} className="card" onClick={() => abrirModal(peca)}>
              <img src={tipoPecaImage[peca]} alt={peca} className="card-image" />
              <h3>{peca}</h3>
            </div>
          ))}
        </div>
        {modalAberto && (
          <ModalS onClose={fecharModal}>
            <PecasSelecionadas pecas={pecasSelecionadas} adicionarPeca={adicionarPeca} />
          </ModalS>
        )}
        {!mostrarPagamento && !mostrarImpressao ? (
          <Totalizador pecas={pecasAdicionadas} finalizarSelecao={finalizarSelecao} />
        ) : mostrarPagamento ? (
          <ModalPagamento
            total={totalPreco}
            quantidade={totalPecas}
            fecharModal={fecharModalPagamento}
            ticketNumber={ticketNumber}
            confirmarPagamento={confirmarPagamento}
          />
        ) : mostrarImpressao ? (
          <ModalImpressao
            ticketNumber={ticketNumber}
            total={totalPreco}
            quantidade={totalPecas}
            formaPagamento={formaPagamento}
            dataRetirada={dataRetirada}
            statusPagamento={statusPagamento}
            pecas={pecasAdicionadas}
            dataCriacao={dataCriacao}
            fecharModal={fecharModalImpressao}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ServicoLavagem;