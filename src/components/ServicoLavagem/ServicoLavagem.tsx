import React, { useCallback, useState } from 'react';
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

const tipoPecaImage: Record<TipoPeca, string> = {
  BLAZER,
  CAMISA: camisa,
  ['CAL\u00c7A']: calcaSimples,
  VESTIDO: vestidoSimples,
  JAQUETA: jaqueta,
  JALECO: jaleco,
  CAMA: edredom,
  MESA: toalham,
};

const tipoPecaLista: TipoPeca[] = [
  'BLAZER',
  'CAMISA',
  'CAL\u00c7A',
  'VESTIDO',
  'JAQUETA',
  'JALECO',
  'CAMA',
  'MESA',
];

interface ServicoLavagemProps {
  cliente: Cliente | null;
}

const stepTitles = [
  'Escolha o tipo',
  'Selecione o subtipo',
  'Defina o servi\u00e7o',
  'Escolha as cores',
  'Informe a marca',
  'Registre os defeitos',
];

const ServicoLavagem: React.FC<ServicoLavagemProps> = ({ cliente }) => {
  const clienteVazio: Cliente = {
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    endereco: {
      endereco: '',
      numero: '',
      estado: '',
      cep: '',
      bairro: '',
      complemento: '',
    },
  };
  const clienteAtual = cliente ?? clienteVazio;
  const clienteValido = Boolean(cliente?.id && cliente.nome.trim());
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
    if (!clienteValido) {
      return;
    }

    const pecaResponse = await getPecaPorTipo(peca);
    setPecasSelecionada(pecaResponse);
    setModalAberto(true);
    setStep(0);
  }, [clienteValido]);

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
      prevSelectedColors.includes(cor) ? prevSelectedColors : [...prevSelectedColors, cor],
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
        : [...prevDefeitos, defeito],
    );
  };

  const confirmarDefeitos = () => {
    if (pecaAtual) {
      const pecaComDetalhes = { ...pecaAtual, defeitos: defeitosSelecionados, servicos: tipoServico };
      const pecaExistente = pecasAdicionadas.find(
        (p) =>
          p.subTipo === pecaAtual.subTipo &&
          JSON.stringify(p.cores) === JSON.stringify(pecaAtual.cores) &&
          p.marca === pecaAtual.marca &&
          JSON.stringify(p.defeitos) === JSON.stringify(defeitosSelecionados) &&
          JSON.stringify(p.servicos) === JSON.stringify(tipoServico),
      );

      if (pecaExistente) {
        setPecasAdicionadas((prevPecas) =>
          prevPecas.map((p) =>
            p.subTipo === pecaAtual.subTipo &&
            JSON.stringify(p.cores) === JSON.stringify(pecaAtual.cores) &&
            p.marca === pecaAtual.marca &&
            JSON.stringify(p.defeitos) === JSON.stringify(defeitosSelecionados) &&
            JSON.stringify(p.servicos) === JSON.stringify(tipoServico)
              ? { ...p, quantidade: (p.quantidade || 1) + 1 }
              : p,
          ),
        );
      } else {
        setPecasAdicionadas((prevPecas) => [...prevPecas, pecaComDetalhes]);
      }
    }

    fecharModal();
  };

  const finalizarSelecao = (newTicketNumber: string) => {
    setTicketNumber(newTicketNumber);
    setMostrarPagamento(true);
  };

  const fecharModalPagamento = () => {
    setMostrarPagamento(false);
  };

  const totalPecas = pecasAdicionadas.reduce((acc, peca) => acc + (peca.quantidade || 1), 0);
  const totalPreco = pecasAdicionadas.reduce((acc, peca) => acc + peca.preco * (peca.quantidade || 1), 0);
  const activeStepTitle = modalAberto ? stepTitles[Math.min(step + 1, stepTitles.length - 1)] : stepTitles[0];

  return (
    <div className="servico-lavagem">
      <div className="servico-layout">
        <aside className="servico-summary-panel">
          <CriarTicket
            pecas={pecasAdicionadas}
            finalizarSelecao={finalizarSelecao}
            setTicket={setTicket}
            cliente={clienteAtual}
          />
        </aside>

        <section className="servico-workspace">
          <div className="servico-workspace-header">
            <div>
              <span className="servico-eyebrow">{modalAberto ? 'Detalhamento da pe\u00e7a' : 'Cat\u00e1logo de entrada'}</span>
              <h2>{modalAberto ? activeStepTitle : 'Escolha o tipo de pe\u00e7a para come\u00e7ar'}</h2>
            </div>
            <div className="servico-metrics">
              <div className="servico-metric-pill">
                <strong>{totalPecas}</strong>
                <span>{'pe\u00e7as'}</span>
              </div>
              <div className="servico-metric-pill">
                <strong>{`R$ ${totalPreco.toFixed(2)}`}</strong>
                <span>{'total parcial'}</span>
              </div>
            </div>
          </div>

          {!clienteValido && (
            <div className="servico-empty-state">
              <span className="servico-empty-kicker">Cliente nao selecionado</span>
              <h3>Escolha um cliente para liberar a entrada de pecas</h3>
              <p>
                O ticket precisa ficar vinculado a uma ficha real. Volte para a recepcao e selecione
                um cliente antes de continuar.
              </p>
            </div>
          )}

          {clienteValido && !modalAberto && (
            <div className="servico-catalog-grid">
              {tipoPecaLista.map((peca, idx) => (
                <button key={idx} type="button" className="servico-piece-card" onClick={() => abrirModal(peca)}>
                  <div className="servico-piece-illustration">
                    <img src={tipoPecaImage[peca]} alt={peca} />
                  </div>
                  <div className="servico-piece-copy">
                    <strong>{peca}</strong>
                    <span>{'Selecionar categoria'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {modalAberto && (
            <div className="servico-step-shell">
              <div className="servico-step-topbar">
                <span>{`Etapa ${step + 2} de 6`}</span>
                <button type="button" onClick={fecharModal} className="servico-back-button">
                  {'Voltar ao cat\u00e1logo'}
                </button>
              </div>

              <Step>
                {step === 0 && pecasSelecionadas.length > 0 && (
                  <PecasSelecionadas pecas={pecasSelecionadas} adicionarPeca={adicionarPeca} />
                )}
                {step === 1 && pecaAtual && <TipoServicoPicker selecionarServico={selecionarServico} />}
                {step === 2 && tipoServico.length > 0 && (
                  <ColorPicker selecionarCor={selecionarCor} finalizarSelecaoCores={finalizarSelecaoCores} />
                )}
                {step === 3 && selectedColors.length > 0 && <BrandPicker selecionarMarca={selecionarMarca} />}
                {step === 4 && marcaSelecionada && (
                  <DefectPicker selecionarDefeito={selecionarDefeito} confirmarDefeitos={confirmarDefeitos} />
                )}
              </Step>
            </div>
          )}
        </section>

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
