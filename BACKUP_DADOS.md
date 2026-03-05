# Sistema de Backup Automático - EducaDQ

## 🔐 Estratégia de Backup

### 1. Backup Automático Supabase

O Supabase realiza backups automáticos:
- **Backup diário** - Retenção de 7 dias
- **Backup semanal** - Retenção de 4 semanas
- **Backup mensal** - Retenção de 12 meses

**Acessar backups:**
1. Vá para Supabase Dashboard
2. Selecione seu projeto
3. Settings → Backups
4. Escolha a data desejada

---

### 2. Backup Manual via GitHub

Fazer backup do código:
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/educadq-ead.git

# Criar branch de backup
git checkout -b backup-$(date +%Y-%m-%d)

# Fazer push
git push origin backup-$(date +%Y-%m-%d)
```

---

### 3. Exportar Dados (SQL)

**Exportar banco de dados completo:**
```bash
# Via Supabase CLI
supabase db pull

# Ou via psql
pg_dump postgresql://user:password@db.supabase.co:5432/postgres > backup.sql
```

**Restaurar dados:**
```bash
psql postgresql://user:password@db.supabase.co:5432/postgres < backup.sql
```

---

### 4. Backup de Arquivos

**Arquivos armazenados em:**
- Google Drive (materiais dos cursos)
- YouTube (vídeos)
- Supabase Storage (se usado)

**Fazer backup:**
1. Google Drive → Fazer download dos arquivos
2. YouTube → Manter URLs documentadas
3. Supabase Storage → Exportar via API

---

## 🤖 Automação com GitHub Actions

**Arquivo: `.github/workflows/backup.yml`**

```yaml
name: Backup Automático

on:
  schedule:
    - cron: '0 2 * * 0'  # Toda segunda-feira às 2h

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Exportar banco de dados
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          pg_dump $DATABASE_URL > backup-$(date +%Y-%m-%d).sql
      
      - name: Fazer upload do backup
        uses: actions/upload-artifact@v3
        with:
          name: database-backup
          path: backup-*.sql
          retention-days: 30
      
      - name: Commit e push
        run: |
          git config user.name "Backup Bot"
          git config user.email "backup@educadq.com.br"
          git add backup-*.sql
          git commit -m "Backup automático - $(date +%Y-%m-%d)" || true
          git push
```

---

## 📋 Checklist de Backup

### Semanal
- [ ] Verificar status do Supabase
- [ ] Confirmar último backup automático
- [ ] Testar restauração de backup

### Mensal
- [ ] Exportar dados SQL
- [ ] Fazer backup de arquivos Google Drive
- [ ] Documentar URLs de vídeos YouTube
- [ ] Verificar integridade dos dados

### Trimestral
- [ ] Teste completo de restauração
- [ ] Revisão de política de retenção
- [ ] Atualizar documentação de backup

---

## 🚨 Plano de Recuperação

**Se perder dados:**

1. **Identificar o problema**
   - Quando foi descoberto?
   - Qual período foi afetado?

2. **Restaurar backup**
   - Acessar Supabase Backups
   - Selecionar data anterior ao problema
   - Clicar em "Restore"

3. **Validar dados**
   - Verificar integridade
   - Comparar com backup alternativo
   - Testar funcionalidades críticas

4. **Comunicar aos usuários**
   - Informar sobre o incidente
   - Tempo de indisponibilidade
   - Dados recuperados

---

## 💾 Armazenamento Recomendado

| Tipo | Serviço | Frequência | Retenção |
|------|---------|-----------|----------|
| Banco de Dados | Supabase | Diária | 7 dias |
| Código | GitHub | Contínua | Ilimitada |
| Arquivos | Google Drive | Manual | Ilimitada |
| Vídeos | YouTube | Manual | Ilimitada |

---

## 📞 Suporte

Para dúvidas sobre backup:
- Email: suporte@educadq.com.br
- WhatsApp: 41 98891-3431
- Documentação: https://supabase.com/docs/guides/database/backups
