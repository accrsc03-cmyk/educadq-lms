# EducaDQ - Plataforma de Educação a Distância

![EducaDQ](https://img.shields.io/badge/EducaDQ-EAD-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

## 📚 Sobre

EducaDQ é uma plataforma moderna de educação a distância (EAD) desenvolvida para o Centro de Formação e Estudos sobre Álcool e outras Drogas LTDA. A plataforma oferece:

- **Gestão completa de cursos** com suporte a múltiplos tipos de aulas
- **Sistema de avaliações** com distribuição automática de respostas
- **Controle de progresso** com bloqueio sequencial de aulas
- **Sistema de parcelamento** com alertas automáticos de pagamento
- **Proteção anticompartilhamento** com detecção de múltiplos IPs/dispositivos
- **Painéis específicos** para Admin, Professor e Aluno
- **Relatórios em Excel** para análise de dados
- **Interface responsiva** para desktop, tablet, celular e smart TV

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca UI moderna
- **Next.js** - Framework React com SSR
- **Tailwind CSS 4** - Utilitários CSS
- **TypeScript** - Tipagem estática
- **Wouter** - Roteamento leve

### Backend
- **Express.js** - Servidor Node.js
- **tRPC 11** - RPC type-safe
- **Drizzle ORM** - ORM moderno
- **PostgreSQL** - Banco de dados

### Hospedagem
- **Vercel** - Frontend
- **Supabase** - Backend + Database
- **GitHub Actions** - CI/CD

## 📋 Funcionalidades Implementadas

### ✅ Autenticação e Segurança
- [x] Autenticação OAuth 2.0 com 3 níveis de acesso
- [x] Proteção anticompartilhamento (detecção de IP/dispositivo)
- [x] Bloqueio de sessões paralelas
- [x] Proteção de conteúdo (anti-copy, anti-print, anti-inspect)

### ✅ Gestão de Cursos
- [x] Cadastro completo de cursos
- [x] Suporte a múltiplos tipos de aulas (vídeo, texto, ao vivo)
- [x] Materiais complementares via Google Drive
- [x] Trailers do YouTube

### ✅ Controle de Progresso
- [x] Barra de progresso visual
- [x] Bloqueio sequencial de aulas
- [x] Rastreamento de conclusão

### ✅ Sistema de Avaliações
- [x] Avaliações múltipla escolha (5 alternativas)
- [x] Distribuição automática de respostas (20% cada)
- [x] Cálculo de pontuação
- [x] Aprovação por nota mínima

### ✅ Sistema de Pagamentos
- [x] Parcelamento configurável
- [x] Cálculo automático de vencimentos
- [x] Alertas de pagamento por email
- [x] Integração com PIX

### ✅ Painéis de Usuário
- [x] Painel do Admin (dashboard, gestão de cursos, relatórios)
- [x] Painel do Professor (cursos, aulas, avaliações)
- [x] Painel do Aluno (cursos, progresso, avaliações)

### ✅ Relatórios
- [x] Relatórios em Excel (.xlsx)
- [x] Dados de cursos, alunos, pagamentos e parcelas

## 🎨 Design

A plataforma segue a identidade visual da EducaDQ com:

- **Paleta de Cores**: Azul Meia-Noite (#0D2333), Azul Turquesa (#06B2C9), Branco (#F5F5F5)
- **Logotipo**: Preservado conforme especificações
- **Responsividade**: Desktop, Tablet, Celular, Smart TV
- **Tema**: Dark mode moderno e agradável

## 🔧 Instalação

### Pré-requisitos
- Node.js 22.13.0+
- pnpm 10.4.1+
- Conta no Supabase
- Conta no Vercel

### Setup Local

```bash
# Clonar repositório
git clone <seu-repositorio>
cd educadq-ead

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Executar migrations
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Build para produção
pnpm start            # Inicia servidor de produção

# Banco de dados
pnpm db:push          # Executa migrations
pnpm db:generate      # Gera tipos do schema

# Testes
pnpm test             # Executa testes unitários
pnpm test:watch       # Executa testes em modo watch

# Qualidade
pnpm format           # Formata código
pnpm check            # Verifica tipos TypeScript
```

## 📊 Estrutura do Projeto

```
educadq-ead/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilitários
│   └── public/            # Arquivos estáticos
├── server/                 # Backend Express
│   ├── routers/           # Procedures tRPC
│   ├── services/          # Serviços (email, relatórios)
│   ├── middleware/        # Middlewares
│   └── db.ts              # Database helpers
├── drizzle/               # Schema e migrations
├── shared/                # Código compartilhado
└── storage/               # S3 helpers
```

## 🔐 Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=seu-secret-super-seguro

# OAuth
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave

# Owner
OWNER_NAME=EducaDQ
OWNER_OPEN_ID=seu-open-id
```

## 🧪 Testes

A plataforma inclui testes unitários para:

- ✅ Procedures tRPC (Admin, Auth)
- ✅ Autenticação e logout
- ✅ Controle de acesso

Execute com:

```bash
pnpm test
```

## 📈 Deployment

### Vercel (Frontend)

1. Conecte seu repositório GitHub ao Vercel
2. Configure variáveis de ambiente
3. Deploy automático em cada push

### Supabase (Backend + Database)

1. Crie projeto no Supabase
2. Configure DATABASE_URL
3. Execute `pnpm db:push` para criar tabelas

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções detalhadas.

## 📧 Notificações

A plataforma envia notificações automáticas para:

- **Alunos**: Alertas de vencimento de parcelas
- **Professores**: Notificações de alunos aprovados
- **Admin**: Alertas de conclusão de cursos

Configure um provedor de email (SendGrid, AWS SES, etc.) em `server/services/emailService.ts`

## 🔄 Integração com Serviços Externos

### YouTube
- Integração de trailers de cursos
- Incorporação de vídeos nas aulas

### Google Drive
- Download de materiais complementares
- Acesso dentro da plataforma

### Google Meet
- Aulas ao vivo
- Links diretos nas aulas

### PIX
- Chave PIX para pagamentos
- Alertas com dados de pagamento

## 📱 Responsividade

A plataforma foi otimizada para:

- **Desktop** (1920px+)
- **Tablet** (768px - 1024px)
- **Celular** (320px - 767px)
- **Smart TV** (4K)

## 🚨 Troubleshooting

### Erro de conexão com banco de dados

```bash
# Verifique DATABASE_URL
echo $DATABASE_URL

# Teste conexão
psql $DATABASE_URL -c "SELECT 1"
```

### Testes falhando

```bash
# Limpe cache
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm test
```

### Build falhando

```bash
# Verifique tipos TypeScript
pnpm check

# Verifique erros de build
pnpm build
```

## 📚 Documentação

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia de deployment
- [PROGRESS.md](./PROGRESS.md) - Progresso do projeto
- [FUNCIONALIDADES_COMPLETAS.txt](./FUNCIONALIDADES_COMPLETAS.txt) - Lista completa de funcionalidades

## 🤝 Contribuindo

Para contribuir ao projeto:

1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para detalhes.

## 👥 Autores

- **EducaDQ** - Centro de Formação e Estudos sobre Álcool e outras Drogas LTDA
- **Desenvolvido por**: Arquiteto de Software Sênior

## 📞 Suporte

Para suporte e dúvidas:

- Email: suporte@educadq.com
- WhatsApp: 41 98891-3431
- Instagram: @educadq
- Facebook: @educadq
- YouTube: @educadq

## 🎯 Roadmap Futuro

- [ ] Certificados automáticos
- [ ] Integração com pagamentos online
- [ ] Aplicativo mobile (iOS/Android)
- [ ] Sistema de recomendação de cursos
- [ ] Gamificação (badges, pontos)
- [ ] Chat em tempo real
- [ ] Fórum de discussão
- [ ] Integração com LMS externos

---

**Desenvolvido com ❤️ para a EducaDQ**
