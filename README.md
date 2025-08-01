# 📋 Task Manager - Sistema de Gerenciamento de Tarefas

<div align="center">

![Task Manager Logo](https://img.shields.io/badge/Task-Manager-blue?style=for-the-badge&logo=checkmarx&logoColor=white)

**Sistema completo de gerenciamento de tarefas construído com React, TypeScript, Node.js e PostgreSQL**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

## ✨ Características

- 🔐 **Autenticação JWT** - Sistema seguro de login e registro
- 📊 **Dashboard Completo** - Estatísticas e visão geral das tarefas
- ✅ **Gestão de Tarefas** - CRUD completo com status e prioridades
- 🏷️ **Categorias** - Organize tarefas em categorias coloridas
- 📱 **Design Responsivo** - Interface adaptável para todos os dispositivos
- 🎨 **UI Moderna** - Design clean com Tailwind CSS
- ⚡ **Performance** - Otimizado com React Query e lazy loading
- 🔍 **Busca e Filtros** - Encontre tarefas rapidamente
- 📈 **Relatórios** - Acompanhe sua produtividade

## 🚀 Tecnologias

### Backend
- **Node.js** + **TypeScript** - Runtime e linguagem
- **Express.js** - Framework web
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de schemas
- **bcryptjs** - Hash de senhas

### Frontend
- **React** + **TypeScript** - UI Library
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **React Query** - State management server
- **Zustand** - State management client
- **React Hook Form** - Gerenciamento de formulários
- **Headless UI** - Componentes acessíveis

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 13+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/task-manager.git
cd task-manager
```

### 2. Configure o Backend
```bash
cd backend

# Instale as dependências
npm install

# Configure o banco de dados
cp .env.example .env
# Edite o .env com suas configurações do PostgreSQL

# Execute as migrações
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate

# Popule o banco com dados de exemplo
npm run db:seed

# Inicie o servidor
npm run dev
```

### 3. Configure o Frontend
```bash
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🔧 Configuração

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🎯 Como Usar

### 1. Acesse a aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

### 2. Conta Demo
Use a conta demo para testar:
- **Email**: `demo@taskmanager.com`
- **Senha**: `demo123`

### 3. Funcionalidades
- **Dashboard**: Visualize estatísticas e tarefas recentes
- **Tarefas**: Crie, edite e gerencie suas tarefas
- **Categorias**: Organize tarefas por categoria
- **Perfil**: Gerencie suas informações pessoais

## 📁 Estrutura do Projeto

```
task-manager/
├── backend/                 # API Node.js
│   ├── prisma/             # Schema e migrações
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   └── server.ts       # Servidor principal
│   └── package.json
├── frontend/               # React App
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── store/          # Estado global
│   │   └── types/          # Tipos TypeScript
│   └── package.json
└── README.md
```

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run dev        # Desenvolvimento
npm run build      # Build para produção
npm run start      # Iniciar em produção
npm run db:generate # Gerar Prisma Client
npm run db:push    # Sincronizar schema
npm run db:migrate # Executar migrações
npm run db:seed    # Popular banco com dados
npm run db:studio  # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev        # Desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview da build
npm run lint       # Executar ESLint
```

## 🔄 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário atual
- `POST /api/auth/refresh` - Refresh token

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `GET /api/tasks/:id` - Obter tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa
- `GET /api/tasks/stats/overview` - Estatísticas

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

## 🏗️ Deploy

### Backend (Railway/Heroku)
1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Configure o comando start: `npm start`

### Frontend (Vercel/Netlify)
1. Configure a variável `VITE_API_URL`
2. Execute `npm run build`
3. Deploy da pasta `dist/`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Hyarlei Freitas**

- GitHub: [@hyarlei-freitas](https://github.com/hyarlei-freitas)
- LinkedIn: [Hyarlei Freitas](https://linkedin.com/in/hyarlei-freitas)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

</div>
