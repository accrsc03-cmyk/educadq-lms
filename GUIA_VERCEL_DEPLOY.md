# 🚀 Guia de Deploy Vercel - EducaDQ

Siga este guia para fazer deploy da plataforma no Vercel (hospedagem gratuita).

---

## 📋 PASSO 1: CRIAR CONTA NO VERCEL

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize o Vercel a acessar sua conta GitHub
4. Preencha seu email e confirme

---

## 🔗 PASSO 2: IMPORTAR REPOSITÓRIO

1. Acesse: https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Procure por **"educadq-ead"** na lista de repositórios
4. Clique em **"Import"**

---

## ⚙️ PASSO 3: CONFIGURAR VARIÁVEIS DE AMBIENTE

Na página de configuração do Vercel:

1. Clique em **"Environment Variables"**
2. Adicione cada variável:

### Variáveis do Banco de Dados:
```
DATABASE_URL = postgresql://postgres:EducaDQ@2026@db.uvpdbpdqdticzigvvtww.supabase.co:5432/postgres
```

### Variáveis de Email SMTP:
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = educadq01@gmail.com
SMTP_PASSWORD = jrkp jjet lnrt mxjk
EMAIL_FROM = educadq01@gmail.com
EMAIL_PROVIDER = smtp
```

### Variáveis de Segurança:
```
JWT_SECRET = seu-secret-aleatorio-aqui-minimo-32-caracteres
```

### Variáveis OAuth (do Manus):
```
VITE_APP_ID = (fornecido pelo Manus)
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://oauth.manus.im
OWNER_OPEN_ID = (seu ID do Manus)
OWNER_NAME = EducaDQ
```

### Variáveis de Armazenamento (Manus):
```
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = (fornecido pelo Manus)
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY = (fornecido pelo Manus)
```

---

## 🚀 PASSO 4: FAZER DEPLOY

1. Clique em **"Deploy"**
2. Aguarde 2-5 minutos enquanto o Vercel constrói e faz deploy
3. Quando terminar, você verá uma mensagem de sucesso
4. Clique em **"Visit"** para acessar a plataforma

---

## 🌐 PASSO 5: ACESSAR A PLATAFORMA

Após o deploy, você terá uma URL como:
```
https://educadq-ead.vercel.app
```

Acesse essa URL e teste:
- ✅ Login funcionando
- ✅ Dashboard carregando
- ✅ Banco de dados conectado
- ✅ Email sendo enviado

---

## 🔄 PASSO 6: CONFIGURAR DEPLOY AUTOMÁTICO

O Vercel já está configurado para fazer deploy automático:
- Sempre que você fizer `git push` para `main`, o Vercel faz deploy automaticamente
- Você pode acompanhar o progresso em https://vercel.com/dashboard

---

## 🆘 TROUBLESHOOTING

### Erro: "Build failed"
- Verifique se todas as variáveis de ambiente estão corretas
- Verifique se o banco de dados está acessível
- Veja os logs em "Deployments" → "Logs"

### Erro: "Database connection refused"
- Verifique se a CONNECTION STRING está correta
- Verifique se o Supabase está online
- Teste a conexão localmente com `pnpm db:push`

### Erro: "SMTP connection failed"
- Verifique se as credenciais do Gmail estão corretas
- Verifique se a senha de app foi gerada corretamente
- Teste o email localmente

### Erro: "OAuth failed"
- Verifique se as variáveis OAuth estão corretas
- Verifique se o callback URL está configurado no Manus

---

## 📊 MONITORAR PERFORMANCE

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em **"Analytics"** para ver:
   - Tempo de resposta
   - Taxa de erro
   - Requisições por segundo

---

## 🔐 SEGURANÇA EM PRODUÇÃO

**Checklist de segurança:**
- [ ] Variáveis de ambiente não estão no repositório
- [ ] Banco de dados tem backup automático
- [ ] Email Service está funcionando
- [ ] HTTPS está ativado (automático no Vercel)
- [ ] Rate limiting está ativo
- [ ] Senhas estão criptografadas

---

## 📝 PRÓXIMO PASSO

Após validar que tudo está funcionando no Vercel, configure seu domínio personalizado!

Siga o guia: `GUIA_DOMINIO_REGISTROBR.md`

---

## 💡 DICAS

**Para atualizar o código em produção:**
```bash
# Faça mudanças locais
# Commit e push
git add .
git commit -m "Descrição das mudanças"
git push origin main

# Vercel faz deploy automaticamente em 2-5 minutos
```

**Para reverter para uma versão anterior:**
1. Acesse https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em "Deployments"
4. Clique em "Redeploy" na versão que deseja restaurar

**Para aumentar performance:**
- Use CDN para servir imagens (já configurado no Vercel)
- Comprima imagens antes de fazer upload
- Use lazy loading para componentes pesados
