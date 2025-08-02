@echo off
echo 🚀 Preparando projeto para deploy...

echo.
echo ✅ 1. Verificando status do git...
git status

echo.
echo ✅ 2. Adicionando arquivos...
git add .

echo.
echo ✅ 3. Fazendo commit...
git commit -m "feat: configuracao completa para deploy em producao"

echo.
echo ✅ 4. Enviando para GitHub...
git push origin main

echo.
echo 🎉 Projeto pronto para deploy!
echo.
echo 📋 Próximos passos:
echo 1. Acesse https://railway.app para deploy do backend
echo 2. Acesse https://vercel.com para deploy do frontend
echo 3. Configure as variáveis de ambiente conforme DEPLOY_CHECKLIST.md
echo.
pause
