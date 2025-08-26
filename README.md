# Agents API - Backend

Este é o projeto backend para uma aplicação de transmissão ao vivo, construída com Fastify e TypeScript. Ele permite que usuários criem e participem de salas de streaming, com uma funcionalidade dedicada para gravação e envio de áudio para interação em tempo real, onde o gemini irá verificar as perguntas e procurar respostas adequadas, baseada em vetores (`embeddings`).

## ✨ Funcionalidades Principais

- **Gerenciamento de Salas:** Crie e liste salas, onde cada sala representa um evento, palestra ou tópico específico.
- **Submissão de Perguntas:** Usuários podem submeter perguntas de texto para uma sala específica.
- **Respostas com IA:** Geração automática de respostas para cada pergunta utilizando o poder do **Google Gemini**.
- **Upload de Áudio:** Suporte para upload de perguntas em formato de áudio (com transcrição e geração de embeddings).
- **API Robusta:** Construída com Fastify e TypeScript para performance e segurança de tipos.

## 🚀 Tecnologias Utilizadas

O projeto foi construído com um conjunto de tecnologias modernas e eficientes:

- **Runtime:** [Node.js](https://nodejs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Fastify](https://www.fastify.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Validação de Schema:** [Zod](https://zod.dev/)
- **Inteligência Artificial:** [Google Gemini API](https://ai.google.dev/)
- **CORS:** [@fastify/cors](https://github.com/fastify/fastify-cors)
- **Upload de Arquivos:** [@fastify/multipart](https://github.com/fastify/fastify-multipart)
- **Linter & Formatter:** [Biome](https://biomejs.dev/)

## 🔗 Integração com Gemini e Fluxo da Aplicação

O coração da inteligência da aplicação está na sua integração com a API do Google Gemini. Quando um usuário submete uma nova pergunta, o seguinte fluxo é acionado:

1.  O **Frontend** envia uma requisição `POST` para a rota `/rooms/:roomId/questions` com o texto (título) da pergunta.
2.  O **Backend (Servidor Fastify)** recebe a requisição, valida os dados e salva a nova pergunta no banco de dados PostgreSQL, associando-a à sala correta.
3.  Imediatamente após salvar, o backend invoca a **API do Google Gemini**. Ele envia um prompt que inclui o título da sala e o texto da pergunta. Isso fornece contexto à IA, permitindo que ela gere uma resposta mais relevante e precisa.
4.  O **Gemini** processa o prompt e retorna uma resposta em texto.
5.  O **Backend** recebe a resposta da IA e atualiza o registro da pergunta no banco de dados com essa resposta.
6.  O objeto completo da pergunta, agora contendo a resposta gerada pela IA, é retornado ao **Frontend**, que pode então exibi-la para o usuário.

### Diagrama do Fluxo de Criação de Pergunta

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend as Servidor Fastify
    participant Database as PostgreSQL
    participant AI as Google Gemini

    Frontend->>+Backend: POST /rooms/{roomId}/questions<br>{"title": "Como funciona a fotossíntese?"}
    Backend->>+Database: INSERT INTO questions (title, roomId)
    Database-->>-Backend: Retorna a pergunta criada (sem resposta)
    Backend->>+AI: generateContent("Contexto: {título da sala}.<br>Pergunta: Como funciona a fotossíntese?")
    AI-->>-Backend: "A fotossíntese é o processo..."
    Backend->>+Database: UPDATE questions SET answer = "..." WHERE id = {questionId}
    Database-->>-Backend: OK
    Backend-->>-Frontend: 201 Created<br>{"id": "...", "title": "...", "answer": "..."}
```

## 🛣️ Rotas da API (Endpoints)

| Método | Rota                               | Descrição                                                              |
| :----- | :--------------------------------- | :----------------------------------------------------------------------- |
| `GET`  | `/health`                          | Endpoint de health check para verificar se a API está no ar.             |
| `GET`  | `/rooms`                           | Retorna uma lista de todas as salas criadas.                             |
| `POST` | `/rooms`                           | Cria uma nova sala. Body: `{ "title": "string" }`                        |
| `GET`  | `/rooms/:roomId/questions`         | Retorna todas as perguntas de uma sala específica.                       |
| `POST` | `/rooms/:roomId/questions`         | Cria uma nova pergunta em uma sala e gera uma resposta com IA. Body: `{ "title": "string" }` |
| `POST` | `/questions/:questionId/audio`     | Faz o upload de um arquivo de áudio para uma pergunta existente.         |

## 🏁 Como Começar (Getting Started)

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- Node.js (v20 ou superior)
- Docker (para o banco de dados)
- Uma chave de API do Google Gemini

### 1. Clonar o Repositório

```bash
git clone https://github.com/patrick-cuppi/live-streaming-backend
cd live-streaming-backend
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `live-streaming-backend` e adicione as seguintes variáveis, substituindo pelos seus valores.

```env
# Porta da aplicação
PORT=3333

# URL de conexão do seu banco de dados PostgreSQL
DATABASE_URL="postgresql://USUÁRIO:SENHA@localhost:5432/DB_NAME"

# Sua chave de API do Google Gemini
GOOGLE_API_KEY="your_google_gemini_api_key"
```

### 4. Configurar o Banco de Dados com Docker

Execute o comando abaixo para iniciar um container PostgreSQL com as credenciais esperadas:

```bash
docker compose up -d
```

### 5. Executar as Migrations

Com o banco de dados em execução, aplique o schema da aplicação:

```bash
npx drizzle-kit generate #ou
npm run db:generate

# E depois:

npx drizzle-kit migrate #ou
npm run db:migrate

# Para rodar o seed:

npm run db:seed

# Para verificar os registros dentro do Banco de Dados, rode:

npx drizzle-kit studio
```
Abaixo temos a tela do Drizzle Studio com as tabelas criadas e o seed gerado:

![Drizzle Studio](./public/drizzle-studio.png)

### 6. Executar a Aplicação

Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

### 7. Contribuindo
 
 Contribuições são bem-vindas! Sinta-se à vontade para abrir *issues* e *pull requests*.
 
 1.  Faça um *fork* do projeto.
 2.  Crie uma nova *branch* (`git checkout -b feature/sua-feature`).
 3.  Faça o *commit* de suas alterações (`git commit -m 'feat: Adiciona nova feature'`).
 4.  Faça o *push* para a *branch* (`git push origin feature/sua-feature`).
 5.  Abra um *Pull Request*.
 
 ### 📄 Licença
 
 Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.