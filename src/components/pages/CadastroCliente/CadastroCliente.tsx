import React, { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  LuBadgeCheck,
  LuChevronLeft,
  LuHouse,
  LuMail,
  LuMapPin,
  LuPhone,
  LuShieldCheck,
  LuUser,
} from 'react-icons/lu';
import { Link } from 'react-router-dom';
import BackToHome from '../../buttons/BackToHome';
import { ClienteToCreate, criarCliente } from '../../../service/apiCliente';
import './CadastroCliente.css';

type ClienteFormCadastro = {
  bairro: string;
  cep: string;
  complemento: string;
  email: string;
  endereco: string;
  estado: string;
  nome: string;
  numero: string;
  telefone: string;
};

type FormField = {
  name: keyof ClienteFormCadastro;
  label: string;
  placeholder: string;
  type?: 'text' | 'email';
  required?: boolean;
};

const renderIcon = (IconComponent: any, size = 18) =>
  React.createElement(IconComponent, { size }) as JSX.Element;

const initialFormData: ClienteFormCadastro = {
  bairro: '',
  cep: '',
  complemento: '',
  email: '',
  endereco: '',
  estado: '',
  nome: '',
  numero: '',
  telefone: '',
};

const contactFields: FormField[] = [
  { name: 'nome', label: 'Nome completo', placeholder: 'Ex.: Maria de Souza' },
  { name: 'telefone', label: 'Telefone', placeholder: '(11) 99999-9999' },
  { name: 'email', label: 'E-mail', placeholder: 'cliente@email.com', type: 'email' },
];

const addressFields: FormField[] = [
  { name: 'endereco', label: 'Endereco', placeholder: 'Rua, avenida ou travessa' },
  { name: 'numero', label: 'Numero', placeholder: '123' },
  { name: 'complemento', label: 'Complemento', placeholder: 'Apartamento, bloco ou referencia', required: false },
  { name: 'bairro', label: 'Bairro', placeholder: 'Centro, Jardim, Vila...' },
  { name: 'estado', label: 'Estado', placeholder: 'SP' },
  { name: 'cep', label: 'CEP', placeholder: '00000-000' },
];

