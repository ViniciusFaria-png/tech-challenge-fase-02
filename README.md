# Blog Dinâmico para Ensino



Uma API REST completa para um sistema de blog educacional, desenvolvida com Node.js, Fastify e PostgreSQL, implementando autenticação JWT e CRUD completo para posts educacionais.


## 🤝 GRUPO

* RM 362457  - Alessandra  Guedes

* RM 362166 - Ana Carolina

* RM 363723 - Vinicius Faria

* RM 360942 - Vitor Freire
## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Tipagem estática para JavaScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas e tipos
- **Bcrypt.js** - Hash de senhas
- **JWT (@fastify/jwt)** - Autenticação e autorização

### Testes
- **Vitest** - Framework de testes moderno
- **@vitest/coverage-v8** - Cobertura de testes

### Documentação
- **Swagger/OpenAPI** - Documentação automática da API
- **@fastify/swagger** - Integração Swagger com Fastify
- **@fastify/swagger-ui** - Interface visual da documentação

### DevOps & Deploy
- **Docker & Docker Compose** - Containerização
- **GitHub Actions** - CI/CD pipeline
- **Render** - Plataforma de deploy
- **DBeaver** - Gerenciamento do banco de dados

## 🏗️ Arquitetura do Projeto

O projeto segue os princípios da **Clean Architecture** e **SOLID**, organizando o código em camadas bem definidas:

```
src/
├── entities/           # Entidades de domínio
├── repositories/       # Camada de acesso a dados
├── use-cases/         # Regras de negócio
├── http/              # Controladores e rotas
│   ├── controller/    # Controladores HTTP
│   └── middleware/    # Middlewares de autenticação
├── lib/               # Configurações de bibliotecas
├── env/               # Configurações de ambiente
└── utils/             # Utilitários gerais
```

### Principais Funcionalidades

- ✅ **CRUD Completo de Posts** - Criar, listar, buscar, atualizar e deletar
- ✅ **Sistema de Autenticação JWT** - Login seguro para professores
- ✅ **Busca Textual** - Pesquisa por título e conteúdo dos posts
- ✅ **Documentação Swagger** - API totalmente documentada
- ✅ **Testes Automatizados** - Unitários e de integração
- ✅ **CI/CD Pipeline** - Deploy automatizado
- ✅ **Containerização** - Docker ready

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

```sql
-- Usuários do sistema
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Professores (vinculados aos usuários)
CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    materia VARCHAR(100),
    user_id INTEGER UNIQUE NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

-- Posts educacionais
CREATE TABLE post (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(200) NOT NULL,
    resumo VARCHAR(500),
    conteudo TEXT NOT NULL,
    professor_id INTEGER NOT NULL REFERENCES professor(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação
1. **Login** - Professor faz login com email/senha
2. **Verificação** - Sistema valida credenciais e verifica se é professor
3. **Token JWT** - Token é gerado com dados do usuário e professor
4. **Autorização** - Rotas protegidas verificam token e permissões

### Middleware de Proteção
```typescript
// Apenas usuários autenticados
app.register(jwtAuth)

// Apenas professores podem criar/editar posts
app.register(professorAuth)
```

## 📡 Endpoints da API

### Autenticação
- `POST /user` - Cadastro de usuário
- `POST /user/signin` - Login (retorna JWT token)

### Posts (Públicos)
- `GET /posts` - Listar todos os posts
- `GET /posts/:id` - Buscar post por ID
- `GET /posts/search?query=termo` - Buscar posts por texto

### Posts (Protegidos - Apenas Professores)
- `POST /posts` - Criar novo post
- `PUT /posts/:id` - Atualizar post
- `DELETE /posts/:id` - Deletar post

### Documentação
- `GET /docs` - Interface Swagger da API
- `GET /` - Status da aplicação

## 🛠️ Configuração e Execução

### Pré-requisitos
- Node.js 18+ 
- Docker e Docker Compose
- PostgreSQL (ou usar via Docker)

### 1. Clonar o Repositório
```bash
git clone https://github.com/ViniciusFaria-png/tech-challenge-fase-02.git
cd tech-challenge-fase-02
```

### 2. Configurar Variáveis de Ambiente
Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Configure as variáveis:
```env
# Aplicação
PORT=3000
ENV=development

# Banco de Dados
POSTGRES_DB=blog_dinamico
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT
JWT_SECRET=seu-jwt-secret-super-secreto
```

### 3. Executar com Docker (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

A aplicação estará disponível em:
- **API**: http://localhost:3000
- **Documentação**: http://localhost:3000/docs
- **PostgreSQL**: localhost:5432

### 4. Executar Localmente (Desenvolvimento)

```bash
# Instalar dependências
npm install

