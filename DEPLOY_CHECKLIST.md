# ✅ Checklist de Deploy - Task Manager

## 📋 Antes do Deploy

### **Arquivos Criados/Atualizados:**
- [x] `frontend/vercel.json` - Configuração da Vercel
- [x] `frontend/.env.example` - Variáveis de ambiente do frontend
- [x] `backend/Procfile` - Configuração do Railway
- [x] `backend/.env.example` - Variáveis de ambiente do backend
- [x] `backend/package.json` - Scripts otimizados
- [x] `DEPLOY_GUIDE.md` - Guia completo de deploy

### **Preparação:**
- [ ] Commit e push de todas as mudanças
- [ ] Testar aplicação localmente uma última vez
- [ ] Verificar se não há erros TypeScript

## 🚀 Comandos para Deploy

### **1. Commit Final:**
```bash
git add .
git commit -m "feat: configuração completa para deploy em produção"
git push origin main
```

### **2. Deploy Backend (Railway):**
1. Acesse https://railway.app
2. Conecte GitHub → Selecione repositório
3. Configure Root Directory: `backend`
4. Adicione variáveis de ambiente (ver .env.example)
5. Deploy automático!

### **3. Deploy Frontend (Vercel):**
1. Acesse https://vercel.com  
2. Import repositório GitHub
3. Configure Root Directory: `frontend`
4. Framework: Vite
5. Adicione `VITE_API_URL` com URL do Railway
6. Deploy!

## 🔑 Variáveis de Ambiente Críticas

### **Backend (Railway):**
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=[GERAR NOVO - 32+ caracteres]
JWT_REFRESH_SECRET=[GERAR NOVO - 32+ caracteres]  
DATABASE_URL=[Automático pelo Railway]
FRONTEND_URL=https://[seu-dominio].vercel.app
```

### **Frontend (Vercel):**
```env
VITE_API_URL=https://[seu-backend].railway.app/api
```

## 🔒 Gerar Secrets (PowerShell):
```powershell
# JWT Secrets seguros
[System.Web.Security.Membership]::GeneratePassword(32,4)
```

## ✅ Verificação Pós-Deploy

### **Backend:**
- [ ] `https://[backend].railway.app/api/health` responde
- [ ] Logs do Railway sem erros
- [ ] Banco PostgreSQL criado automaticamente
- [ ] Migrações aplicadas com sucesso

### **Frontend:**  
- [ ] Site carrega em `https://[frontend].vercel.app`
- [ ] Login/registro funciona
- [ ] Dashboard exibe dados
- [ ] CRUD de tarefas operacional
- [ ] Console sem erros de CORS

## 🎯 URLs Finais

- **Frontend:** `https://[seu-projeto].vercel.app`
- **Backend API:** `https://[seu-projeto].railway.app/api`
- **Banco:** Gerenciado pelo Railway

## 🔧 Troubleshooting Rápido

### **Erro de CORS:**
Verifique `FRONTEND_URL` no backend = URL exata da Vercel

### **API não conecta:**
Verifique `VITE_API_URL` no frontend = URL exata do Railway + `/api`

### **500 Internal Error:**
Verifique logs no Railway, provavelmente JWT_SECRET não configurado

---

**🎉 Pronto! Seu Task Manager estará online em poucos minutos!**
