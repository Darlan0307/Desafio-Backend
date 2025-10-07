# 🧪 Teste Técnico – Back-End (Node.js + TypeScript)

## 📋 Descrição do Projeto

Este projeto foi desenvolvido como parte de um desafio técnico para uma vaga de Back-End.  
A proposta consiste em construir uma **API REST** utilizando **Node.js** e **TypeScript**, com **PostgreSQL** como banco de dados e **Prisma ORM** para integração.

A aplicação tem como objetivo o **gerenciamento de usuários e tarefas**, seguindo boas práticas de arquitetura, separação de responsabilidades e tipagem segura com TypeScript.

---

## ⚙️ Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Zod** (para validação de dados)
- **Docker e Docker Compose**
- **Render** (para deploy)

---

## 🧩 Estrutura do Projeto

O projeto segue uma estrutura organizada em camadas, garantindo escalabilidade e fácil manutenção:

```
src/
 ├── app/
 │   ├── users/
 │   │   ├── http/
 │   │   ├── use-cases/
 │   │   └── repository/
 │   └── tasks/
 │       ├── http/
 │       ├── use-cases/
 │       └── repository/
 ├── infra/
 │   ├── errors/
 │   └── logger
 ├── shared/
 │   ├── utils/
 │   └── config/
 ├── http-server.ts
 └── main.ts
```

Cada módulo possui suas próprias regras de negócio e responsabilidades.

---

## 💾 Banco de Dados

O banco de dados utilizado é o **PostgreSQL**.  
O ORM utilizado é o **Prisma**, responsável pelo mapeamento das tabelas e execução das queries.

### Estrutura das Tabelas

#### `users`

| Campo     | Tipo             | Descrição                             |
| --------- | ---------------- | ------------------------------------- |
| id        | UUID             | Identificador único                   |
| name      | string           | Nome do usuário                       |
| email     | string           | E-mail (único)                        |
| createdAt | datetime         | Data de criação                       |
| updatedAt | datetime         | Data de atualização                   |
| deletedAt | datetime \| null | Data de exclusão lógica (soft delete) |

#### `tasks`

| Campo       | Tipo             | Descrição                             |
| ----------- | ---------------- | ------------------------------------- |
| id          | UUID             | Identificador único                   |
| title       | string           | Título da tarefa                      |
| description | string           | Descrição da tarefa                   |
| status      | string           | 'pending' ou 'done'                   |
| userId      | UUID             | Relacionamento com o usuário          |
| createdAt   | datetime         | Data de criação                       |
| updatedAt   | datetime         | Data de atualização                   |
| deletedAt   | datetime \| null | Data de exclusão lógica (soft delete) |

---

## 🚀 Guia de Instalação

### 🔧 Pré-requisitos

Certifique-se de ter instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

### 🐳 Subindo o Projeto com Docker

1. **Clone o repositório**

   ```bash
   git clone https://github.com/Darlan0307/Desafio-Backend.git
   cd Desafio-Backend
   ```

2. **Configure o arquivo `.env`**
   Copie o arquivo `.env.example` na raiz do projeto.

   ```bash
   cp .env.example .env
   ```

3. **Suba os containers**

   ```bash
   docker-compose up -d
   ```

   Isso irá iniciar:
   - O container do **PostgreSQL**
   - O container da **API**

4. **Acesse o projeto**
   O servidor estará disponível em:
   ```
   http://localhost:3000
   ```

---

## 🧠 Funcionalidades Implementadas

### 👤 Usuários

| Método | Rota         | Descrição                                                     |
| ------ | ------------ | ------------------------------------------------------------- |
| POST   | `/users`     | Cria um novo usuário                                          |
| GET    | `/users`     | Lista todos os usuários (com paginação e filtro de deletados) |
| GET    | `/users/:id` | Retorna um usuário específico                                 |
| PUT    | `/users/:id` | Atualiza um usuário existente                                 |
| DELETE | `/users/:id` | Realiza um soft delete no usuário                             |

---

### ✅ Tarefas

| Método | Rota         | Descrição                                                                     |
| ------ | ------------ | ----------------------------------------------------------------------------- |
| POST   | `/tasks`     | Cria uma nova tarefa vinculada a um usuário                                   |
| GET    | `/tasks`     | Lista todas as tarefas (com paginação, nome do usuário e filtro de deletados) |
| GET    | `/tasks/:id` | Retorna uma tarefa específica                                                 |
| PUT    | `/tasks/:id` | Atualiza uma tarefa existente                                                 |
| DELETE | `/tasks/:id` | Realiza um soft delete na tarefa                                              |

---

## 📄 Paginação e Filtro de Itens Deletados

Todas as rotas de **listagem** (`GET /users` e `GET /tasks`) possuem suporte à **paginação** e **filtro de itens deletados**.

### Parâmetros disponíveis:

| Parâmetro     | Tipo              | Descrição                                                   |
| ------------- | ----------------- | ----------------------------------------------------------- |
| `page`        | number            | Página atual (default: 1)                                   |
| `perPage`     | number            | Quantidade de itens por página (default: 50)                |
| `withDeleted` | boolean \| number | Quando `true` ou `1`, retorna também os registros deletados |

**Exemplo de uso:**

```
GET /tasks?page=2&perPage=5&withDeleted=true
```

---

## 🧱 Validação de Dados

Todos os dados de entrada são validados com **Zod**, garantindo consistência e evitando erros de entrada antes de chegar na camada de negócio.

---

## 🧩 Tratamento de Erros

O projeto possui uma camada de tratamento de erros centralizada.  
Erros de validação, erros de domínio e exceções do Prisma são padronizados em respostas JSON, mantendo a API previsível e legível.

---

## ☁️ Deploy

O deploy da aplicação foi realizado na plataforma **Render**, que hospedará a **API**. [Clique aqui](https://render.com/deploy?repo=https://github.com/Darlan0307/Desafio-Backend) para acessar o deploy.
