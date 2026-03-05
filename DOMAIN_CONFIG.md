# Configuração de Domínio Personalizado - EducaDQ

## Domínio Adquirido

**Domínio**: `educadq-ead.com.br`  
**Registrador**: RegistroBr  
**Status**: Ativo

---

## Configuração do Domínio no Manus

Para apontar seu domínio personalizado para a plataforma EducaDQ hospedada no Manus, siga os passos abaixo:

### Passo 1: Acessar o Management UI do Manus

1. Abra o painel de controle do seu projeto no Manus
2. Clique em **Settings** → **Domains**

### Passo 2: Adicionar Domínio Personalizado

1. Clique em **Add Custom Domain**
2. Digite: `educadq-ead.com.br`
3. Clique em **Add**

### Passo 3: Configurar DNS no RegistroBr

O Manus fornecerá registros DNS para configurar. Você terá dois tipos de registros:

#### Opção A: CNAME (Recomendado)

1. Acesse o painel de controle do RegistroBr
2. Vá para **Gerenciar DNS** do domínio `educadq-ead.com.br`
3. Adicione um registro CNAME:
   - **Nome**: `www`
   - **Tipo**: CNAME
   - **Valor**: (fornecido pelo Manus, ex: `educaqead-ur5c7ams.manus.space`)

4. Para o domínio raiz (`educadq-ead.com.br`), você pode:
   - Usar um registro A apontando para o IP fornecido pelo Manus, OU
   - Usar um serviço de redirecionamento

#### Opção B: A Record (Alternativa)

Se o RegistroBr suportar, adicione um registro A:
- **Nome**: `@` (raiz)
- **Tipo**: A
- **Valor**: (IP fornecido pelo Manus)

### Passo 4: Verificar Propagação

1. Aguarde 24-48 horas para propagação DNS completa
2. Teste com: `nslookup educadq-ead.com.br`
3. Verifique no Manus se o domínio foi verificado com sucesso

---

## URLs de Acesso

| Tipo | URL |
|------|-----|
| **Domínio Personalizado** | https://educadq-ead.com.br |
| **Subdomínio WWW** | https://www.educadq-ead.com.br |
| **URL Manus (Backup)** | https://educaqead-ur5c7ams.manus.space |

---

## Configuração de SSL/TLS

O Manus fornece certificado SSL/TLS automaticamente para seu domínio personalizado. Não é necessária configuração adicional.

---

## Suporte

Se tiver dúvidas sobre a configuração:

1. **Manus Support**: https://help.manus.im
2. **RegistroBr Support**: https://www.registro.br/

---

## Checklist de Configuração

- [ ] Domínio adquirido no RegistroBr
- [ ] Acesso ao painel de controle do RegistroBr
- [ ] Acesso ao Management UI do Manus
- [ ] Registros DNS configurados
- [ ] Propagação DNS verificada (24-48h)
- [ ] SSL/TLS ativo
- [ ] Plataforma acessível via `educadq-ead.com.br`

---

**Data de Configuração**: 05 de Março de 2026  
**Domínio**: educadq-ead.com.br  
**Plataforma**: EducaDQ EAD
