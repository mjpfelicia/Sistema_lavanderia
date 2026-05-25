# Plano de Implementação: Migração para Supabase

## 📋 Resumo Executivo

Migração completa do Sistema de Lavanderia de JSON Server (mock backend) para **Supabase** com:
- ✅ Autenticação com Email/Senha
- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ 4 tabelas principais (Cliente, Peca, Ticket, Delivery)
- ✅ TypeScript com tipos completos
- ✅ Proteção de rotas com AuthContext
- ✅ Páginas de Login e Signup
- ✅ Documentação SQL com migrations completas

**Data**: 25 de maio de 2026  
**Status**: ✅ Plano completo - Pronto para implementação  
**Timeline estimado**: ~2.5 horas

---

## 📊 Contexto do Projeto

### Sistema Atual
- **Nome**: Sistema de Lavanderia
- **Stack**: React 18.2 + TypeScript + React Router v6
- **Backend Atual**: JSON Server (mock) na porta 3008
- **Banco de Dados**: db.json (arquivo JSON)

### Problemas a Resolver
- ❌ Sem persistência real em banco de dados
- ❌ Sem autenticação de usuários
- ❌ Sem isolamento de dados entre usuários
- ❌ Sem controle de acesso
- ❌ Sem escala para produção

---

## 🗄️ Estrutura de Dados

### Tabela: Cliente (Customers)
```sql
CREATE TABLE cliente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  estado TEXT,
  cep TEXT,
  bairro TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cliente_user_id ON cliente(user_id);
CREATE INDEX idx_cliente_email ON cliente(email);
```

**Campos**:
- `id`: UUID gerado automaticamente
- `user_id`: FK para auth.users (isolamento por usuário)
- `nome`: Nome completo
- `email`: Email único
- `telefone`: Telefone de contato
- Campos de endereço: `endereco`, `numero`, `complemento`, `estado`, `cep`, `bairro`
- Timestamps: `created_at`, `updated_at`

**RLS Policy**: Usuários veem APENAS seus próprios clientes

---

### Tabela: Peca (Garment/Service Catalog)
```sql
CREATE TABLE peca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('BLAZER', 'CAMISA', 'CALÇA', 'VESTIDO', 'JAQUETA', 'JALECO', 'CAMA', 'MESA')),
  subTipo TEXT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  imagemUrl TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_peca_tipo ON peca(tipo);
```

**Campos**:
- `id`: UUID
- `tipo`: Enum (BLAZER, CAMISA, CALÇA, VESTIDO, JAQUETA, JALECO, CAMA, MESA)
- `subTipo`: Tipo detalhado (ex: "CALÇA SOCIAL", "CAMISA POLO")
- `preco`: Preço em decimal (10,2)
- `imagemUrl`: URL de imagem (opcional)

**RLS Policy**: Público para leitura (catálogo compartilhado)

---

### Tabela: Ticket (Service Orders)
```sql
CREATE TABLE ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticketNumber TEXT UNIQUE NOT NULL,
  clienteId UUID REFERENCES cliente(id) ON DELETE CASCADE NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total DECIMAL(10, 2) NOT NULL,
  totalPago DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estaPago TEXT NOT NULL DEFAULT 'não' CHECK (estaPago IN ('sim', 'não')),
  dataCriacao TIMESTAMP DEFAULT NOW(),
  dataEntrega TIMESTAMP,
  tipoAtendimento TEXT CHECK (tipoAtendimento IN ('Entrega', 'Retirada')),
  formaPagamento TEXT,
  statusEntrega TEXT CHECK (statusEntrega IN ('Aguardando retirada', 'Em producao', 'Pronto', 'Liberado')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ticket_user_id ON ticket(user_id);
CREATE INDEX idx_ticket_ticketNumber ON ticket(ticketNumber);
CREATE INDEX idx_ticket_clienteId ON ticket(clienteId);
```

