# 🚀 Deploy Task Manager na Vercel

## 📋 Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta na Vercel (gratuita)
- [ ] Conta no Railway (gratuita) - para o backend

## 🎯 Estratégia de Deploy

**Frontend (React)** → Vercel (gratuito)
**Backend (Node.js)** → Railway (gratuito)

---

## 🔧 Passo a Passo

### **1. Preparar o Repositório**

```bash
# Fazer commit das mudanças
git add .
git commit -m "feat: configuração para deploy em produção"
git push origin main
```

### **2. Deploy do Backend no Railway**

1. **Acesse:** https://railway.app
2. **Login** com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione** seu repositório `Task_Manager`
5. **Root Directory:** `backend`
6. **Configure as variáveis de ambiente:**

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=seu-jwt-secret-super-seguro-aqui-256-bits
JWT_REFRESH_SECRET=seu-jwt-refresh-secret-super-seguro-aqui-256-bits
DATABASE_URL=postgresql://[gerado automaticamente pelo Railway]
FRONTEND_URL=https://seu-frontend.vercel.app
```

7. **Aguarde o deploy** (Railway criará banco PostgreSQL automaticamente)
8. **Copie a URL** do seu backend: `https://seu-backend.railway.app`

### **3. Configurar Banco de Dados**

No terminal do Railway (ou localmente):

```bash
# Gerar cliente Prisma para PostgreSQL
npx prisma generate

# Aplicar migrações
npx prisma migrate deploy

# Opcional: Popular banco com dados iniciais
npm run db:seed
```

### **4. Deploy do Frontend na Vercel**

1. **Acesse:** https://vercel.com
2. **Login** com GitHub  
3. **New Project** → **Import** seu repositório
4. **Root Directory:** `frontend`
5. **Framework Preset:** Vite
6. **Configure variáveis de ambiente:**

```env
VITE_API_URL=https://seu-backend.railway.app/api
```

7. **Deploy!**

### **5. Configurar Domínio Personalizado (Opcional)**

Na Vercel:
- **Settings** → **Domains**
- **Add Domain** → `seu-dominio.com`

---

## ✅ Verificação

### **Teste o Frontend:**
- ✅ Página carrega
- ✅ Login/Registro funciona
- ✅ Dashboard exibe dados
- ✅ CRUD de tarefas funciona

### **Teste o Backend:**
- ✅ `https://seu-backend.railway.app/api/health` retorna status
- ✅ APIs respondem corretamente
- ✅ CORS configurado para frontend

---

## 🔒 Segurança

### **Variáveis Críticas:**

⚠️ **NUNCA commite essas variáveis:**
- `JWT_SECRET` (256+ caracteres aleatórios)
- `JWT_REFRESH_SECRET` (256+ caracteres aleatórios)
- `DATABASE_URL` (gerado pelo Railway)

### **Gerar Secrets Seguros:**

```bash
# No terminal (Linux/Mac)
openssl rand -base64 32

# No PowerShell (Windows)
[System.Web.Security.Membership]::GeneratePassword(32,4)
```

---

## 🐛 Troubleshooting

### **Erro de CORS:**
- Verifique `FRONTEND_URL` no backend
- Confirme URL exata da Vercel (com https://)

### **Erro de Conectividade:**
- Verifique `VITE_API_URL` no frontend
- Confirme URL do Railway (com https://)

### **Banco de dados:**
- Verifique se migrações foram aplicadas
- Confirme `DATABASE_URL` no Railway

---

## 📊 Monitoramento

### **Railway (Backend):**
- Logs em tempo real
- Métricas de performance
- Alertas automáticos

### **Vercel (Frontend):**
- Analytics de performance
- Logs de deploy
- Monitoring de uptime

---

## 💰 Custos

### **Plano Gratuito:**
- **Railway:** 500 horas/mês, 1GB RAM
- **Vercel:** 100GB bandwidth, builds ilimitados

### **Upgrade Necessário:**
- Railway Pro: $5/mês (uso contínuo)
- Vercel Pro: $20/mês (features avançadas)

---

## 🚀 Performance

### **Otimizações:**
- Frontend: Build otimizado automaticamente
- Backend: PostgreSQL mais rápido que SQLite
- CDN: Vercel Edge Network global

### **Backup:**
- Railway: Backup automático do PostgreSQL
- Código: GitHub como backup

---

Agora você está pronto para fazer deploy! 🎉
