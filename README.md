# OwnGPT

OwnGPT is a minimal full-stack example built mostly with Python. A FastAPI app serves a simple web chat interface and proxies to a vLLM server hosting `gpt-oss-120b`.

## Features
- FastAPI backend serving a mobile friendly chat page
- Server Sent Events (SSE) token streaming with a **Stop** button and Markdown rendering
- `/api/chat` and `/api/models` endpoints protected by `x-own-key`
- Dockerfile and `docker-compose.yml` for local development
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
3. Open http://localhost:8000 and chat away!

The backend expects requests to include `x-own-key` header matching `OWN_API_KEY`. The included web page uses this value automatically.

## Development

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open [http://localhost:8000](http://localhost:8000).

### Terraform & Helm
- `infra/terraform` contains a skeleton for a VPC and EKS cluster using popular community modules.
- `deploy/helm/vllm-values.yaml` holds minimal values for deploying vLLM with Helm.

## License
MIT