**Campos principais**:
- `id`: UUID
- `user_id`: FK para auth.users
- `ticketNumber`: Número único do ticket
- `clienteId`: FK para cliente
- `items`: Array JSONB de itens (estrutura abaixo)
- `total`: Total do ticket
- `totalPago`: Valor pago
- `estaPago`: Status de pagamento (sim/não)
- `dataCriacao`: Timestamp de criação
- `dataEntrega`: Data de entrega/retirada
- `tipoAtendimento`: Entrega ou Retirada
- `formaPagamento`: Forma de pagamento
- `statusEntrega`: Status da entrega

**Estrutura de TicketItem (JSONB)**:
```json
{
  "pecaId": "uuid-string (opcional)",
  "servicoId": "number (opcional)",
  "subTipo": "string (obrigatório)",
  "quantidade": "number (obrigatório)",
  "total": "number (obrigatório)",
  "cores": "string (opcional)",
  "marca": "string (opcional)",
  "defeitos": "string (opcional)",
  "servicos": "string (opcional)"
}
```

**RLS Policy**: Usuários veem APENAS seus próprios tickets

---

### Tabela: Delivery (Delivery/Pickup Schedule)
```sql
CREATE TABLE delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticketNumber TEXT,
  codigo TEXT,
  clienteId UUID REFERENCES cliente(id) ON DELETE CASCADE NOT NULL,
  deliveryTipo TEXT NOT NULL CHECK (deliveryTipo IN ('Entrega', 'Retirada')),
  deliveryData TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_delivery_user_id ON delivery(user_id);
CREATE INDEX idx_delivery_clienteId ON delivery(clienteId);
```

**Campos**:
- `id`: UUID
- `user_id`: FK para auth.users
- `ticketNumber`: Referência ao ticket (opcional)
- `codigo`: Código de entrega (opcional)
- `clienteId`: FK para cliente
- `deliveryTipo`: Entrega ou Retirada
- `deliveryData`: Data agendada

**RLS Policy**: Usuários veem APENAS suas próprias entregas

---

## 🔐 Row Level Security (RLS)

### Políticas de Segurança

**Cliente** (4 políticas):
```sql
-- SELECT
CREATE POLICY "Users can view their own clients" ON cliente
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT
CREATE POLICY "Users can create clients" ON cliente
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "Users can update their own clients" ON cliente
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE
CREATE POLICY "Users can delete their own clients" ON cliente
  FOR DELETE USING (auth.uid() = user_id);
```

**Ticket** (4 políticas):
```sql
CREATE POLICY "Users can view their own tickets" ON ticket
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON ticket
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON ticket
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tickets" ON ticket
  FOR DELETE USING (auth.uid() = user_id);
```

**Delivery** (4 políticas):
```sql
CREATE POLICY "Users can view their own deliveries" ON delivery
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create deliveries" ON delivery
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deliveries" ON delivery
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deliveries" ON delivery
  FOR DELETE USING (auth.uid() = user_id);
```

**Peca** (1 política):
```sql
-- Público para leitura (catálogo compartilhado)
CREATE POLICY "Everyone can view pecas" ON peca
  FOR SELECT USING (true);
```

### Como RLS Funciona

1. User 1 (id=abc) faz query: `SELECT * FROM cliente`
2. Supabase intercepta e adiciona: `WHERE user_id = 'abc'`
3. Resultado: apenas clientes de User 1
4. User 2 faz mesma query
5. Supabase intercepta e adiciona: `WHERE user_id = '<id-user2>'`
6. Resultado: apenas clientes de User 2

---

## 🔑 Autenticação

### Tipos Suportados
- Email/Senha (implementado)
- Google OAuth (futuro)
- GitHub OAuth (futuro)

### Fluxo de Cadastro
```
1. User acessa /signup
2. Preenche email + senha + confirma senha
3. Clica "Cadastrar"
4. AuthService.signUp(email, password)
5. Supabase cria user em auth.users
6. Email de confirmação enviado (opcional)
7. User automaticamente logado
8. Redirecionado para Home
```

### Fluxo de Login
```
1. User acessa /login
2. Preenche email + senha
3. Clica "Entrar"
4. AuthService.signIn(email, password)
5. Supabase valida credenciais
6. Session criada (armazenada em localStorage)
7. AuthContext atualizado
8. Redirecionado para Home
```

