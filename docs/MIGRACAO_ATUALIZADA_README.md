# Script de Migração Supabase Atualizado

## ✅ Correções Implementadas

O arquivo `/workspace/docs/SUPABASE_MIGRATIONS.sql` foi atualizado com todas as correções solicitadas:

### 1. UUID - Extensão Correta
- **Antes:** `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` com `uuid_generate_v4()`
- **Depois:** `CREATE EXTENSION IF NOT EXISTS pgcrypto;` com `gen_random_uuid()`
- **Linha 10:** Agora usa a extensão correta compatível com a função `gen_random_uuid()`

### 2. RLS de UPDATE - WITH CHECK Adicionado
Políticas de UPDATE agora incluem `WITH CHECK` para maior segurança em 3 tabelas:

#### Tabela `cliente` (Linhas 124-129)
```sql
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### Tabela `ticket` (Linhas 150-155)
```sql
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### Tabela `delivery` (Linhas 176-181)
```sql
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**Benefício:** Garante que após o UPDATE, a linha ainda pertence ao mesmo usuário, prevenindo cenários onde campos possam ser alterados para transferir a propriedade indevidamente.

### 3. Seed Idempotente - Tabela `peca`

#### Índice Único (Linha 50)
```sql
CREATE UNIQUE INDEX IF NOT EXISTS ux_peca_tipo_subtipo ON peca(tipo, subTipo);
```

#### Constraint UNIQUE (Linha 46)
```sql
UNIQUE(tipo, subTipo)
```

#### INSERT com ON CONFLICT (Linhas 302-306)
```sql
ON CONFLICT (tipo, subTipo) 
DO UPDATE SET 
  preco = EXCLUDED.preco, 
  imagemUrl = EXCLUDED.imagemUrl,
  updated_at = NOW();
```

**Benefício:** O script pode ser reexecutado múltiplas vezes sem duplicar dados. Se uma peça já existir (mesmo tipo e subTipo), ela será atualizada com novos preços/imagens.

### 4. Tabela `peca` - RLS Somente Leitura
- **SELECT:** Liberado para todos (`FOR SELECT USING (true)`)
- **INSERT/UPDATE/DELETE:** Bloqueado via RLS (apenas service_role/admin pode modificar)
- **Intenção:** Catálogo compartilhado e somente leitura para usuários comuns

## 📊 Resumo do Script

| Item | Quantidade |
|------|------------|
| Tabelas | 4 (cliente, peca, ticket, delivery, ticket_item) |
| Políticas RLS | 13 |
| Índices | 8 |
| Triggers | 4 (updated_at automático) |
| Peças Seedadas | 45 |
| Linhas Totais | 315 |

## 🚀 Como Executar

1. Acesse o dashboard do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** → **+ New Query**
4. Copie todo o conteúdo de `/workspace/docs/SUPABASE_MIGRATIONS.sql`
5. Cole no editor e clique em **Run**
6. Verifique os resultados:
   ```sql
   SELECT COUNT(*) FROM peca; -- Deve retornar 45
   SELECT * FROM peca LIMIT 5;
   SELECT relname, relrowsecurity FROM pg_class 
   WHERE relname IN ('cliente', 'peca', 'ticket', 'delivery');
   ```

## ✅ Checklist de Validação

- [x] Extensão `pgcrypto` habilitada
- [x] Função `gen_random_uuid()` usada em todos os DEFAULTs
- [x] WITH CHECK adicionado nas políticas de UPDATE (cliente, ticket, delivery)
- [x] Índice único em `peca(tipo, subTipo)` criado
- [x] Constraint UNIQUE em `peca(tipo, subTipo)` adicionada
- [x] INSERT com ON CONFLICT para idempotência
- [x] RLS habilitado em todas as tabelas
- [x] Policies de SELECT, INSERT, UPDATE, DELETE configuradas
- [x] Trigger de updated_at funcional

## 📝 Notas Importantes

1. **Reexecução Segura:** O script agora é idempotente - pode ser executado múltiplas vezes sem erros ou duplicação
2. **Segurança Reforçada:** WITH CHECK previne transferência indevida de propriedade via UPDATE
3. **Catálogo Compartilhado:** Tabela `peca` é leitura para todos, escrita apenas por admins
4. **Isolamento por Usuário:** Todas as outras tabelas usam RLS para isolar dados por `user_id`

## 🔗 Arquivos Relacionados

- `/workspace/docs/SUPABASE_MIGRATIONS.sql` - Script completo da migração
- `/workspace/docs/SUPABASE_IMPLEMENTATION_PLAN.md` - Plano de implementação
- `/workspace/docs/COMO_EXECUTAR_MIGRACAO.md` - Instruções detalhadas
