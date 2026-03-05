# EducaDQ EAD - Project TODO

## Database & Backend
- [x] Modelagem e criação do esquema PostgreSQL (Drizzle ORM)
- [x] Tabelas: usuarios, cursos, aulas, materiais, matriculas, progresso, avaliacoes, perguntas, alternativas, pagamentos, parcelas, sessoes, notificacoes
- [x] Migrations do Drizzle ORM
- [x] Procedures tRPC para autenticação
- [x] Procedures tRPC para gerenciamento de cursos
- [x] Procedures tRPC para aulas e materiais
- [x] Procedures tRPC para avaliações
- [x] Procedures tRPC para progresso
- [x] Procedures tRPC para pagamentos
- [ ] Procedures tRPC para relatórios
- [ ] Procedures tRPC para notificações

## Authentication & Security
- [x] Sistema de autenticação com 3 níveis (Admin, Professor, Aluno)
- [x] Controle de sessão anti-compartilhamento (detecção de IP/dispositivo)
- [x] Bloqueio de sessões paralelas
- [ ] Proteção contra brute force
- [ ] Criptografia de senhas

## Landing Page & Public
- [x] Landing page com catálogo de cursos
- [x] Cards de cursos (capa, descrição, carga horária, valor, trailer)
- [ ] Sistema de recomendação (cursos relacionados, populares, não adquiridos)
- [x] Botão "Tenho Acesso" / "Comprar"
- [x] Footer com redes sociais e WhatsApp

## Admin Panel
- [ ] Dashboard com estatísticas gerais
- [ ] Cadastro de cursos (título, descrição, carga horária, valor, capa, trailer, professor, nota mínima, parcelas)
- [ ] Gerenciamento de professores
- [ ] Gerenciamento de alunos
- [ ] Liberação manual de acesso a cursos
- [ ] Configuração de parcelas (valor, entrada, número de parcelas, datas)
- [ ] Geração de relatórios Excel (cursos, alunos, progresso, pagamentos)
- [ ] Visualização de alertas de conclusão
- [ ] Visualização de alertas de pagamento

## Professor Panel
- [ ] Dashboard com cursos atribuídos
- [ ] Criação de aulas (vídeo YouTube, texto, ao vivo Google Meet)
- [ ] Edição de aulas
- [ ] Criação de avaliações (por aula ou final)
- [ ] Criação de perguntas com 5 alternativas
- [ ] Distribuição automática de respostas (20% cada)
- [ ] Acompanhamento de progresso dos alunos
- [ ] Visualização de desempenho em avaliações
- [ ] Alertas de alunos aprovados

## Student Panel
- [x] Dashboard com cursos em andamento, concluídos e disponíveis
- [x] Barra de progresso por curso
- [x] Bloqueio de aulas futuras até conclusão da anterior
- [x] Visualização de aulas (vídeo, texto, ao vivo)
- [ ] Download de materiais (Google Drive)
- [ ] Realização de avaliações
- [ ] Visualização de notas
- [ ] Sistema de recomendação de cursos
- [x] Acompanhamento de progresso

## Content Protection
- [x] Desabilitar CTRL+C (cópia de texto)
- [x] Desabilitar CTRL+V (cola)
- [x] Desabilitar seleção de texto
- [x] Desabilitar botão direito
- [x] Desabilitar inspeção de elementos (F12)
- [x] Proteção de vídeos contra download

## Payment System
- [ ] Configuração de parcelas pelo Admin
- [ ] Cálculo automático de datas de vencimento
- [ ] Alertas automáticos antes do vencimento
- [ ] Mensagens com chave PIX (41 98891-3431)
- [ ] Rastreamento de pagamentos (pagos, pendentes, atrasados)
- [ ] Relatórios de pagamentos

## Styling & UI
- [ ] Configurar paleta de cores (Azul Meia-Noite #0D2333, Azul Turquesa #06B2C9, Branco #F5F5F5)
- [ ] Logótipo EducaDQ na navbar
- [ ] Design responsivo (desktop, tablet, celular, smart TV)
- [ ] Componentes reutilizáveis
- [ ] Temas consistentes entre painéis

## Testing
- [ ] Testes unitários para procedures tRPC
- [ ] Testes de autenticação
- [ ] Testes de controle de acesso
- [ ] Testes de progresso
- [ ] Testes de avaliações

## Documentation & Deployment
- [ ] README.md com instruções de instalação
- [ ] Guia de configuração do Supabase
- [ ] Guia de deploy no Vercel
- [ ] Documentação da API
- [ ] Guia de variáveis de ambiente

## Final Delivery
- [ ] Checkpoint final do projeto
- [ ] Entrega dos arquivos ao usuário