### Validação de Rotas Protegidas
```
1. User acessa /recepcao
2. <ProtectedRoute> verifica useAuth().isAuthenticated
3. Se NÃO autenticado:
   - Redireciona para /login
4. Se autenticado:
   - Renderiza página normalmente
```

---

## 📁 Arquitetura de Arquivos

### Arquivos a CRIAR (11)

#### 1. `.env`
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
VITE_SUPABASE_SERVICE_KEY=your_service_key_here
```

#### 2. `SUPABASE_MIGRATIONS.sql`
Arquivo SQL com todas as migrations (criação de tabelas + RLS)

#### 3. `src/service/supabaseClient.ts`
Cliente Supabase inicializado com tipos TypeScript

#### 4. `src/service/supabaseService.ts`
Wrapper genérico para tratamento de erros

#### 5. `src/service/apiAuth.ts`
Serviço de autenticação
- `signUp(email, password)`
- `signIn(email, password)`
- `signOut()`
- `getCurrentUser()`
- `resetPassword(email)`

#### 6. `src/context/AuthContext.tsx`
React Context para estado de autenticação
- `user`: User atual
- `loading`: Estado de carregamento
- `signUp`, `signIn`, `signOut`: Funções de auth
- `isAuthenticated`: Boolean

#### 7. `src/components/ProtectedRoute.tsx`
Wrapper para rotas protegidas
- Verifica autenticação
- Redireciona para /login se não autenticado
- Mostra loading enquanto carrega

#### 8. `src/components/pages/Auth/Login.tsx`
Página de login com formulário

#### 9. `src/components/pages/Auth/Signup.tsx`
Página de cadastro com formulário

#### 10. `src/components/pages/Auth/Auth.css`
Estilos para páginas de autenticação

#### 11. `docs/SUPABASE_IMPLEMENTATION_PLAN.md`
Este documento (referência)

### Arquivos a MODIFICAR (6)

#### 1. `src/config/env.ts`
Adicionar configuração Supabase

#### 2. `src/service/apiCliente.ts`
Reescrever com Supabase em vez de axios
- Manter mesmas assinaturas de função
- Adicionar verificação de autenticação
- Usar .eq(), .ilike() do Supabase

#### 3. `src/service/apiPeca.ts`
Reescrever com Supabase

#### 4. `src/service/apiTicket.ts`
Reescrever com Supabase

#### 5. `src/service/apiDelivery.ts`
Reescrever com Supabase

#### 6. `src/App.tsx`
- Envolver com `<AuthProvider>`
- Adicionar rotas públicas (/login, /signup)
- Usar `<ProtectedRoute>` para rotas privadas

---

## 📋 Fases de Implementação

### FASE 1: Setup (30 min)
- [ ] Criar .env com variáveis (valores: placeholders)
- [ ] Atualizar src/config/env.ts
- [ ] Criar src/service/supabaseClient.ts

**Dependências**: Nenhuma (setup inicial)

### FASE 2: Database Schema (20 min)
- [ ] Criar SUPABASE_MIGRATIONS.sql
- [ ] Executar SQL no Supabase console
- [ ] Verificar tabelas criadas

**Dependências**: Fase 1 concluída

### FASE 3: Service Layer (2 horas)
- [ ] Criar src/service/supabaseService.ts
- [ ] Criar src/service/apiAuth.ts
- [ ] Reescrever apiCliente.ts (30 min)
- [ ] Reescrever apiPeca.ts (20 min)
- [ ] Reescrever apiTicket.ts (30 min)
- [ ] Reescrever apiDelivery.ts (20 min)

**Dependências**: Fase 2 concluída

### FASE 4: UI Layer & Auth (1.5 horas)
- [ ] Criar src/context/AuthContext.tsx
- [ ] Criar src/components/ProtectedRoute.tsx
- [ ] Criar src/components/pages/Auth/Login.tsx
- [ ] Criar src/components/pages/Auth/Signup.tsx
- [ ] Criar src/components/pages/Auth/Auth.css
- [ ] Atualizar src/App.tsx

**Dependências**: Fase 3 concluída

### FASE 5: Testing (30 min)
- [ ] npm start funciona
- [ ] Signup/Login funcionam
- [ ] Criar/listar clientes funciona
- [ ] RLS funciona (2 usuários, dados isolados)
- [ ] Logout funciona

**Dependências**: Fase 4 concluída

---

## 🚀 Próximos Passos Imediatos

### 1️⃣ Preencher Credenciais Supabase (10 min)
```
a) Acessar https://supabase.com
b) Criar novo projeto
c) Ir para Settings → API
d) Copiar:
   - Project URL → VITE_SUPABASE_URL
   - anon public key → VITE_SUPABASE_PUBLISHABLE_KEY
   - service_role key → VITE_SUPABASE_SERVICE_KEY
