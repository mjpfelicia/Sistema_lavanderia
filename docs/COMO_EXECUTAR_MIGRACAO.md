# Como Executar a Migração no Supabase

## ✅ Variáveis de Ambiente Configuradas

As seguintes variáveis já estão configuradas no ambiente:


## 📋 Passo a Passo para Executar a Migração

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. **Acesse o Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Navegue até o SQL Editor:**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"+ New Query"**

3. **Execute o Script de Migração:**
   - Abra o arquivo `/workspace/docs/SUPABASE_MIGRATIONS.sql`
   - Copie TODO o conteúdo do arquivo
   - Cole no editor SQL do Supabase
   - Clique em **"Run"** (ou pressione Ctrl+Enter)

4. **Verifique o Resultado:**
   - Após a execução, você verá uma mensagem de sucesso
   - Vá em **"Table Editor"** para ver as tabelas criadas:
     - `cliente`
     - `peca`
     - `ticket`
     - `delivery`

### Opção 2: Via Supabase CLI (Alternativa)

```bash
# Instalar Supabase CLI (já instalado)
npm install -g supabase

# Linkar ao projeto existente
cd /workspace
supabase link --project-ref koqoinhppexhltvgfeel

# Fazer login (se necessário)
supabase login

# Empurrar migrações
supabase db push
```

## 📊 O Que Será Criado

### Tabelas (4)
- **cliente**: Dados dos clientes
- **peca**: Catálogo de peças/serviços (45 itens seedados)
- **ticket**: Tickets de lavanderia
- **delivery**: Registros de entrega/retirada

### Políticas RLS (13)
- Isolamento de dados por usuário autenticado
- Permissões de SELECT, INSERT, UPDATE, DELETE

### Índices
- Performance otimizada para consultas frequentes

### Dados Seed
- 45 peças pré-cadastradas baseadas no `db.json` existente

## 🔍 Verificação Pós-Migração

Após executar a migração, verifique no Table Editor:

```sql
-- Contar registros
SELECT 'cliente' as tabela, COUNT(*) FROM cliente
UNION ALL
SELECT 'peca', COUNT(*) FROM peca
UNION ALL
SELECT 'ticket', COUNT(*) FROM ticket
UNION ALL
SELECT 'delivery', COUNT(*) FROM delivery;
```

## ⚠️ Importante

- A API REST do Supabase **não executa comandos DDL** (CREATE TABLE, etc.)
- É necessário usar o SQL Editor ou Supabase CLI
- As credenciais já estão configuradas nas variáveis de ambiente
- Use a **Service Key** para operações administrativas

## 📁 Arquivos Relacionados

- `/workspace/docs/SUPABASE_MIGRATIONS.sql` - Script completo da migração
- `/workspace/docs/SUPABASE_IMPLEMENTATION_PLAN.md` - Plano de implementação
