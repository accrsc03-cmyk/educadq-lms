# Guia de Deployment - EducaDQ EAD

## Visão Geral

A plataforma EducaDQ foi desenvolvida com as seguintes tecnologias:

- **Frontend**: Next.js + React 19 + Tailwind CSS 4
- **Backend**: Express.js + tRPC 11
- **Banco de Dados**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Hospedagem Recomendada**: Vercel (Frontend) + Supabase (Backend/DB)

## Pré-requisitos

- Node.js 22.13.0 ou superior
- pnpm 10.4.1 ou superior
- Conta no Supabase (https://supabase.com)
- Conta no Vercel (https://vercel.com)
- Git instalado

## Instalação Local

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd educadq-ead
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/educadq

# JWT Secret
JWT_SECRET=seu-secret-jwt-super-seguro-aqui

# OAuth
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend

# Owner Info
OWNER_NAME=EducaDQ
OWNER_OPEN_ID=seu-open-id

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id
```

### 4. Configurar banco de dados

```bash
# Criar migrations
pnpm db:push

# Seed inicial (opcional)
pnpm db:seed
```

### 5. Executar em desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

## Deployment no Vercel

### 1. Conectar repositório

1. Acesse https://vercel.com/new
2. Selecione seu repositório do GitHub
3. Clique em "Import"

### 2. Configurar variáveis de ambiente

No dashboard do Vercel:

1. Vá para "Settings" → "Environment Variables"
2. Adicione todas as variáveis do `.env.local`
3. Selecione os ambientes: Production, Preview, Development

### 3. Configurar build

1. **Framework Preset**: Next.js
2. **Build Command**: `pnpm build`
3. **Output Directory**: `.next`
4. **Install Command**: `pnpm install`

### 4. Deploy

Clique em "Deploy". O Vercel fará o build e deployment automaticamente.

## Configuração do Supabase

### 1. Criar projeto

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha os dados do projeto
4. Aguarde a criação

### 2. Obter credenciais

1. Vá para "Settings" → "Database"
2. Copie a connection string
3. Use em `DATABASE_URL`

### 3. Executar migrations

```bash
# No seu ambiente local
DATABASE_URL=sua-connection-string pnpm db:push
```

## Configuração de Email

Para enviar notificações de pagamento, configure um provedor de email:

### Opção 1: SendGrid

1. Crie uma conta em https://sendgrid.com
2. Gere uma API Key
3. Configure em `server/services/emailService.ts`

### Opção 2: AWS SES

1. Configure AWS SES
2. Obtenha credenciais
3. Configure em `server/services/emailService.ts`

## Segurança

### Variáveis Sensíveis

Nunca commite arquivos `.env` com dados sensíveis. Use:

```bash
# Para adicionar ao .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

### HTTPS

Vercel fornece HTTPS automaticamente. Para produção, sempre use HTTPS.

### CORS

Configure CORS em `server/_core/index.ts` conforme necessário:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

## Monitoramento

### Logs

- **Vercel**: Dashboard → Deployments → Logs
- **Supabase**: Dashboard → Logs
- **Local**: Verifique `.manus-logs/` durante desenvolvimento

### Performance

- Use Vercel Analytics para monitorar performance
- Configure alertas no Supabase para queries lentas

## Troubleshooting

### Erro: "DATABASE_URL not found"

```bash
# Verifique se a variável está configurada
echo $DATABASE_URL

# Se vazio, configure localmente
export DATABASE_URL=postgresql://...
```

### Erro: "Cannot find module"

```bash
# Reinstale dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Port already in use"

```bash
# Mude a porta
PORT=3001 pnpm dev
```

## Atualizações

### Atualizar dependências

```bash
pnpm update
pnpm db:push  # Se houver mudanças no schema
```

### Fazer deploy de atualizações

```bash
git push origin main  # Vercel fará deploy automaticamente
```

## Backup

### Backup do banco de dados

```bash
# Via Supabase Dashboard
# Settings → Backups → Create backup

# Ou via CLI
pg_dump $DATABASE_URL > backup.sql
```

### Restaurar backup

```bash
psql $DATABASE_URL < backup.sql
```

## Suporte

Para problemas:

1. Verifique os logs
2. Consulte a documentação do Supabase
3. Verifique a documentação do Vercel
4. Abra uma issue no repositório

## Próximos Passos

- [ ] Configurar integração com PIX
- [ ] Implementar certificados automáticos
- [ ] Adicionar aplicativo mobile
- [ ] Configurar CDN para mídia
- [ ] Implementar cache distribuído