e) Preencher no arquivo .env
f) ⚠️ NÃO fazer commit do .env com credenciais reais!
```

### 2️⃣ Executar Migrations SQL (5 min)
```
a) Abrir Supabase Console
b) Ir para SQL Editor
c) Copiar TODO conteúdo de SUPABASE_MIGRATIONS.sql
d) Colar no editor
e) Clicar "Execute" (Ctrl+Enter)
f) Verificar em Tables se foram criadas:
   - cliente ✓
   - peca ✓
   - ticket ✓
   - delivery ✓
```

### 3️⃣ Seed Data (Opcional - 5 min)
```sql
-- Inserir peças de exemplo
INSERT INTO peca (tipo, subTipo, preco) VALUES
('CALÇA', 'CALÇA SOCIAL', 29.90),
('CALÇA', 'CALÇA JEANS', 29.90),
('CAMISA', 'CAMISA SOCIAL', 19.90),
('CAMISA', 'CAMISA POLO', 49.90),
('VESTIDO', 'VESTIDO RENDA', 200.90),
('VESTIDO', 'VESTIDO LONGO', 200.90),
('JAQUETA', 'JAQUETA SOCIAL', 89.90),
('JALECO', 'JALECO AVENTAL', 10.00),
('CAMA', 'EDREDOM', 50.00),
('MESA', 'TOALHA', 30.00);
```

### 4️⃣ Copiar Arquivos de Código (1 hora)
- Copiar/colar todos os 11 arquivos criados
- Atualizar 6 arquivos existentes
- Usar code blocks dos subagents como referência

### 5️⃣ Testar (15 min)
```bash
npm start
# Acessar http://localhost:3000
# 1. Será redirecionado para /signup
# 2. Criar nova conta (email + senha)
# 3. Fazer login
# 4. Home aparece (protegida)
# 5. Testar criar/listar clientes
# 6. Testar RLS com 2 usuários diferentes
```

---

## ✅ Checklist de Verificação

### Configuração
- [ ] Credenciais Supabase preenchidas no .env
- [ ] .env adicionado ao .gitignore
- [ ] SUPABASE_MIGRATIONS.sql criado

### Database
- [ ] Migrations SQL executado sem erros
- [ ] 4 tabelas criadas em Supabase
- [ ] RLS habilitado em todas as tabelas
- [ ] 14 RLS policies aplicadas
- [ ] Índices criados para performance
- [ ] Peca seed data inserido (opcional)

### Code
- [ ] src/service/supabaseClient.ts criado
- [ ] src/service/supabaseService.ts criado
- [ ] src/service/apiAuth.ts criado
- [ ] src/context/AuthContext.tsx criado
- [ ] src/components/ProtectedRoute.tsx criado
- [ ] Auth pages criadas (Login, Signup, CSS)
- [ ] src/config/env.ts atualizado
- [ ] Todos os apiXXX.ts reescritos
- [ ] src/App.tsx atualizado com AuthProvider

### Execução
- [ ] npm start funciona sem erros
- [ ] /signup acessível (rota pública)
- [ ] Novo usuário consegue se registrar
- [ ] Confirmação de email recebida (opcional)
- [ ] Login funciona
- [ ] / acessível após login (rota protegida)
- [ ] Criar novo cliente funciona
- [ ] Listar clientes mostra apenas clientes do usuário
- [ ] Páginas protegidas redirecionam para /login se deslogado
- [ ] RLS funciona (User 1 não vê dados de User 2)

### Validação Final
- [ ] Sem console.error relacionado a Supabase
- [ ] Sem erros de TypeScript (`npm run build` passa)
- [ ] Sem erros de RLS nas operações CRUD
- [ ] Logout limpa auth state corretamente

---

## 📚 Tipos TypeScript

Todos os tipos estão em `src/service/supabaseClient.ts`:

```typescript
// Cliente
export type Cliente = {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  estado?: string;
  cep?: string;
  bairro?: string;
  created_at?: string;
  updated_at?: string;
};

