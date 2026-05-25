-- ============================================
-- SUPABASE MIGRATIONS - SISTEMA DE LAVANDERIA
-- ============================================
-- Executar este script no SQL Editor do Supabase
-- Data: 2025-12-21
-- Baseado em db.json existente
-- ============================================

-- Habilitar extensão para geração de UUIDs (pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 1. TABELA: cliente (Customers)
-- ============================================
CREATE TABLE IF NOT EXISTS cliente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  estado TEXT,
  cep TEXT,
  bairro TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cliente_user_id ON cliente(user_id);
CREATE INDEX IF NOT EXISTS idx_cliente_email ON cliente(email);

-- ============================================
-- 2. TABELA: peca (Garment/Service Catalog)
-- ============================================
CREATE TABLE IF NOT EXISTS peca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('BLAZER', 'CAMISA', 'CALÇA', 'VESTIDO', 'JAQUETA', 'JALECO', 'CAMA', 'MESA')),
  subTipo TEXT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  imagemUrl TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tipo, subTipo)
);

-- Índice único para garantir idempotência no seed
CREATE UNIQUE INDEX IF NOT EXISTS ux_peca_tipo_subtipo ON peca(tipo, subTipo);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_peca_tipo ON peca(tipo);

-- Seed idempotente
CREATE UNIQUE INDEX IF NOT EXISTS ux_peca_tipo_subtipo ON peca(tipo, subTipo);

