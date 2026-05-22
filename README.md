# Synthetix Portfolio

Next.js portfolio app with a server-side Gemini chat endpoint and Gemini+Pinecone RAG.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install --legacy-peer-deps`
2. Add your API keys to `.env.local`:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
   FIREBASE_CLIENT_EMAIL="YOUR_FIREBASE_CLIENT_EMAIL"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

   PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
   PINECONE_INDEX="synthetix-portfolio"
   PINECONE_NAMESPACE="prod"

   GEMINI_MODEL="gemini-2.5-flash"
   GEMINI_EMBED_MODEL="text-embedding-004"
   ```
3. Start the development server:
   `npm run dev`
4. Open `http://localhost:3002`

## Scripts

- `npm run dev` starts Next.js on port 3002.
- `npm run build` creates a production build.
- `npm run start` starts the production server.
- `npm run lint` runs TypeScript checks.

## RAG (Gemini + Pinecone)

This project uses Pinecone as vector DB in `lib/rag-langchain.ts`.

Knowledge files used by RAG:

- `rag-data/knowledge.json`
- `rag-data/pdf-extract.txt`
- `rag-data/documents/*.md` (optional)

Reindex endpoint (admin):

- `POST /api/admin/rag-context/reindex`

Important:

- `/api/rag` no longer auto-indexes on first request.
- Run reindex once after updating `rag-data/*` so Pinecone has vectors.
