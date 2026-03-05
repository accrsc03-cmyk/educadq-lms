# 🚀 Guia Completo de Deploy - EducaDQ EAD

## Status Atual
- ✅ Código 100% pronto
- ✅ Banco de dados Supabase configurado
- ✅ Email SMTP configurado
- ✅ 43 testes passando
- ✅ TypeScript sem erros
- ✅ Domínio educadq-ead.com.br adquirido

---

## ETAPA 1: Preparar GitHub

### 1.1 Criar Repositório no GitHub
1. Acesse https://github.com/new
2. Nome do repositório: `educadq-ead`
3. Descrição: "Plataforma EAD EducaDQ - Educação a Distância"
4. Selecione: **Private** (privado)
5. Clique em "Create repository"

### 1.2 Fazer Push do Código
```bash
cd /home/ubuntu/educadq-ead
git init
git add .
git commit -m "Initial commit: EducaDQ EAD Platform"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/educadq-ead.git
git push -u origin main
```

---

## ETAPA 2: Deploy no Vercel

### 2.1 Conectar Vercel ao GitHub
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Conecte sua conta GitHub
5. Selecione o repositório `educadq-ead`

### 2.2 Configurar Variáveis de Ambiente
No painel do Vercel, vá em **Settings → Environment Variables** e adicione:

```
DATABASE_URL=postgresql://postgres:[EducaDQ@2026]@db.uvpdbpdqdticzigvvtww.supabase.co:5432/postgres
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=educadq01@gmail.com
SMTP_PASSWORD=jrkp jjet lnrt mxjk
SMTP_SECURE=false
JWT_SECRET=[GERAR_NOVO_VALOR_SEGURO]
VITE_APP_ID=[COPIAR_DO_MANUS]
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/oauth
OWNER_OPEN_ID=[COPIAR_DO_MANUS]
OWNER_NAME=EducaDQ
```

### 2.3 Deploy
1. Clique em "Deploy"
2. Aguarde 3-5 minutos
3. Seu site estará em: `https://educadq-ead.vercel.app`

---

## ETAPA 3: Configurar Domínio Personalizado

### 3.1 No Vercel
1. Vá em **Settings → Domains**
2. Adicione: `educadq-ead.com.br`
3. Copie os registros DNS fornecidos

### 3.2 No RegistroBr
1. Acesse https://www.registro.br
2. Faça login em sua conta
3. Vá em "Meus Domínios"
4. Selecione `educadq-ead.com.br`
5. Clique em "Gerenciar DNS"
6. Adicione os registros DNS do Vercel:
   - Tipo: `CNAME`
   - Nome: `www`
   - Valor: `cname.vercel-dns.com`
   - Tipo: `A`
   - Nome: `@`
   - Valor: `76.76.19.89`

### 3.3 Aguardar Propagação
- Pode levar até 24 horas
- Verifique em: https://dnschecker.org

---

## ETAPA 4: Banco de Dados Supabase

### 4.1 Criar Tabelas (Já Feito)
As tabelas já foram criadas automaticamente via Drizzle ORM.

### 4.2 Verificar Conexão
```bash
cd /home/ubuntu/educadq-ead
pnpm db:push
```

### 4.3 Backup Automático
1. No Supabase, vá em **Database → Backups**
2. Ative backups automáticos diários

---

## ETAPA 5: Variáveis de Ambiente Importantes

### JWT_SECRET (Gerar Novo)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Checklist Final
- [ ] GitHub repositório criado e código enviado
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Domínio apontando para Vercel
- [ ] Supabase com backups ativados
- [ ] Email SMTP testado
- [ ] Testes passando (43/43)

---

## ETAPA 6: Pós-Deploy - Testes

### 6.1 Testar Landing Page
- [ ] Acessar https://educadq-ead.com.br
- [ ] Verificar carregamento
- [ ] Clicar em "Explorar Cursos"
- [ ] Clicar em botão WhatsApp

### 6.2 Testar Login
- [ ] Clicar em "Login"
- [ ] Fazer login com conta Manus
- [ ] Verificar redirecionamento para dashboard

### 6.3 Testar Admin
- [ ] Acessar /admin
- [ ] Verificar estatísticas
- [ ] Clicar em "Novo Curso"
- [ ] Preencher formulário
- [ ] Criar curso

### 6.4 Testar Banco de Dados
- [ ] Acessar Supabase
- [ ] Verificar tabelas criadas
- [ ] Verificar dados inseridos

---

## Troubleshooting

### Erro 404 na página de novo curso
- Verificar rota em App.tsx
- Confirmar componente CreateCoursePage.tsx existe

### Banco de dados não conecta
- Verificar DATABASE_URL no Vercel
- Testar conexão: `psql [CONNECTION_STRING]`

### Email não envia
- Verificar credenciais SMTP
- Testar com: `curl -X POST https://seu-site.com/api/trpc/notifications.send`

### Domínio não aponta
- Verificar DNS em dnschecker.org
- Aguardar propagação (até 24h)
- Limpar cache do navegador

---

## Contato e Suporte

**EducaDQ**
- WhatsApp: 41 98891-3431
- Email: educadq01@gmail.com
- Domínio: educadq-ead.com.br

---

**Última atualização:** 05/03/2026
**Status:** Pronto para Deploy
