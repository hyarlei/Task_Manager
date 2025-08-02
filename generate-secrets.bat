@echo off
echo Gerando JWT Secrets seguros...
echo.

echo JWT_SECRET:
powershell -Command "[System.Web.Security.Membership]::GeneratePassword(64,16)"

echo.
echo JWT_REFRESH_SECRET:
powershell -Command "[System.Web.Security.Membership]::GeneratePassword(64,16)"

echo.
echo Copie esses valores para as variaveis de ambiente no Railway!
pause
