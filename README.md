# 🔴 Live Streaming Backend API

A robust backend service for a live streaming application, built with Fastify and TypeScript. This API enables users to create and participate in streaming rooms, featuring a dedicated functionality for submitting questions (text and audio) and generating real-time, context-aware answers using Google Gemini's vector-based capabilities.

> [!NOTE]
> **Frontend Application Available:** This project serves as the backend API. It is designed to work in tandem with a separate frontend application. You can find the frontend repository [here](https://github.com/patrick-cuppi/live-streaming-frontend).

## ✨ Core Features

- **Room Management:** Create and list rooms, where each room represents a specific event, lecture, or topic.
- **Question Submission:** Allow users to submit text-based questions to specific rooms.
- **AI-Powered Responses:** Automatically generate accurate and context-aware answers for each question using the power of **Google Gemini**.
- **Audio Uploads:** Support for uploading questions via audio files, enabling future transcriptions and embeddings generation.
- **Robust API:** Built on top of Fastify and TypeScript, ensuring high performance, type safety, and maintainability.

## 🚀 Technology Stack

The project leverages a modern and highly efficient technology stack:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) | JavaScript runtime environment. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strongly typed programming language. |
| **Framework** | [Fastify](https://www.fastify.io/) | Fast and low overhead web framework. |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Powerful, open source object-relational database. |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | TypeScript ORM for SQL databases. |
| **Validation** | [Zod](https://zod.dev/) | TypeScript-first schema declaration and validation. |
| **AI Integration** | [Google Gemini API](https://ai.google.dev/) | Advanced AI models for context-aware responses. |
| **CORS** | [@fastify/cors](https://github.com/fastify/fastify-cors) | Cross-Origin Resource Sharing middleware. |
| **File Uploads** | [@fastify/multipart](https://github.com/fastify/fastify-multipart) | Multipart plugin for Fastify. |
| **Linter & Formatter** | [Biome](https://biomejs.dev/) | Fast formatter and linter. |

## 🔗 Architecture & Application Flow

At the core of the application's intelligence is its integration with the Google Gemini API. When a user submits a new question, the following flow is triggered:

1. The **Frontend** sends a `POST` request to the `/rooms/:roomId/questions` endpoint with the question's text.
2. The **Fastify Backend** receives the request, validates the payload using Zod, and persists the new question in the PostgreSQL database, linked to the corresponding room.
3. Immediately after persistence, the backend triggers the **Google Gemini API**. It sends a prompt containing both the room's title (context) and the question text.
4. **Google Gemini** processes the prompt and returns a generated text response.
5. The **Backend** receives the AI's response and updates the question's record in the database.
6. The full question object, now containing the AI-generated answer, is returned to the **Frontend** to be displayed to the user.

### Question Creation Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Fastify Backend
    participant DB as PostgreSQL
    participant AI as Google Gemini API

    F->>+B: POST /rooms/{roomId}/questions<br>{"title": "How does React work?"}
    B->>+DB: INSERT INTO questions (title, roomId)
    DB-->>-B: Return created question (without answer)
    B->>+AI: generateContent("Context: {room title}.<br>Question: How does React work?")
    AI-->>-B: "React is a JavaScript library..."
    B->>+DB: UPDATE questions SET answer = "..." WHERE id = {questionId}
    DB-->>-B: OK
    B-->>-F: 201 Created<br>{"id": "...", "title": "...", "answer": "..."}
```

## 🛣️ API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check endpoint to verify API status. |
| `GET` | `/rooms` | Retrieves a list of all available rooms. |
| `POST` | `/rooms` | Creates a new room. Body: `{ "title": "string" }` |
| `GET` | `/rooms/:roomId/questions` | Retrieves all questions for a specific room. |
| `POST` | `/rooms/:roomId/questions` | Creates a question and generates an AI answer. Body: `{ "title": "string" }` |
| `POST` | `/questions/:questionId/audio` | Uploads an audio file for an existing question. |

## 🏁 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:
- Node.js (v20 or higher)
- Docker & Docker Compose (for the database)
- A valid Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/patrick-cuppi/live-streaming-backend
cd live-streaming-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables, substituting them with your actual values:

```env
# Application Port
PORT=3333

# PostgreSQL Database Connection URL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"

# Google Gemini API Key
GOOGLE_API_KEY="your_google_gemini_api_key_here"
```

### 4. Setup Database using Docker

Start a PostgreSQL container with the required credentials by running:

```bash
docker compose up -d
```

### 5. Database Migrations & Seeding

With the database running, apply the schema and seed the initial data:

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

To visualize and manage the database records, you can use Drizzle Studio:

```bash
npx drizzle-kit studio
```
Below is a preview of the Drizzle Studio interface showing the created tables and seeded data:

![Drizzle Studio](./public/drizzle-studio.png)

### 6. Run the Application

Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:3333`.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.