const formatPhone = (value: string) => {
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

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const CadastroCliente = () => {
  const [formData, setFormData] = useState<ClienteFormCadastro>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ClienteFormCadastro, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const completion = useMemo(() => {
    const values = Object.values(formData);
    const filled = values.filter((value) => value.trim()).length;
    return Math.round((filled / values.length) * 100);
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof ClienteFormCadastro;

    let nextValue = value;
    if (field === 'telefone') {
      nextValue = formatPhone(value);
    }

    if (field === 'cep') {
      nextValue = formatCep(value);
    }

    if (field === 'estado') {
      nextValue = value.toUpperCase().slice(0, 2);
    }

    setFormData((current) => ({
      ...current,
      [field]: nextValue,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  const validateFields = () => {
    const nextErrors: Partial<Record<keyof ClienteFormCadastro, string>> = {};

    contactFields.forEach(({ name }) => {
      if (!formData[name].trim()) {
        nextErrors[name] = 'Preencha este campo para continuar.';
      }
    });

    addressFields.forEach(({ name, required = true }) => {
      if (required && !formData[name].trim()) {
        nextErrors[name] = 'Preencha este campo para continuar.';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Informe um e-mail valido.';
    }

    if (formData.telefone.replace(/\D/g, '').length < 10) {
      nextErrors.telefone = 'Informe um telefone valido com DDD.';
    }

    if (formData.cep.replace(/\D/g, '').length !== 8) {
      nextErrors.cep = 'Informe um CEP valido.';
    }

    if (formData.estado.trim().length !== 2) {
      nextErrors.estado = 'Use a sigla do estado com 2 letras.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFields()) {
      setSubmitStatus('error');
      setSubmitMessage('Revise os campos destacados antes de cadastrar.');
      return;
    }

    const clienteToCreate: ClienteToCreate = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      endereco: {
        endereco: formData.endereco.trim(),
        numero: formData.numero.trim(),
        estado: formData.estado.trim(),
        cep: formData.cep.trim(),
        bairro: formData.bairro.trim(),
        complemento: formData.complemento.trim(),
      },
    };

    try {
      setIsSubmitting(true);
      await criarCliente(clienteToCreate);
      setSubmitStatus('success');
      setSubmitMessage('Cliente cadastrado com sucesso. O formulario foi preparado para um novo registro.');
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error('Erro ao criar cliente', error);
      setSubmitStatus('error');
      setSubmitMessage('Nao foi possivel concluir o cadastro agora. Verifique se a API local esta ativa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-bg">
        <div className="cadastro-orb orb-primary"></div>
        <div className="cadastro-orb orb-secondary"></div>
        <div className="cadastro-grid"></div>
      </div>

      <main className="cadastro-shell">
        <section className="cadastro-hero">
          <div className="cadastro-hero-topbar">
            <BackToHome variant="full" />
            <div className="cadastro-chip">
              {renderIcon(LuShieldCheck, 16)}
              <span>Cadastro validado</span>
            </div>
          </div>

          <div className="cadastro-hero-copy">
            <span className="cadastro-kicker">Base de clientes</span>
            <h1>Cadastre clientes com uma tela mais clara, atual e pronta para operacao diaria.</h1>
            <p>
              Centralize os dados essenciais de contato e endereco em um fluxo mais direto, com validacoes
              simples, feedback visual e preenchimento guiado.
            </p>
          </div>

          <div className="cadastro-highlight-grid">
            <article className="cadastro-highlight-card">
              {renderIcon(LuUser, 20)}
              <strong>Dados essenciais</strong>
              <span>Nome, telefone e e-mail organizados em primeiro plano.</span>
            </article>
            <article className="cadastro-highlight-card">
              {renderIcon(LuMapPin, 20)}
              <strong>Endereco completo</strong>
              <span>Campos agrupados para acelerar retirada, entrega e consulta.</span>
            </article>
            <article className="cadastro-highlight-card">
              {renderIcon(LuBadgeCheck, 20)}
              <strong>Feedback imediato</strong>
              <span>Validacao visivel e mensagem clara ao concluir o cadastro.</span>
            </article>
          </div>
        </section>

        <section className="cadastro-form-card">
          <div className="cadastro-form-header">
            <div>
              <span className="cadastro-kicker">Novo cliente</span>
              <h2>Ficha cadastral</h2>
            </div>

            <div className="cadastro-progress-card" aria-label="Progresso do formulario">
              <span>Preenchimento</span>
              <strong>{completion}%</strong>
            </div>
          </div>

          {submitMessage ? (
            <div className={submitStatus === 'success' ? 'cadastro-feedback success' : 'cadastro-feedback error'}>
              {submitMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="cadastro-section">
              <div className="cadastro-section-heading">
                {renderIcon(LuPhone, 18)}
                <div>
                  <span className="cadastro-section-kicker">Contato</span>
                  <h3>Quem e o cliente</h3>
                </div>
              </div>

              <div className="cadastro-grid-fields cadastro-grid-fields-contact">
                {contactFields.map((field) => (
                  <label key={field.name} className="cadastro-field">
                    <span>{field.label}</span>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={errors[field.name] ? 'has-error' : ''}
                    />
                    {errors[field.name] ? <small>{errors[field.name]}</small> : null}
                  </label>
                ))}
              </div>
            </div>

            <div className="cadastro-section">
              <div className="cadastro-section-heading">
                {renderIcon(LuHouse, 18)}
                <div>
                  <span className="cadastro-section-kicker">Logistica</span>
                  <h3>Onde atender esse cliente</h3>
                </div>
              </div>

              <div className="cadastro-grid-fields cadastro-grid-fields-address">
                {addressFields.map((field) => (
                  <label
                    key={field.name}
                    className={`cadastro-field field-${field.name}`}
                  >
                    <span>{field.label}</span>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={errors[field.name] ? 'has-error' : ''}
                    />
                    {errors[field.name] ? <small>{errors[field.name]}</small> : null}
                  </label>
                ))}
              </div>
            </div>

            <div className="cadastro-actions">
              <Link to="/Recepcao" className="cadastro-secondary-action">
                Cancelar
              </Link>
              <button type="submit" className="cadastro-primary-action" disabled={isSubmitting}>
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar cliente'}
              </button>
            </div>
          </form>

          <div className="cadastro-footnote">
            {renderIcon(LuMail, 16)}
            <span>Esses dados alimentam busca, recepcao, deliveries e historico de atendimento.</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CadastroCliente;
