import React, { useState, useCallback } from 'react';
import Step from './Step';
import { getPecaPorTipo, Peca, TipoPeca } from '../../service/apiPeca';
import PecasSelecionadas from './PecasSelecionadas';
import CriarTicket from '../ServicoLavagem/CriarTicket';
import '../ServicoLavagem/ServicoLavagem.css';
import ModalPagamento from '../modal/ModalPagamento';
import ColorPicker from '../Color/ColorPicker';
import BrandPicker from '../Marcas/BrandPicker';
import DefectPicker from '../Defeitos/DefectPicker';
import TipoServicoPicker from '../TipoServico/TipoServicoPicker';

// Imagens
import BLAZER from '../../img/blazer.png';
import camisa from '../../img/camisa.jpg';
import calcaSimples from '../../img/calcaSimples.png';
import vestidoSimples from '../../img/vestidoSimple.jpg';
import jaqueta from '../../img/jaquetaS.png';
import edredom from '../../img/edredom.png';
import jaleco from '../../img/jaleco.png';
import toalham from '../../img/toa.png';
import { Ticket } from '../../service/apiTicket';
import { Cliente } from '../../service/apiCliente';


const tipoPecaImage = {
  "BLAZER": BLAZER,
  "CAMISA": camisa,
  "CALÇA": calcaSimples,
  "VESTIDO": vestidoSimples,
  "JAQUETA": jaqueta,
  "JALECO": jaleco,
  "CAMA": edredom,
  "MESA": toalham,
};

const tipoPecaLista: TipoPeca[] = [
  "BLAZER",
  "CAMISA",
  "CALÇA",
  "VESTIDO",
  "JAQUETA",
  "JALECO",
  "CAMA",
  "MESA",
];

interface ServicoLavagemProps {
  cliente: Cliente;
}

const ServicoLavagem: React.FC<ServicoLavagemProps> = ({ cliente }) => {
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [pecasSelecionadas, setPecasSelecionada] = useState<Peca[]>([]);
  const [pecasAdicionadas, setPecasAdicionadas] = useState<Peca[]>([]);
  const [mostrarPagamento, setMostrarPagamento] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [ticket, setTicket] = useState<Ticket>({} as Ticket);
  const [step, setStep] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState<string>('');
  const [defeitosSelecionados, setDefeitosSelecionados] = useState<string[]>([]);
  const [pecaAtual, setPecaAtual] = useState<Peca | null>(null);
  const [tipoServico, setTipoServico] = useState<string[]>([]);

  const abrirModal = useCallback(async (peca: TipoPeca) => {
    const pecaResponse = await getPecaPorTipo(peca);
    setPecasSelecionada(pecaResponse);
    setModalAberto(true);
    setStep(0);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setPecasSelecionada([]);
    setSelectedColors([]);
    setMarcaSelecionada('');
    setDefeitosSelecionados([]);
    setPecaAtual(null);
    setTipoServico([]);
  }, []);

  const adicionarPeca = (peca: Peca) => {
    setPecaAtual(peca);
    setStep(1);
  };

  const selecionarServico = (servicos: string[]) => {
    setTipoServico(servicos);
    setStep(2);
  };

  const selecionarCor = (cor: string) => {
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.includes(cor)
        ? prevSelectedColors
        : [...prevSelectedColors, cor]
    );
  };

  const finalizarSelecaoCores = () => {
    if (selectedColors.length > 0) {
      if (pecaAtual) {
        setPecaAtual({ ...pecaAtual, cores: selectedColors });
      }
      setStep(3);
    }
  };

  const selecionarMarca = (marca: string) => {
    if (pecaAtual) {
      setPecaAtual({ ...pecaAtual, marca });
    }
    setMarcaSelecionada(marca);
    setStep(4);
  };

  const selecionarDefeito = (defeito: string) => {
    setDefeitosSelecionados((prevDefeitos) =>
      prevDefeitos.includes(defeito)
        ? prevDefeitos.filter((d) => d !== defeito)
        : [...prevDefeitos, defeito]
    );
  };

  const confirmarDefeitos = () => {
    if (pecaAtual) {
      const pecaComDetalhes = { ...pecaAtual, defeitos: defeitosSelecionados, servicos: tipoServico };
      const pecaExistente = pecasAdicionadas.find(
        p => p.subTipo === pecaAtual.subTipo && JSON.stringify(p.cores) === JSON.stringify(pecaAtual.cores) && p.marca === pecaAtual.marca && JSON.stringify(p.defeitos) === JSON.stringify(defeitosSelecionados) && JSON.stringify(p.servicos) === JSON.stringify(tipoServico)
      );
      if (pecaExistente) {
        setPecasAdicionadas(prevPecas =>
          prevPecas.map(p =>
            p.subTipo === pecaAtual.subTipo && JSON.stringify(p.cores) === JSON.stringify(pecaAtual.cores) && p.marca === pecaAtual.marca && JSON.stringify(p.defeitos) === JSON.stringify(defeitosSelecionados) && JSON.stringify(p.servicos) === JSON.stringify(tipoServico)
              ? { ...p, quantidade: (p.quantidade || 1) + 1 }
              : p
          )
        );
      } else {
        setPecasAdicionadas(prevPecas => [...prevPecas, pecaComDetalhes]);
      }
    }
    fecharModal();
  };

  const finalizarSelecao = (ticketNumber: string) => {
    setTicketNumber(ticketNumber);
    setMostrarPagamento(true);
  };

  const fecharModalPagamento = () => {
    setMostrarPagamento(false);
  };

  const totalPecas = pecasAdicionadas.reduce((acc, peca) => acc + (peca.quantidade || 1), 0);
  const totalPreco = pecasAdicionadas.reduce((acc, peca) => acc + peca.preco * (peca.quantidade || 1), 0);

  return (
    <div className="ServicoLavagem">
      <div className="content-wrapper">
        <div className="totalizador-container">
          <CriarTicket
            pecas={pecasAdicionadas}
            finalizarSelecao={finalizarSelecao}
            setTicket={setTicket}
            cliente={cliente}
          />
        </div>
        {!modalAberto && (
          <div className="cards-container">
            {tipoPecaLista.map((peca, idx) => (
              <div key={idx} className="card" onClick={() => abrirModal(peca)}>
                <img src={tipoPecaImage[peca]} alt={peca} />
                <h3>{peca}</h3>
              </div>
            ))}
          </div>
        )}

        {modalAberto && (
          <Step>
            {step === 0 && pecasSelecionadas.length > 0 && (
              <PecasSelecionadas pecas={pecasSelecionadas} adicionarPeca={adicionarPeca} />
            )}
            {step === 1 && pecaAtual && (
              <TipoServicoPicker selecionarServico={selecionarServico} />
            )}
            {step === 2 && tipoServico.length > 0 && (
              <>
                {step === 2 && tipoServico.length > 0 && (
                  <ColorPicker selecionarCor={selecionarCor} finalizarSelecaoCores={finalizarSelecaoCores} />
                )}

              </>
            )}
            {step === 3 && selectedColors.length > 0 && (
              <BrandPicker selecionarMarca={selecionarMarca} />
            )}
            {step === 4 && marcaSelecionada && (
              <DefectPicker selecionarDefeito={selecionarDefeito} confirmarDefeitos={confirmarDefeitos} />
            )}
          </Step>
        )}
        {mostrarPagamento && (
          <ModalPagamento
            ticket={ticket}
            total={totalPreco}
            quantidade={totalPecas}
            fecharModal={fecharModalPagamento}
            ticketNumber={ticketNumber}
          />
        )}
      </div>
    </div>
  );
};

export default ServicoLavagem;
