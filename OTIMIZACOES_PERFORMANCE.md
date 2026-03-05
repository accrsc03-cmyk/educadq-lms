# Otimizações de Performance - Versões Gratuitas

## 🚀 Supabase Free Tier (500MB)

### Estratégias de Otimização

**1. Índices de Banco de Dados**
```sql
-- Índices em campos de busca frequente
CREATE INDEX idx_courses_title ON courses(title);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_progress_user_course ON progress(user_id, course_id);
```

**2. Paginação de Resultados**
- Sempre usar LIMIT/OFFSET
- Máximo 50 registros por página
- Cache de primeira página

**3. Compressão de Dados**
- Armazenar vídeos no YouTube (não no Supabase)
- Armazenar materiais no Google Drive
- Comprimir imagens (máx 100KB)

**4. Limpeza Automática**
- Deletar sessões expiradas (7 dias)
- Arquivar cursos antigos
- Limpar logs mensalmente

---

## ⚡ Vercel Free Tier (100GB/mês banda)

### Estratégias de Otimização

**1. Code Splitting**
```typescript
// Lazy load de páginas pesadas
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EducationalAnalytics = lazy(() => import("./pages/EducationalAnalytics"));
```

**2. Image Optimization**
```typescript
// Usar Next.js Image component
<Image 
  src="/course-cover.jpg" 
  width={400} 
  height={300} 
  quality={75}
  priority={false}
/>
```

**3. Caching Estratégico**
- Cache de 1 hora para dados estáticos
- Cache de 5 minutos para dados dinâmicos
- Service Worker para offline

**4. Compressão de Assets**
- Gzip habilitado automaticamente
- Minificação de CSS/JS
- Tree-shaking de dependências não usadas

---

## 🔧 GitHub Free Tier (2000 min/mês Actions)

### Estratégias de Otimização

**1. Workflows Eficientes**
```yaml
# Executar testes apenas em mudanças relevantes
on:
  push:
    paths:
      - 'server/**'
      - 'client/**'
      - 'drizzle/**'
```

**2. Cache de Dependências**
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
```

**3. Testes Paralelos**
```yaml
# Executar testes em paralelo
strategy:
  matrix:
    test-suite: [unit, integration, e2e]
```

---

## 📊 Monitoramento de Limites

### Supabase
```bash
# Verificar uso de espaço
SELECT pg_size_pretty(pg_database_size('educadq'));

# Verificar conexões ativas
SELECT count(*) FROM pg_stat_activity;
```

### Vercel
- Dashboard: https://vercel.com/dashboard
- Monitorar: Bandwidth, Deployments, Functions

### GitHub
- Actions: https://github.com/settings/billing/summary
- Monitorar: Minutes used, Storage

---

## 🎯 Recomendações Finais

1. **Monitorar mensalmente** - Verificar uso de recursos
2. **Limpar dados antigos** - Manter banco otimizado
3. **Usar CDN** - Para imagens e assets estáticos
4. **Implementar rate limiting** - Evitar abuso de API
5. **Testes de carga** - Antes de grandes campanhas

---

## ⚠️ Sinais de Alerta

- Banco acima de 400MB
- Banda acima de 80GB/mês
- Tempo de resposta acima de 2s
- Mais de 500 conexões simultâneas

**Se atingir limites**, considere upgrade para planos pagos.
