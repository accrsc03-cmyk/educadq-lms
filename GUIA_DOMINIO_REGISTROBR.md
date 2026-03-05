# 🌐 Guia de Configuração de Domínio RegistroBr - EducaDQ

Siga este guia para apontar seu domínio `educadq-ead.com.br` para a plataforma no Vercel.

---

## 📋 PASSO 1: ACESSAR PAINEL REGISTROBR

1. Acesse: https://www.registrobr.com.br
2. Faça login com suas credenciais
3. Vá em **"Meus Domínios"** ou **"Gerenciar Domínios"**
4. Procure por **"educadq-ead.com.br"** na lista
5. Clique em **"Gerenciar"** ou **"Configurar DNS"**

---

## 🔗 PASSO 2: OBTER INFORMAÇÕES DO VERCEL

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto **"educadq-ead"**
3. Vá em **"Settings"** → **"Domains"**
4. Clique em **"Add Domain"**
5. Digite: `educadq-ead.com.br`
6. Clique em **"Add"**

Você verá uma mensagem com as opções:
- **Nameservers** (recomendado)
- **CNAME** (alternativa)

---

## 🔧 PASSO 3: CONFIGURAR NAMESERVERS (RECOMENDADO)

### No Vercel:
1. Copie os **Nameservers** fornecidos pelo Vercel:
   - `ns1.vercel.com`
   - `ns2.vercel.com`

### No RegistroBr:
1. Vá em **"Gerenciar DNS"** do seu domínio
2. Procure por **"Nameservers"** ou **"Servidores de Nomes"**
3. Remova os nameservers atuais
4. Adicione os nameservers do Vercel:
   ```
   ns1.vercel.com
   ns2.vercel.com
   ```
5. Clique em **"Salvar"** ou **"Confirmar"**

**Importante**: A propagação pode levar até **24-48 horas**. Você pode verificar o status em https://vercel.com/dashboard → seu projeto → Domains

---

## 🔀 PASSO 4: ALTERNATIVA - CONFIGURAR CNAME (Se Nameservers não funcionar)

### No Vercel:
1. Copie o **CNAME** fornecido (algo como `cname.vercel-dns.com`)

### No RegistroBr:
1. Vá em **"Gerenciar DNS"** do seu domínio
2. Procure por **"Registros DNS"** ou **"Records"**
3. Adicione um novo registro:
   - **Tipo**: CNAME
   - **Nome**: educadq-ead (ou deixe em branco para raiz)
   - **Valor**: Cole o CNAME do Vercel
   - **TTL**: 3600 (padrão)
4. Clique em **"Adicionar"** ou **"Salvar"**

5. Se precisar da raiz (`educadq-ead.com.br` sem www):
   - **Tipo**: A
   - **Nome**: @ (ou deixe em branco)
   - **Valor**: `76.76.19.89` (IP do Vercel)

---

## ✅ PASSO 5: VERIFICAR CONFIGURAÇÃO

### No Vercel:
1. Acesse https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em **"Settings"** → **"Domains"**
4. Procure por `educadq-ead.com.br`
5. Verifique se o status é **"Valid Configuration"** (pode levar 24h)

### Teste Local:
Abra o terminal e execute:
```bash
nslookup educadq-ead.com.br
```

Você deve ver os nameservers do Vercel na resposta.

---

## 🌍 PASSO 6: ACESSAR COM DOMÍNIO PERSONALIZADO

Após a propagação DNS (até 48 horas), você poderá acessar:
```
https://educadq-ead.com.br
```

---

## 🔐 PASSO 7: ATIVAR HTTPS

O HTTPS é ativado automaticamente pelo Vercel. Você verá:
- ✅ Cadeado verde na barra de endereço
- ✅ URL começa com `https://`

Se não aparecer, aguarde mais 24 horas para a propagação DNS completar.

---

## 🆘 TROUBLESHOOTING

### Domínio não funciona após 24h
1. Verifique se os nameservers foram salvos corretamente no RegistroBr
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Aguarde mais 24 horas (propagação completa)
4. Teste em outro navegador/dispositivo

### Erro "Domain not found"
- Verifique se digitou o domínio corretamente no Vercel
- Verifique se o domínio está registrado e ativo no RegistroBr

### Erro "SSL certificate not valid"
- Aguarde 24-48 horas para o certificado ser emitido
- Limpe o cache do navegador

### Vercel diz "Invalid Configuration"
- Verifique se os nameservers estão corretos
- Aguarde a propagação DNS (até 48 horas)
- Teste com `nslookup educadq-ead.com.br`

---

## 📝 CONFIGURAÇÕES ADICIONAIS (OPCIONAL)

### Adicionar www
Se quiser que `www.educadq-ead.com.br` também funcione:

1. No Vercel, adicione outro domínio: `www.educadq-ead.com.br`
2. Configure o CNAME da mesma forma

### Redirecionar www para não-www
1. No RegistroBr, crie um CNAME:
   - **Nome**: www
   - **Valor**: educadq-ead.com.br

---

## 🎯 PRÓXIMOS PASSOS

Parabéns! Sua plataforma está no ar em `https://educadq-ead.com.br`

**Próximas ações:**
1. Teste a plataforma com dados reais
2. Configure backups automáticos do banco de dados
3. Monitore performance em https://vercel.com/analytics
4. Configure alertas de erro
5. Promova a plataforma nas redes sociais

---

## 💡 DICAS IMPORTANTES

**Backup do banco de dados:**
- Supabase faz backup automático diariamente
- Você pode fazer backup manual em https://supabase.com → seu projeto → Backups

**Monitoramento:**
- Configure alertas no Vercel para erros
- Monitore performance em https://vercel.com/analytics

**Segurança:**
- Mantenha as variáveis de ambiente seguras
- Não compartilhe senhas ou tokens
- Use 2FA no GitHub e Vercel

**Performance:**
- Use CDN para servir imagens (automático no Vercel)
- Comprima imagens antes de fazer upload
- Monitore o tempo de carregamento