-- ============================================
-- 3. TABELA: ticket (Service Orders)
-- ============================================
CREATE TABLE IF NOT EXISTS ticket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticketNumber TEXT UNIQUE NOT NULL,
  clienteId UUID REFERENCES cliente(id) ON DELETE CASCADE NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total DECIMAL(10, 2) NOT NULL,
  totalPago DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estaPago TEXT NOT NULL DEFAULT 'não' CHECK (estaPago IN ('sim', 'não')),
  dataCriacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dataEntrega TIMESTAMP WITH TIME ZONE,
  tipoAtendimento TEXT CHECK (tipoAtendimento IN ('Entrega', 'Retirada')),
  formaPagamento TEXT,
  statusEntrega TEXT CHECK (statusEntrega IN ('Aguardando retirada', 'Em producao', 'Pronto', 'Liberado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ticket_user_id ON ticket(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_ticketNumber ON ticket(ticketNumber);
CREATE INDEX IF NOT EXISTS idx_ticket_clienteId ON ticket(clienteId);

-- ============================================
-- 4. TABELA: delivery (Delivery/Pickup Schedule)
-- ============================================
CREATE TABLE IF NOT EXISTS delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticketNumber TEXT,
  codigo TEXT,
  clienteId UUID REFERENCES cliente(id) ON DELETE CASCADE NOT NULL,
  deliveryTipo TEXT NOT NULL CHECK (deliveryTipo IN ('Entrega', 'Retirada')),
  deliveryData TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_delivery_user_id ON delivery(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_clienteId ON delivery(clienteId);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE peca ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS: cliente
-- ============================================

DROP POLICY IF EXISTS "Users can view their own clients" ON cliente;
CREATE POLICY "Users can view their own clients" ON cliente
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create clients" ON cliente;
CREATE POLICY "Users can create clients" ON cliente
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuários podem atualizar seus próprios clientes (com WITH CHECK para segurança)
DROP POLICY IF EXISTS "Users can update their own clients" ON cliente;
CREATE POLICY "Users can update their own clients" ON cliente
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own clients" ON cliente;
CREATE POLICY "Users can delete their own clients" ON cliente
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: ticket
-- ============================================

DROP POLICY IF EXISTS "Users can view their own tickets" ON ticket;
CREATE POLICY "Users can view their own tickets" ON ticket
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create tickets" ON ticket;
CREATE POLICY "Users can create tickets" ON ticket
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuários podem atualizar seus próprios tickets (com WITH CHECK para segurança)
DROP POLICY IF EXISTS "Users can update their own tickets" ON ticket;
CREATE POLICY "Users can update their own tickets" ON ticket
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tickets" ON ticket;
CREATE POLICY "Users can delete their own tickets" ON ticket
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: delivery
-- ============================================

DROP POLICY IF EXISTS "Users can view their own deliveries" ON delivery;
CREATE POLICY "Users can view their own deliveries" ON delivery
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create deliveries" ON delivery;
CREATE POLICY "Users can create deliveries" ON delivery
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuários podem atualizar suas próprias entregas (com WITH CHECK para segurança)
DROP POLICY IF EXISTS "Users can update their own deliveries" ON delivery;
CREATE POLICY "Users can update their own deliveries" ON delivery
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own deliveries" ON delivery;
CREATE POLICY "Users can delete their own deliveries" ON delivery
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: peca
-- ============================================

DROP POLICY IF EXISTS "Everyone can view pecas" ON peca;
CREATE POLICY "Everyone can view pecas" ON peca
  FOR SELECT
  USING (true);

-- ============================================
-- TRIGGER: Atualizar updated_at automaticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cliente_updated_at ON cliente;
CREATE TRIGGER update_cliente_updated_at
  BEFORE UPDATE ON cliente
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_peca_updated_at ON peca;
CREATE TRIGGER update_peca_updated_at
  BEFORE UPDATE ON peca
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ticket_updated_at ON ticket;
CREATE TRIGGER update_ticket_updated_at
  BEFORE UPDATE ON ticket
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_updated_at ON delivery;
CREATE TRIGGER update_delivery_updated_at
  BEFORE UPDATE ON delivery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: Popular tabela peca (catálogo)
-- (idempotente por UNIQUE(tipo, subTipo))
-- ============================================
-- Dados baseados no db.json existente (45 peças)
-- Usando ON CONFLICT para garantir idempotência

INSERT INTO peca (tipo, subTipo, preco, imagemUrl) VALUES
-- CALÇAS (6 itens)
('CALÇA', 'CALÇA ESPECIAL', 35.00, '/assets/img/calcaEspecial.JPG'),
('CALÇA', 'CALÇA SARJA', 25.90, '/assets/img/calcaEspecial.JPG'),
('CALÇA', 'CALÇA SOCIAL', 29.90, '/assets/img/calcaSimples.png'),
('CALÇA', 'CALÇA MOLETOM', 29.90, '/assets/img/calcaSimples.png'),
('CALÇA', 'CALÇA JEANS', 29.90, '/assets/img/calcaSimples.png'),
('CALÇA', 'CALÇA MALHA', 29.90, '/assets/img/calcaSimples.png'),

-- CAMISAS (6 itens)
('CAMISA', 'CAMISA ESPECIAL', 39.90, '/assets/img/camisaEspecial.png'),
('CAMISA', 'CAMISA SOCIAL', 19.90, '/assets/img/camisa1.jpg'),
('CAMISA', 'CAMISA RENDA', 49.90, '/assets/img/camisaEspecial.png'),
('CAMISA', 'CAMISA POLO', 49.90, '/assets/img/camisaEspecial.png'),
('CAMISA', 'CAMISA JEANS', 49.90, '/assets/img/camisaEspecial.png'),
('CAMISA', 'CAMISA DETALHE', 49.90, '/assets/img/camisaEspecial.png'),

-- BLAZERS (6 itens)
('BLAZER', 'BLAZER ESPECIAL', 89.90, '/assets/img/blazer.png'),
('BLAZER', 'BLAZER', 89.90, '/assets/img/blazer.png'),
('BLAZER', 'BLAZER CASUAL', 89.90, '/assets/img/blazer.png'),
('BLAZER', 'BLAZER DETALHE', 89.90, '/assets/img/blazer.png'),
('BLAZER', 'BLAZER CROPPED', 89.90, '/assets/img/blazer.png'),
('BLAZER', 'BLAZER BOYFRIEND', 89.90, '/assets/img/blazer.png'),

-- VESTIDOS (6 itens)
('VESTIDO', 'VESTIDO ESPECIAL', 200.90, '/assets/img/vestidoEspecial.jpg'),
('VESTIDO', 'VESTIDO RENDA', 200.90, '/assets/img/vestidoRenda.jpg'),
('VESTIDO', 'VESTIDO SIMPLES', 200.90, '/assets/img/vestidoSimple.jpg'),
('VESTIDO', 'VESTIDO COURO', 200.90, '/assets/img/vestidoSimple.jpg'),
('VESTIDO', 'VESTIDO LONGO', 200.90, '/assets/img/vestidoSimple.jpg'),
('VESTIDO', 'VESTIDO DETALHE', 200.90, '/assets/img/vestidoSimple.jpg'),

-- JAQUETAS (3 itens)
('JAQUETA', 'JAQUETA SIMPLES', 20.90, '/assets/img/jaqueta.png'),
('JAQUETA', 'JAQUETA ESPECIAL', 20.90, '/assets/img/jaquetaE.jpg'),
('JAQUETA', 'JAQUETA RENDA', 30.00, '/assets/img/jaquetaS.png'),

-- JALECOS (6 itens)
('JALECO', 'JALECO AVENTAL', 10.00, '/assets/img/jaleco.png'),
('JALECO', 'JALECO DE RENDA', 30.00, '/assets/img/jaleco.png'),
('JALECO', 'JALECO DE COZINHA', 30.00, '/assets/img/jaleco.png'),
('JALECO', 'JALECO SARJA', 30.00, '/assets/img/jaleco.png'),
('JALECO', 'JALECO OXFORD', 30.00, '/assets/img/jaleco.png'),
('JALECO', 'JALECO BRIM', 30.00, '/assets/img/jaleco.png'),

-- CAMA (6 itens)
('CAMA', 'EDREDOM', 50.00, '/assets/img/edredom.png'),
('CAMA', 'EDREDOM KING', 60.00, '/assets/img/edredom.png'),
('CAMA', 'EDREDOM QUEEN', 30.00, '/assets/img/edredom.png'),
('CAMA', 'EDREDOM MALHA', 30.00, '/assets/img/edredom.png'),
('CAMA', 'EDREDOM PLUMA', 30.00, '/assets/img/edredom.png'),
('CAMA', 'EDREDOM BABADO', 30.00, '/assets/img/edredom.png'),

-- MESA (6 itens)
('MESA', 'TOALHA LINHO', 30.00, '/assets/img/toa.png'),
('MESA', 'TOALHA RENDA', 30.00, '/assets/img/toa.png'),
('MESA', 'TOALHA GRANDE', 30.00, '/assets/img/toa.png'),
('MESA', 'TOALHA REDONDA', 30.00, '/assets/img/toa.png'),
('MESA', 'TOALHA MALHA', 30.00, '/assets/img/toa.png'),
('MESA', 'TOALHA PEQUENA', 30.00, '/assets/img/toa.png')
ON CONFLICT (tipo, subTipo) 
DO UPDATE SET 
  preco = EXCLUDED.preco, 
  imagemUrl = EXCLUDED.imagemUrl,
  updated_at = NOW();

-- ============================================
-- FIM DO SCRIPT DE MIGRAÇÃO
-- ============================================

-- Verificação pós-execução (manual no SQL Editor):
-- 1) SELECT COUNT(*) FROM peca;
-- 2) SELECT * FROM peca LIMIT 5;
-- 3) SELECT relname, relrowsecurity
--    FROM pg_class
--    WHERE relname IN ('cliente', 'peca', 'ticket', 'delivery');
