# EasyMed AI — Smart Healthcare Management & Clinical Decision Support Platform

A production-grade, service-oriented health-tech platform: Core API, ML Inference Service, and an LLM/RAG Assistant Service, communicating over REST/WebSocket, backed by Redis, containerized with Docker.

## Architecture

```
Client (React SPA)
      │
      ▼
Nginx / API Gateway
      │
      ▼
Core API (Node/Express, MongoDB Atlas, Redis)
      │
      ├──► ML Inference Service (Python/FastAPI, scikit-learn/XGBoost)
      │
      └──► LLM/RAG Assistant Service (Node, Claude API, vector store)

Socket.io (real-time notifications, WebRTC signaling) runs alongside the Core API.
BullMQ workers (Redis-backed) handle reminders, emails, and report-summary jobs asynchronously.
```

## Monorepo layout

```
easymed/
├── client/         # React 18 + Vite + Tailwind SPA
├── server/         # Node/Express Core API (layered: routes/controllers/services/repositories)
├── ml-service/      # Python/FastAPI ML inference microservice
├── llm-service/     # Node/Express LLM+RAG assistant microservice
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Getting started (local dev)

```bash
git clone <your-repo-url> easymed
cd easymed
cp server/.env.example server/.env
cp llm-service/.env.example llm-service/.env
docker compose up --build
```

- Client: http://localhost:5173
- Core API: http://localhost:5000
- ML Service: http://localhost:8000/docs (FastAPI auto docs)
- LLM/RAG Service: http://localhost:5100

## Tech stack

See `EasyMed_Production_Plan.pdf` (project plan) for the full stack table and the day-by-day execution schedule (20 Jul – 31 Aug 2026).

## Status

Scaffolding stage — service skeletons, Docker Compose, CI pipeline skeleton, and Week 1 architecture in place. Follow the execution plan week by week to fill in each module.
