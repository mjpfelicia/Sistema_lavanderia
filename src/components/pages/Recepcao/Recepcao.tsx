import { useMemo, useState } from 'react';
import React from 'react';
import type { ComponentType, FormEvent, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackToHome from '../../buttons/BackToHome';
import {
  LuArrowRight,
  LuBell,
  LuClock3,
  LuPackage,
  LuSearch,
  LuSettings2,
  LuSparkles,
  LuTicket,
  LuUserPlus,
  LuUsers,
} from 'react-icons/lu';
import type { IconBaseProps, IconType } from 'react-icons';
import type { Cliente } from '../../../service/apiCliente';
import { buscarCliente } from '../../../service/apiCliente';
import ServicoLavagem from '../../ServicoLavagem/ServicoLavagem';
import './Recepcao.css';

const Icon = (icon: IconType, props?: IconBaseProps) =>
  React.createElement(icon as ComponentType<IconBaseProps>, props) as JSX.Element;

type Shortcut = {
  title: string;
  description: string;
  href: string;
  icon: any;
  tone: 'brand' | 'sage' | 'gold';
};

type FormData = {
  nome: string;
  telefone: string;
};

const shortcuts: Shortcut[] = [
  {
    title: 'Novo cliente',
    description: 'Abra o cadastro quando a busca nao localizar a pessoa.',
    href: '/CadastroCliente',
    icon: Icon(LuUserPlus, { size: 20 }),
    tone: 'brand',
  },
  {
    title: 'Entrada de pecas',
    description: 'Siga direto para registrar roupas e servicos.',
    href: '/EntradaDePeca',
    icon: Icon(LuPackage, { size: 20 }),
    tone: 'sage',
  },
  {
    title: 'Buscar ticket',
    description: 'Consulte atendimentos que ja foram iniciados.',
    href: '/BuscarTicket',
    icon: Icon(LuTicket, { size: 20 }),
    tone: 'gold',
  },
];

const formatPhonePreview = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const Recepcao = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ nome: '', telefone: '' });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [confirmarCadastro, setConfirmarCadastro] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const indicadores = useMemo(
    () => [
      {
        label: 'Clientes encontrados',
        value: String(clientes.length),
        icon: Icon(LuUsers, { size: 18 }),
        tone: 'brand',
      },
      {
        label: 'Busca por telefone',
        value: formData.telefone ? 'Ativa' : 'Livre',
        icon: Icon(LuPackage, { size: 18 }),
        tone: 'sage',
      },
      {
        label: 'Status do fluxo',
        value: clienteSelecionado ? 'Cliente confirmado' : 'Aguardando busca',
        icon: Icon(LuClock3, { size: 18 }),
        tone: 'gold',
      },
    ],
    [clienteSelecionado, clientes.length, formData.telefone]
  );

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: field === 'telefone' ? formatPhonePreview(value) : value,
    }));

    setValidationError('');
    setError('');
    setConfirmarCadastro(false);

    if (clientes.length) {
      setClientes([]);
    }
  };

  const handleBuscar = async (e: FormEvent) => {
    e.preventDefault();

    const nome = formData.nome.trim();
    const telefone = formData.telefone.trim();

    if (!nome && !telefone) {
      setValidationError('Informe ao menos o nome ou o telefone para continuar.');
      return;
    }

    if (nome && nome.length < 3) {
      setValidationError('Digite pelo menos 3 caracteres no nome para buscar.');
      return;
    }

    setLoading(true);
    setError('');
    setValidationError('');
    setConfirmarCadastro(false);
    setClienteSelecionado(null);

    try {
      const resultado = await buscarCliente(nome, telefone);
      setClientes(resultado);

      if (resultado.length === 1) {
        setClienteSelecionado(resultado[0]);
        return;
      }

      if (resultado.length === 0) {
        setConfirmarCadastro(true);
      }
    } catch (requestError) {
      console.error('Erro ao buscar cliente', requestError);
      setError('Nao foi possivel buscar clientes agora. Verifique se a API local esta ativa com "npm run api".');
    } finally {
      setLoading(false);
    }
  };

  if (clienteSelecionado) {
    return (
      <div className="recepcao-container">
        <main className="recepcao-main recepcao-main-servico">
          <section className="service-shell">
            <div className="service-shell-header">
              <div>
                <span className="section-kicker">Cliente confirmado</span>
                <h1>{clienteSelecionado.nome}</h1>
                <p>{clienteSelecionado.telefone || 'Telefone nao informado'}</p>
              </div>
              <button
                type="button"
                className="secondary-action"
                onClick={() => {
                  setClienteSelecionado(null);
                  setClientes([]);
                }}
              >
                Voltar para a busca
              </button>
            </div>

            <ServicoLavagem cliente={clienteSelecionado} />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="recepcao-container">
      <div className="bg-mesh">
        <div className="mesh-blob mesh-1"></div>
        <div className="mesh-blob mesh-2"></div>
        <div className="mesh-blob mesh-3"></div>
      </div>
      <div className="bg-grid-overlay"></div>

      <header className="recepcao-header">
        <div className="header-left">
          <BackToHome variant="icon" />
          <div className="logo-wrapper">
            <div className="logo-icon">
              {Icon(LuSparkles, { size: 18 })}
            </div>
            <div>
              <span className="logo-text">Sistema de Lavanderia</span>
              <span className="logo-subtitle">Recepcao</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot"></span>
            Balcao pronto
          </div>
          <button type="button" className="icon-btn" aria-label="Notificacoes">
            {Icon(LuBell, { size: 18 })}
          </button>
          <button type="button" className="icon-btn" aria-label="Configuracoes">
            {Icon(LuSettings2, { size: 18 })}
          </button>
        </div>
      </header>

      <main className="recepcao-main">
        <section className={`hero-card ${isFocused ? 'focused' : ''}`}>
          <div className="card-glow"></div>

          <div className="card-header-content">
            <div className="search-icon-wrapper">
              {Icon(LuSearch, { size: 26 })}
            </div>
            <span className="section-kicker">Atendimento no balcao</span>
            <h1 className="card-title">Buscar cliente e iniciar atendimento</h1>
            <p className="card-subtitle">
              Use a busca rapida para localizar a ficha do cliente e seguir direto para o registro das pecas.
            </p>
          </div>

          <form onSubmit={handleBuscar} className="search-form">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="nome">Nome do cliente</label>
                <div className="input-wrapper">
                  <input
                    id="nome"
                    type="text"
                    placeholder="Ex: Maria Silva"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="modern-input"
                  />
                  <div className="input-border-glow"></div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="telefone">Telefone / WhatsApp</label>
                <div className="input-wrapper">
                  <input
                    id="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="modern-input"
                  />
                  <div className="input-border-glow"></div>
                </div>
              </div>
            </div>

            {validationError && <p className="feedback-message feedback-warning">{validationError}</p>}
            {error && <p className="feedback-message feedback-error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              <span>{loading ? 'Buscando cliente...' : 'Continuar atendimento'}</span>
              {Icon(LuArrowRight, { size: 18 })}
            </button>

            <div className="search-hint">
              <span>Voce pode buscar so pelo telefone ou combinar os dois campos para filtrar melhor.</span>
            </div>
          </form>
        </section>

        <section className="actions-section">
          <div className="section-header">
            <div>
              <span className="section-kicker">Acoes rapidas</span>
              <h2>Atalhos usados no fluxo da recepcao</h2>
            </div>
          </div>

          <div className="shortcuts-grid">
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.href} to={shortcut.href} className={`shortcut-card tone-${shortcut.tone}`}>
                <div className="shortcut-content">
                  <div className="shortcut-icon-bg">{shortcut.icon}</div>
                  <div className="shortcut-text">
                    <span className="shortcut-title">{shortcut.title}</span>
                    <span className="shortcut-desc">{shortcut.description}</span>
                  </div>
                </div>
                <span className="shortcut-link">
                  Abrir
                  {Icon(LuArrowRight, { size: 16 })}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {clientes.length > 1 && (
          <section className="result-card">
            <div className="result-header">
              <div>
                <span className="section-kicker">Resultado da busca</span>
                <h2>Escolha o cliente correto</h2>
              </div>
              <span className="result-count">{clientes.length} encontrados</span>
            </div>

            <div className="result-list">
              {clientes.map((cliente) => (
                <button
                  key={cliente.id}
                  type="button"
                  className="result-item"
                  onClick={() => setClienteSelecionado(cliente)}
                >
                  <div>
                    <strong>{cliente.nome}</strong>
                    <span>{cliente.telefone || 'Telefone nao informado'}</span>
                  </div>
                  {Icon(LuArrowRight, { size: 18 })}
                </button>
              ))}
            </div>
          </section>
        )}

        {confirmarCadastro && (
          <section className="empty-state-card">
            <div>
              <span className="section-kicker">Cliente nao encontrado</span>
              <h2>Deseja cadastrar uma nova ficha?</h2>
              <p>
                Nenhum cliente foi encontrado com os dados informados. Voce pode seguir para o cadastro e voltar para a recepcao depois.
              </p>
            </div>

            <div className="empty-state-actions">
              <button type="button" className="btn-primary" onClick={() => navigate('/CadastroCliente')}>
                Cadastrar cliente
              </button>
              <button type="button" className="secondary-action" onClick={() => setConfirmarCadastro(false)}>
                Revisar busca
              </button>
            </div>
          </section>
        )}

        <section className="stats-widget">
          {indicadores.map((item) => (
            <div key={item.label} className="stat-item">
              <div className={`stat-icon tone-${item.tone}`}>{item.icon}</div>
              <div className="stat-data">
                <span className="stat-value">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Recepcao;
