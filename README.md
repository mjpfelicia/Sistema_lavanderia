# Sistema Lavanderia 🧺

![Descrição da Imagem](/public/assets/img/telaApp.png)

Sistema de gestão para lavanderias desenvolvido com React e TypeScript. Este projeto foi inicializado com [Create React App](https://github.com/facebook/create-react-app).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Usadas](#tecnologias-usadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Configuração do Supabase](#configuração-do-supabase)
- [API Mock (JSON Server)](#api-mock-json-server)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autor](#autor)

## 🚀 Sobre o Projeto

Sistema completo para gestão de lavanderias, incluindo:
- Cadastro de clientes
- Gerenciamento de peças e serviços
- Controle de tickets
- Delivery e retiradas
- Integração com mapas
- Notificações via WhatsApp

## 💻 Tecnologias Usadas

- **Frontend:**
  - React 18.2.0
  - TypeScript 4.9.5
  - React Router DOM v6
  - Bootstrap 5.3.3
  - React Bootstrap
  - Formik & Yup (validação de formulários)
  - React Hook Form
  - Axios

- **Backend/Database:**
  - Supabase (PostgreSQL)
  - JSON Server (API mock)

- **Bibliotecas Adicionais:**
  - @react-google-maps/api
  - react-floating-whatsapp
  - Swiper (carrossel)
  - FontAwesome Icons
  - React Icons

## 📦 Pré-requisitos

- Node.js (versão recomendada: 18.x ou superior)
- npm ou yarn
- Conta no Supabase (opcional, para usar o banco de dados real)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/mjpfelicia/Sistema_lavanderia.git
cd Sistema_lavanderia
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (se for usar Supabase):
```bash
# Crie um arquivo .env na raiz do projeto
REACT_APP_SUPABASE_URL=sua_url_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anon
```

## 🎯 Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Executa o aplicativo no modo de desenvolvimento.
Abra [http://localhost:3000](http://localhost:3000) para visualizá-lo no seu navegador.

A página será recarregada se você fizer edições.
Você também verá quaisquer erros de lint no console.

### `npm run api`

Inicia o JSON Server na porta 3008 para simular uma API REST.
Útil para desenvolvimento sem necessidade de backend real.

```bash
npm run api
```

### `npm run build`

Compila o aplicativo para produção na pasta `build`.
Ele agrupa corretamente o React em modo de produção e otimiza a build.

```bash
npm run build
```

### `npm test`

Executa os testes no modo de observação interativa.

```bash
npm test
```

## 🗄️ Configuração do Supabase

Para configurar o banco de dados Supabase:

1. Acesse o dashboard do Supabase: https://supabase.com/dashboard
2. Crie um novo projeto ou use um existente
3. Vá até o SQL Editor
4. Execute o script de migração localizado em `/docs/SUPABASE_MIGRATIONS.sql`
5. Atualize as variáveis de ambiente no arquivo `.env`

Para mais detalhes, consulte: [Como Executar a Migração](/docs/COMO_EXECUTAR_MIGRACAO.md)

### Tabelas do Banco de Dados

- **cliente**: Dados dos clientes
- **peca**: Catálogo de peças/serviços
- **ticket**: Tickets de lavanderia
- **delivery**: Registros de entrega/retirada

## 🌐 API Mock (JSON Server)

Para desenvolvimento local, o projeto inclui um JSON Server que simula uma API REST:

```bash
# Iniciar o servidor de API mock
npm run api
```

A API estará disponível em: http://localhost:3008

Os dados são armazenados no arquivo `db.json`.

## 📁 Estrutura do Projeto

```
Sistema_lavanderia/
├── public/                 # Arquivos públicos
├── src/
│   ├── components/        # Componentes React
│   ├── config/           # Configurações (Supabase, etc.)
│   ├── service/          # Serviços e chamadas de API
│   ├── img/              # Imagens e assets
│   ├── App.tsx           # Componente principal
│   └── index.tsx         # Ponto de entrada
├── docs/                  # Documentação
├── db.json               # Dados mock para JSON Server
└── package.json          # Dependências e scripts
```

## 📚 Documentação Adicional

- [Como Executar a Migração no Supabase](/docs/COMO_EXECUTAR_MIGRACAO.md)
- [Plano de Implementação Supabase](/docs/SUPABASE_IMPLEMENTATION_PLAN.md)
- [Script de Migração SQL](/docs/SUPABASE_MIGRATIONS.sql)

## 📖 O Que Eu Aprendi

- Aprimoramento das habilidades em CSS
- Prática de design responsivo e UI/UX
- Desenvolvimento com React e TypeScript
- Integração com APIs REST
- Configuração e uso do Supabase (PostgreSQL)
- Gerenciamento de estado com Formik e React Hook Form
- Rotas com React Router DOM v6

## 👤 Autor

- **@mjpfelicia**

## 📄 Licença

ISC

## 🔗 Links Úteis

- [Documentação do React](https://react.dev/learn)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)
- [Documentação do Supabase](https://supabase.com/docs)
- [Create React App](https://create-react-app.dev/docs/getting-started/)
- [React Router](https://reactrouter.com/docs/en/v6)
- [Bootstrap React](https://react-bootstrap.github.io/)
