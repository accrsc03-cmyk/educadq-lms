# 🚀 Guia de Setup GitHub - EducaDQ

Siga este guia para fazer push do código para GitHub e preparar para deploy no Vercel.

---

## 📋 PASSO 1: CRIAR REPOSITÓRIO NO GITHUB

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: educadq-ead
   - **Description**: Plataforma EAD EducaDQ - Educação a Distância
   - **Visibility**: Private (recomendado para código comercial)
   - **Initialize repository**: Deixe desmarcado
3. Clique em **"Create repository"**

---

## 🔑 PASSO 2: CONFIGURAR GIT LOCALMENTE

### Se você nunca usou Git antes:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@gmail.com"
```

### Gerar Token de Acesso (Recomendado)

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Preencha:
   - **Note**: educadq-ead-token
   - **Expiration**: 90 days
   - **Select scopes**: Marque `repo` (acesso completo ao repositório)
4. Clique em **"Generate token"**
5. **Copie o token** (você não verá novamente)

---

## 📤 PASSO 3: FAZER PUSH DO CÓDIGO

### No seu terminal/prompt de comando:

```bash
# Navegue até a pasta do projeto
cd /home/ubuntu/educadq-ead

# Inicialize o repositório Git
git init

# Adicione o repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/educadq-ead.git

# Adicione todos os arquivos
git add .

# Crie o primeiro commit
git commit -m "Initial commit: Plataforma EAD EducaDQ completa"

# Faça push para GitHub
git branch -M main
git push -u origin main
```

### Se pedir senha:
- **Username**: Seu usuário do GitHub
- **Password**: Cole o token que você gerou (não a senha do GitHub)

---

## ✅ PASSO 4: VERIFICAR NO GITHUB

1. Acesse seu repositório: https://github.com/SEU_USUARIO/educadq-ead
2. Você deve ver todos os arquivos do projeto
3. Verifique se há um arquivo `.env` (não deve estar no repositório por segurança)

### Se o .env foi enviado (PROBLEMA DE SEGURANÇA):

```bash
# Remova o arquivo do repositório (mas mantenha localmente)
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from repository"
git push
```

---

## 🔐 PASSO 5: CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL

Quando você fizer deploy no Vercel, será necessário adicionar as variáveis de ambiente:

**Variáveis necessárias:**
- `DATABASE_URL`: postgresql://postgres:EducaDQ@2026@db.uvpdbpdqdticzigvvtww.supabase.co:5432/postgres
- `SMTP_HOST`: smtp.gmail.com
- `SMTP_PORT`: 587
- `SMTP_USER`: educadq01@gmail.com
- `SMTP_PASSWORD`: jrkp jjet lnrt mxjk
- `JWT_SECRET`: (gerado automaticamente pelo Manus)
- Outras variáveis OAuth (fornecidas pelo Manus)

---

## 📝 PASSO 6: CRIAR ARQUIVO .gitignore (se não existir)

Crie um arquivo `.gitignore` na raiz do projeto com:

```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
.DS_Store
*.log
.vite/
.next/
```

---

## 🎯 PRÓXIMO PASSO

Após fazer push para GitHub, você está pronto para fazer deploy no Vercel!

Siga o guia: `GUIA_VERCEL_DEPLOY.md`

---

## ❓ DÚVIDAS FREQUENTES

**P: Posso usar HTTPS em vez de token?**
R: Sim, mas token é mais seguro. Use `git credential-osxkeychain` (Mac) ou `git credential-manager` (Windows).

**P: Como faço para atualizar o repositório?**
R: Após fazer mudanças locais:
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

**P: Posso tornar o repositório público depois?**
R: Sim, vá em Settings → Visibility → Change visibility to Public
