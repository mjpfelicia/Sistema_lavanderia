import React, { useState, useCallback } from 'react';
import ModalS from '../modal/modalServico';
import { getPecaPorTipo, Peca, TipoPeca } from '../service/apiPeca';
import PecasSelecionadas from './PecasSelecionadas';
import Totalizador from './Totalizador';
import '../ServicoLavagem/ServicoLavagem.css';
import { Ticket } from '../service/apiTicket';
import ModalPagamento from '../modal/ModalPagamento';
import { Cliente } from '../service/apiCliente';

// Imagens
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

// Propriedades do componente `ServicoLavagem`
interface ServicoLavagemProps {
  cliente: Cliente;
}

// Definição do componente funcional `ServicoLavagem`
const ServicoLavagem: React.FC<ServicoLavagemProps> = ({ cliente }) => {
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [pecasSelecionadas, setPecasSelecionada] = useState<Peca[]>([]);
  const [pecasAdicionadas, setPecasAdicionadas] = useState<Peca[]>([]);
  const [mostrarPagamento, setMostrarPagamento] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [ticket, setTicket] = useState<Ticket>({} as Ticket);

 // Função para abrir o modal e buscar peças pelo tipo
  const abrirModal = useCallback(async (peca: TipoPeca) => {
    const pecaResponse = await getPecaPorTipo(peca);
    setPecasSelecionada(pecaResponse);
    setModalAberto(true);
  }, []);
  
 // Função para fechar o modal e Resetar as peças selecionadas
  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setPecasSelecionada([]);
  }, []);

  // Função para adicionar peça à lista de peças adicionadas
  const adicionarPeca = (peca: Peca) => {
    setPecasAdicionadas(prevPecas => [...prevPecas, peca]);
  };

  // Função para finalizar a seleção de peças e gerar um número de ticket
  const finalizarSelecao = (ticketNumber: string) => {
    console.log("ticketNumber: ", { ticketNumber });
    setTicketNumber(ticketNumber);
    setMostrarPagamento(true);
  };
  // Função para fechar o modal de pagamento
  const fecharModalPagamento = () => {
    setMostrarPagamento(false);
  };
  // Calcula o total de peças e o preço total das peças adicionadas
  const totalPecas = pecasAdicionadas.length;
  const totalPreco = pecasAdicionadas.reduce((acc, peca) => acc + peca.preco, 0);

  // Renderização do componente
  return (
    <div className='ServicoLavagem'>
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
        {!mostrarPagamento ? (
          cliente && (
            <Totalizador
              pecas={pecasAdicionadas}
              finalizarSelecao={finalizarSelecao}
              setTicket={setTicket}
              cliente={cliente}
            />
          )
        ) : (
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
