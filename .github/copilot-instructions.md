<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Task Manager - Sistema de Gerenciamento de Tarefas

Este é um projeto fullstack de gerenciamento de tarefas construído com as seguintes tecnologias:

## Backend
- **Node.js** com **TypeScript**
- **Express.js** para APIs REST
- **Prisma** como ORM
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **Zod** para validação
- **bcryptjs** para hash de senhas

## Frontend
- **React** com **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **React Router** para roteamento
- **React Query** para gerenciamento de estado server
- **Zustand** para gerenciamento de estado client
- **React Hook Form** com **Zod** para formulários
- **Headless UI** para componentes acessíveis

## Estrutura do Projeto

### Backend (`/backend`)
- `src/server.ts` - Servidor principal
- `src/routes/` - Rotas da API (auth, tasks, categories, users)
- `src/middleware/` - Middlewares (auth, error handling, rate limiting)
- `prisma/schema.prisma` - Schema do banco de dados
- `prisma/seed.ts` - Dados iniciais

### Frontend (`/frontend`)
- `src/pages/` - Páginas da aplicação
- `src/components/` - Componentes reutilizáveis
- `src/store/` - Gerenciamento de estado
- `src/services/` - Serviços de API
- `src/types/` - Tipos TypeScript

## Funcionalidades Implementadas

### Autenticação
- Login e registro de usuários
- JWT para sessões
- Proteção de rotas
- Conta demo disponível

### Dashboard
- Estatísticas de tarefas
- Tarefas recentes
- Gráficos de status

### Modelos de Dados
- **User**: Usuários do sistema
- **Task**: Tarefas com status, prioridade, data de vencimento
- **Category**: Categorias para organizar tarefas

## Padrões de Código

1. **TypeScript rigoroso** - Sempre tipado
2. **Validação com Zod** - Tanto no frontend quanto backend
3. **Error Handling** - Tratamento de erros consistente
4. **Responsividade** - Design mobile-first
5. **Acessibilidade** - Componentes acessíveis
6. **SEO-friendly** - Meta tags e estrutura semântica

## Scripts Disponíveis

### Backend
- `npm run dev` - Desenvolvimento
- `npm run build` - Build para produção
- `npm run db:generate` - Gerar Prisma Client
- `npm run db:push` - Sincronizar schema
- `npm run db:seed` - Popular banco com dados de exemplo

### Frontend
- `npm run dev` - Desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview da build

## Conta Demo
- **Email**: demo@taskmanager.com
- **Senha**: demo123
