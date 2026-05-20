# Plano de Melhorias - Sistema de Lavanderia

## Visao geral
Este documento consolida a direcao do produto, o que ja foi entregue e o que ainda precisa evoluir no sistema. O foco continua sendo melhorar operacao, atendimento, controle financeiro e experiencia visual.

## Objetivos principais
- Automatizar fluxos repetitivos.
- Organizar o atendimento do balcao ao pos-entrega.
- Dar visibilidade operacional por meio de dashboards e relatorios.
- Reduzir erros em cadastro, busca, tickets e pagamentos.
- Evoluir a interface para um padrao mais moderno, claro e responsivo.

## O que ja foi feito

### UX/UI e experiencia
- Home redesenhada com linguagem mais proxima de dashboard SaaS, com KPIs, atalhos e visao consolidada da operacao.
- Tela de Recepcao redesenhada com busca principal em destaque, atalhos de fluxo e hierarquia visual mais moderna.
- Pagina de Clientes modernizada com melhor leitura, superficies elevadas e empty states.
- Busca de Ticket reorganizada com visual mais harmonico e leitura mais clara dos dados.
- Pagina de Cadastro de Cliente redesenhada com hero editorial, seccionamento por contato e endereco, validacao visivel e feedback de sucesso/erro.

### Fluxos de negocio e telas
- Dashboard administrativo funcional com indicadores principais.
- Relatorio financeiro com filtros e exportacao.
- Estrutura de rotas administrativas criada.
- Placeholders existentes para gestao de clientes, tickets, entregas e configuracoes.
- Fluxo de recepcao integrado com busca de cliente e continuidade para servicos.

### Correcao tecnica recente
- Imports do `react-bootstrap` corrigidos para padrao compativel com a versao instalada.
- Tipagem de `estaPago` padronizada para evitar erros de TypeScript.
- Projeto validado com `npx tsc --noEmit`.
- Build validado com `npm run build`.

## Estado atual por frente

### Concluido
- Dashboard inicial da operacao.
- Relatorio financeiro basico.
- Redesign da Home.
- Redesign da Recepcao.
- Redesign do Cadastro de Cliente.
- Redesign da pagina de Clientes.
- Redesign da busca de ticket.
- Ajustes de compilacao e compatibilidade de tipos.

### Em andamento
- Refino gradual do sistema visual entre telas antigas e telas novas.
- Consolidacao dos modulos administrativos ja criados como placeholder.

### Nao iniciado ou incompleto
- Controle de pagamentos dedicado.
- Timeline completa de status dos tickets.
- Modulo robusto de entregas e retiradas com roteirizacao.
- Notificacoes automaticas por WhatsApp, SMS ou e-mail.
- Busca global com filtros avancados.
- Tema visual unificado com alternancia claro/escuro.

## Proximas prioridades recomendadas

### Prioridade 1
- Modernizar a tela de Delivery para aproximar do padrao visual novo.
- Modernizar a agenda de entregas e retiradas.
- Revisar consistencia entre formularios antigos e novos.

### Prioridade 2
- Criar modulo de controle de pagamentos com status mais completo.
- Melhorar historico e visualizacao de tickets.
- Adicionar feedbacks de carregamento e erro de forma padronizada nas telas principais.

### Prioridade 3
- Implementar busca global por cliente, ticket e telefone.
- Estruturar notificacoes internas e alertas operacionais.
- Evoluir relatorios com mais filtros e graficos.

## Estrutura sugerida para evolucao
```text
/src
|-- components/
|   |-- pages/
|   |   |-- Admin/
|   |   |-- CadastroCliente/
|   |   |-- Recepcao/
|   |   |-- Delivery/
|   |   |-- AgendaDelivery/
|   |   |-- VisualizaDeTicket/
|   |-- common/
|   |-- charts/
|-- hooks/
|-- service/
|-- utils/
```

## Pendencias tecnicas observadas
- Ha sinais de arquivos antigos com problemas de encoding em trechos legados.
- O ambiente ainda exibe um `EPERM` relacionado a `C:\Users\felic` apos alguns comandos, embora nao esteja bloqueando build nem TypeScript.
- Algumas telas ainda usam estilos antigos e precisam migrar para o novo padrao visual.

## Metas de curto prazo
- Padronizar as telas principais de atendimento.
- Reduzir divergencia visual entre modulos.
- Garantir que formularios criticos tenham validacao simples e mensagens claras.
- Avancar no fluxo financeiro sem perder estabilidade do que ja funciona.

## Historico recente
- 18/05/2026: correcao dos erros de compilacao em `react-bootstrap` e tipagem de pagamento.
- 18/05/2026: build e validacao TypeScript concluídos com sucesso.
- 18/05/2026: redesign da pagina de Cadastro de Cliente com layout mais moderno e responsivo.
- 18/05/2026: definicao de nova diretriz de design com foco em personalizacoes modernas, superficies elevadas, sombras suaves, bordas arredondadas e hierarquia visual clara para as proximas etapas de desenvolvimento.

## Resumo executivo
O projeto ja saiu de uma base visual mais simples para um caminho de interface mais moderna nas telas centrais. Foi estabelecida uma correção nas páginas existentes e definida uma nova diretriz de design mais personalizado e moderno (com uso de sombras suaves, bordas arredondadas, gradientes sutis e melhor tipografia) que sera aplicada nas próximas etapas. O proximo passo mais valioso e levar esse mesmo nivel de qualidade para Delivery, AgendaDelivery e modulos administrativos pendentes, enquanto o fluxo financeiro e de status ganha mais profundidade.
