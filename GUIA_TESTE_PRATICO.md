# 🧪 Guia de Teste Prático - EducaDQ

Siga este guia para testar a plataforma com dados reais e validar todos os fluxos.

---

## 📋 PASSO 1: ACESSAR A PLATAFORMA

1. Acesse: `https://educaqead-ur5c7ams.manus.space`
2. Clique em **"Login"** no canto superior direito
3. Faça login com sua conta Manus
4. Você será redirecionado como **ADMIN**

---

## 👥 PASSO 2: CRIAR USUÁRIOS (ALUNOS E PROFESSORES)

### Criar um Professor

1. Clique em **"Dashboard"** no topo
2. No menu lateral, clique em **"Usuários"**
3. Clique em **"Novo Usuário"**
4. Preencha:
   - **Nome**: João Silva
   - **Email**: joao@educadq.com.br
   - **Role**: Professor
5. Clique em **"Criar Usuário"**

### Criar um Aluno

1. Clique em **"Novo Usuário"** novamente
2. Preencha:
   - **Nome**: Maria Santos
   - **Email**: maria@educadq.com.br
   - **Role**: Aluno
3. Clique em **"Criar Usuário"**

---

## 📚 PASSO 3: CRIAR UM CURSO

1. No menu lateral, clique em **"Cursos"**
2. Clique em **"Novo Curso"**
3. Preencha os dados:
   - **Título**: Introdução a Python
   - **Descrição**: Aprenda Python do zero ao avançado
   - **Carga Horária**: 40
   - **Valor**: 199.90
   - **Nota Mínima**: 70
   - **Professor**: João Silva
   - **Parcelas Permitidas**: 3
   - **Capa**: Cole uma URL de imagem (ex: https://via.placeholder.com/400x300)
   - **Trailer**: https://www.youtube.com/watch?v=dQw4w9WgXcQ (ou deixe em branco)
4. Clique em **"Criar Curso"**

---

## 📖 PASSO 4: CRIAR AULAS

1. No menu lateral, clique em **"Aulas"**
2. Clique em **"Nova Aula"**
3. Preencha:
   - **Curso**: Introdução a Python
   - **Título**: Aula 1 - Variáveis e Tipos
   - **Tipo**: Texto
   - **Conteúdo**: Escreva um texto de exemplo
   - **Ordem**: 1
4. Clique em **"Criar Aula"**

### Criar uma Aula de Vídeo

1. Clique em **"Nova Aula"** novamente
2. Preencha:
   - **Curso**: Introdução a Python
   - **Título**: Aula 2 - Funções
   - **Tipo**: Vídeo
   - **URL do Vídeo**: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   - **Ordem**: 2
3. Clique em **"Criar Aula"**

### Criar uma Aula ao Vivo

1. Clique em **"Nova Aula"** novamente
2. Preencha:
   - **Curso**: Introdução a Python
   - **Título**: Aula 3 - Ao Vivo
   - **Tipo**: Ao Vivo
   - **URL do Google Meet**: https://meet.google.com/seu-codigo-aqui
   - **Data/Hora**: 2026-03-10 19:00
   - **Ordem**: 3
3. Clique em **"Criar Aula"**

---

## 📝 PASSO 5: CRIAR AVALIAÇÕES

1. No menu lateral, clique em **"Avaliações"**
2. Clique em **"Nova Avaliação"**
3. Preencha:
   - **Curso**: Introdução a Python
   - **Título**: Avaliação Final
   - **Tipo**: Final
   - **Nota Mínima**: 70
4. Clique em **"Criar Avaliação"**

### Adicionar Questões

1. Clique na avaliação criada
2. Clique em **"Adicionar Questão"**
3. Preencha:
   - **Pergunta**: O que é uma variável em Python?
   - **Alternativa A**: Um espaço na memória
   - **Alternativa B**: Uma função
   - **Alternativa C**: Um módulo
   - **Alternativa D**: Uma classe
   - **Alternativa E**: Um pacote
   - **Resposta Correta**: A
4. Clique em **"Adicionar Questão"**

---

## 💳 PASSO 6: CONFIGURAR PAGAMENTOS

1. No menu lateral, clique em **"Pagamentos"**
2. Clique em **"Nova Parcela"**
3. Preencha:
   - **Aluno**: Maria Santos
   - **Curso**: Introdução a Python
   - **Valor**: 66.63 (199.90 / 3)
   - **Data de Vencimento**: 2026-04-05
   - **Status**: Pendente
4. Clique em **"Criar Parcela"**

### Simular Pagamento

1. Clique na parcela criada
2. Altere o status para **"Pago"**
3. Clique em **"Salvar"**

---

## 📊 PASSO 7: GERAR RELATÓRIOS

1. No menu lateral, clique em **"Relatórios"**
2. Escolha o tipo de relatório:
   - **Cursos**: Vê taxa de conclusão
   - **Alunos**: Vê progresso de cada aluno
   - **Pagamentos**: Vê status de pagamentos
3. Clique em **"Gerar Relatório"**
4. Clique em **"Baixar Excel"** para exportar

---

## 👨‍🎓 PASSO 8: TESTAR COMO ALUNO

1. Faça logout (clique em seu nome → Logout)
2. Faça login novamente com a conta do Manus
3. Clique em **"Painel do Aluno"** no menu
4. Você verá o curso "Introdução a Python"
5. Clique em **"Continuar"** para acessar as aulas
6. Complete as aulas na ordem (bloqueadas sequencialmente)
7. Realize a avaliação final
8. Veja seu progresso atualizado em tempo real

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Usuários criados com sucesso
- [ ] Curso criado com todas as informações
- [ ] Aulas de diferentes tipos criadas (texto, vídeo, ao vivo)
- [ ] Avaliações criadas com questões
- [ ] Parcelas de pagamento criadas
- [ ] Relatórios gerados e exportados
- [ ] Fluxo de aluno testado completamente
- [ ] Progresso atualizado em tempo real
- [ ] Email de notificação de vencimento recebido

---

## 🐛 TROUBLESHOOTING

**Problema**: Aula não aparece para o aluno
- **Solução**: Verifique se a aula está ativa e se o aluno tem acesso ao curso

**Problema**: Avaliação não salva
- **Solução**: Certifique-se de que todas as questões têm resposta correta definida

**Problema**: Email não chega
- **Solução**: Verifique a pasta de spam e confirme que o Email Service está configurado

---

**Parabéns! Você testou com sucesso toda a plataforma EducaDQ! 🎉**