// Peca
export type Peca = {
  id: string;
  tipo: TipoPeca;
  subTipo: string;
  preco: number;
  imagemUrl?: string;
  created_at?: string;
  updated_at?: string;
};

// TicketItem (dentro de Ticket.items)
export type TicketItem = {
  quantidade: number;
  pecaId?: string;
  servicoId?: number;
  subTipo: string;
  total: number;
  cores?: string;
  marca?: string;
  defeitos?: string;
  servicos?: string;
};

// Ticket
export type Ticket = {
  id: string;
  user_id: string;
  clienteId: string;
  ticketNumber: string;
  items: TicketItem[];
  total: number;
  totalPago: number;
  estaPago: 'sim' | 'não';
  dataCriacao?: string;
  dataEntrega?: string;
  tipoAtendimento?: 'Entrega' | 'Retirada';
  formaPagamento?: string;
  statusEntrega?: 'Aguardando retirada' | 'Em producao' | 'Pronto' | 'Liberado';
  cliente?: Cliente;
  created_at?: string;
  updated_at?: string;
};

// Delivery
export type Delivery = {
  id: string;
  user_id: string;
  ticketNumber?: string;
  codigo?: string;
  clienteId: string;
  deliveryTipo: 'Entrega' | 'Retirada';
  deliveryData: string;
  created_at?: string;
  updated_at?: string;
};
```

---

## 🔗 Assinaturas de Função (Service Layer)

Todas as funções mantêm **mesmas assinaturas** do código atual para minimizar mudanças na UI:

### apiCliente.ts
```typescript
listarClientes(): Promise<Cliente[]>
getCliente(idCliente: string): Promise<Cliente>
buscarCliente(nomeCliente?: string, celularCliente?: string): Promise<Cliente[]>
criarCliente(cliente: Partial<Cliente>): Promise<Cliente>
atualizaCliente(idCliente: string, cliente: Partial<Cliente>): Promise<Cliente>
deletarCliente(idCliente: string): Promise<void>
```

### apiPeca.ts
```typescript
listarPeca(): Promise<Peca[]>
getPeca(idPeca: string): Promise<Peca>
getPecaPorTipo(tipoPeca: TipoPeca): Promise<Peca[]>
atualizaPeca(idPeca: string, peca: Partial<Peca>): Promise<Peca>
```

### apiTicket.ts
```typescript
criarTicket(ticket: Partial<Ticket>): Promise<Ticket>
buscarTicket(ticketNumber: string): Promise<Ticket | null>
getTicket(ticketNumber: string): Promise<(Ticket & { cliente?: Cliente }) | null>
listarTickets(): Promise<(Ticket & { cliente?: Cliente })[]>
atualizaTicket(ticket: Partial<Ticket> & { id: string }): Promise<Ticket>
deletarTicket(idTicket: string): Promise<void>
```

### apiDelivery.ts
```typescript
listarDelivery(): Promise<Delivery[]>
getDelivery(idDelivery: string): Promise<Delivery>
buscarDelivery(clienteId: string): Promise<Delivery[]>
criarDelivery(delivery: Partial<Delivery>): Promise<Delivery>
atualizaDelivery(idDelivery: string, delivery: Partial<Delivery>): Promise<Delivery>
deletarDelivery(idDelivery: string): Promise<void>
```

### apiAuth.ts
```typescript
AuthService.signUp(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }>
AuthService.signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }>
AuthService.signOut(): Promise<{ error: AuthError | null }>
AuthService.getCurrentUser(): Promise<User | null>
AuthService.resetPassword(email: string): Promise<{ error: AuthError | null }>
```

---

## ⚠️ Considerações Importantes

### Segurança
1. **Credenciais**: Nunca fazer commit do `.env` com valores reais
2. **Gitignore**: Adicionar `.env` ao `.gitignore`
3. **PUBLISHABLE_KEY**: Seguro expor no frontend (usado para auth)
4. **SERVICE_KEY**: Manter seguro (usar apenas em backend/functions)
5. **RLS**: Essencial para isolamento de dados entre usuários

### Performance
1. Índices criados nas colunas principais (user_id, email, ticketNumber, etc.)
2. Queries otimizadas com `.select()` específico (não SELECT *)
3. RLS policies automaticamente aplicadas (sem overhead extra)
4. Peca (catálogo) não tem user_id - compartilhado entre todos

### Dados
1. **Migração**: Começar fresh (nenhuma importação de db.json)
2. **Catálogo**: Peca compartilhado entre usuários (sem user_id)
3. **Isolamento**: Cliente, Ticket, Delivery isolados por user_id
4. **Timestamps**: created_at, updated_at automaticamente gerenciados

### Suporte a Futuras Funcionalidades
1. **Real-time Subscriptions**: Supabase Realtime já suporta (não implementado nesta fase)
2. **Offline Mode**: Pode ser adicionado com local storage/IndexedDB
3. **Admin Panel**: Pode ser adicionado com políticas especiais
4. **OAuth**: Google/GitHub podem ser adicionados depois

---

## 🎯 Decisões de Arquitetura

| Decisão | Valor | Razão |
|---------|-------|-------|
| ID Principal | UUID | Escala global, distribuído |
| Autenticação | Email/Senha | Simples, padrão da indústria |
| RLS | Habilitado | Segurança obrigatória |
| Catálogo (Peca) | Compartilhado | Dados globais, não isolados |
| Dados Usuário | Isolados por user_id | Privacidade e segurança |
| Session Storage | LocalStorage | Padrão Supabase |
| TypeScript | Full coverage | Type safety |
| Assinaturas Funções | Mantidas | Compatibilidade UI |

---

## 📞 Troubleshooting

### Erro: "Missing Supabase environment variables"
**Solução**: Verificar .env e se valores foram preenchidos corretamente

### Erro: "Relations missing" ao criar Ticket
**Solução**: Verificar se cliente existe antes (FK constraint)

### Erro: "RLS policy violation"
**Solução**: Verificar se user_id está sendo passado corretamente

### Erro: "User not found"
**Solução**: Verificar se user está autenticado antes de queryar

### Rota protegida redireciona para /login
**Solução**: Verificar se AuthProvider está envolvendo App corretamente

### JSONB items não serializam
**Solução**: Verificar tipagem - deve ser `items: TicketItem[]`

---

## 📈 Métricas de Sucesso

- ✅ 0 erros de autenticação ao fazer login
- ✅ 100% de cobertura RLS (usuários veem apenas seus dados)
- ✅ Tempo de resposta <500ms para operações CRUD
- ✅ 0 console errors relacionados a Supabase
- ✅ Todas as rotas protegidas funcionando
- ✅ Logout limpa session corretamente

---

## 🔄 Próximos Passos Após Implementação

1. **Monitoramento**: Configurar logs/alertas no Supabase
2. **Backups**: Ativar backups automáticos
3. **Email**: Configurar templates de email personalizados
4. **OAuth**: Adicionar Google/GitHub login
5. **Admin Panel**: Criar interface para gerenciar Peca
6. **Real-time**: Implementar Supabase Realtime para updates ao vivo
7. **Performance**: Monitorar e otimizar queries com Supabase Analytics

---

## 📝 Referências

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Plano criado em**: 25 de maio de 2026  
**Versão**: 1.0  
**Status**: ✅ Completo e pronto para implementação
