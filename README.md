# OwnGPT

OwnGPT is a minimal full-stack example showing how to run a Next.js chat UI against a FastAPI backend that proxies to a vLLM server hosting `gpt-oss-120b`.

## Features
- Next.js 14 frontend with mobile friendly chat page
- Server Sent Events (SSE) token streaming with a **Stop** button
- FastAPI backend with `/api/chat` and `/api/models` endpoints
- Dockerfiles and `docker-compose.yml` for local development
- Example `.env` files
- Helm values for deploying vLLM on EKS
- Terraform skeleton for provisioning VPC and EKS

## Quick Start

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```
2. **Build and start services**
   ```bash
   docker-compose up --build
   ```
3. Open http://localhost:3000 and chat away!

The backend expects requests to include `x-own-key` header matching `OWN_API_KEY`.

## Development

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Terraform & Helm
- `infra/terraform` contains a skeleton for a VPC and EKS cluster using popular community modules.
- `deploy/helm/vllm-values.yaml` holds minimal values for deploying vLLM with Helm.

## License
MIT