# Subir apenas o banco
docker-compose up postgres -d

# Executar migrações (SQL files em /sql)
npm run migrate  # ou execute manualmente via DBeaver

# Iniciar em modo desenvolvimento
npm run start:dev
```

### 5. Executar Testes

```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 🚀 Deploy e CI/CD

### Pipeline GitHub Actions

O projeto possui um pipeline automatizado que:

1. **Testes** - Executa todos os testes unitários e de integração
2. **Build** - Compila o TypeScript
3. **Docker** - Constrói e publica imagem Docker
4. **Deploy** - Faz deploy automático no Render

```yaml
# .github/workflows/main.yml
- Checkout do código
- Setup Node.js 18
- Instalar dependências
- Executar testes com PostgreSQL
- Build da aplicação
- Build e push da imagem Docker
```

### Deploy no Render

A aplicação está configurada para deploy automático no [Render](https://render.com):

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment**: Produção com PostgreSQL gerenciado

## 🧪 Testes

### Estrutura de Testes
```
__tests__/
├── integration/       # Testes de integração (API)
├── unit/             # Testes unitários
│   ├── entities/     # Testes de entidades
│   ├── use-cases/    # Testes de casos de uso
│   └── repositories/ # Testes de repositórios
├── setup/            # Configuração de testes
│   ├── mocks/        # Mocks e fixtures
│   └── utils/        # Utilitários de teste
└── utils/            # Helpers de teste
```

### Cobertura de Testes
- **Entidades**: 100%
- **Use Cases**: 95%+
- **Controladores**: 90%+
- **Repositórios**: 85%+

## 🎯 Principais Desafios Enfrentados

### 1. **Deploy e CI/CD com Render**
**Desafio**: Configurar o pipeline de deploy automático no Render foi mais complexo que esperado.

**Dificuldades**:
- Compreender as especificidades da plataforma Render
- Configurar corretamente as variáveis de ambiente
- Sincronizar o build da aplicação com o deploy
- Gerenciar secrets do Docker Hub no GitHub Actions

**Solução**: 
- Estudo detalhado da documentação do Render
- Configuração manual das variáveis de ambiente na plataforma
- Criação de pipeline robusto no GitHub Actions
- Implementação de health checks para verificar deploy

### 2. **Configuração do Banco PostgreSQL**
**Desafio**: Setup e gerenciamento do banco de dados PostgreSQL no Render.

**Dificuldades**:
- Criar instância PostgreSQL gerenciada no Render
- Conectar aplicação ao banco remoto
- Executar scripts SQL de inicialização
- Gerenciar migrações e seeds de dados

**Solução**:
- Uso do DBeaver para conexão direta ao banco
- Execução manual dos scripts SQL (`01-schema.sql`, `02-data.sql`)
- Configuração de connection pooling para otimização
- Implementação de health checks do banco

### 3. **Implementação do Sistema JWT**
**Desafio**: Desenvolver sistema de autenticação robusto com diferenciação de usuários e professores.

**Dificuldades**:
- Integrar JWT com Fastify de forma adequada
- Criar middleware de autenticação para diferentes níveis de acesso
- Proteger rotas sensíveis (apenas professores podem criar/editar posts)
- Gerenciar tokens de forma segura
- Implementar refresh token strategy

**Solução**:
```typescript
// Middleware de autenticação de professor
export async function professorAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    const payload = request.user as any;
    
    if (!payload.isProfessor || !payload.professorId) {
      return reply.status(403).send({ 
        message: "Acesso negado. Apenas professores podem realizar esta ação." 
      });
    }

    request.user = {
      id: payload.sub,
      email: payload.email,
      professor_id: payload.professorId.toString()
    };
  } catch (error) {
    return reply.status(401).send({ 
      message: "Token inválido ou expirado" 
    });
  }
}
```

### 4. **Testes de Integração**
**Desafio**: Configurar ambiente de testes que simule o ambiente de produção.

**Dificuldades**:
- Setup de banco PostgreSQL para testes
- Isolamento entre testes
- Mocking de dependências externas
- Testes de autenticação e autorização

**Solução**:
- Configuração de banco de testes no CI/CD
- Uso de factories e mocks para dados de teste
- Implementação de `fakeAuth` para testes
- Limpeza automática do banco entre testes

## 📈 Melhorias Futuras

- [ ] **Cache Redis** - Para melhorar performance das consultas
- [ ] **Rate Limiting** - Proteção contra spam e ataques
- [ ] **Upload de Imagens** - Para posts com conteúdo visual
- [ ] **Notificações** - Sistema de alertas para novos posts
- [ ] **Comentários** - Interação entre alunos e professores
- [ ] **Analytics** - Métricas de uso e engajamento

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
