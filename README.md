# OwnGPT

vb3lhg-codex/create-owngpt-github-repository-and-system
y2gdip-codex/create-owngpt-github-repository-and-system
main
OwnGPT is a minimal full-stack example built mostly with Python. A FastAPI app serves a simple web chat interface and proxies to a vLLM server hosting `gpt-oss-120b`.

## Features
- FastAPI backend serving a mobile friendly chat page
- Server Sent Events (SSE) token streaming with a **Stop** button and Markdown rendering
- `/api/chat` and `/api/models` endpoints protected by `x-own-key`
- Dockerfile and `docker-compose.yml` for local development
vb3lhg-codex/create-owngpt-github-repository-and-system
- Example `.env` files
- Kubernetes manifest for deploying the backend
main
- Example `.env` files
main
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
vb3lhg-codex/create-owngpt-github-repository-and-system
y2gdip-codex/create-owngpt-github-repository-and-system
main
3. Open http://localhost:8000 and chat away!

The backend expects requests to include `x-own-key` header matching `OWN_API_KEY`. The included web page uses this value automatically.

## Development

vb3lhg-codex/create-owngpt-github-repository-and-system
main
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

vb3lhg-codex/create-owngpt-github-repository-and-system
Then open [http://localhost:8000](http://localhost:8000).

y2gdip-codex/create-owngpt-github-repository-and-system
Then open [http://localhost:8000](http://localhost:8000).
main
main
### Terraform & Helm
- `infra/terraform` contains a skeleton for a VPC and EKS cluster using popular community modules.
- `deploy/helm/vllm-values.yaml` holds minimal values for deploying vLLM with Helm.

vb3lhg-codex/create-owngpt-github-repository-and-system
## Deploying on AWS

1. **Provision infrastructure**
   ```bash
   cd infra/terraform
   terraform init
   terraform apply
   ```
   This creates a VPC and EKS cluster named `owngpt`.

2. **Build & push the backend image**
   ```bash
   aws ecr create-repository --repository-name owngpt-backend
   aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
   docker build -t owngpt-backend backend
   docker tag owngpt-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/owngpt-backend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/owngpt-backend:latest
   ```

3. **Configure kubectl**
   ```bash
   aws eks update-kubeconfig --name owngpt --region <region>
   ```

4. **Deploy vLLM**
   ```bash
   helm repo add runpod https://charts.runpod.io
   helm install vllm runpod/vllm -f deploy/helm/vllm-values.yaml
   ```

5. **Deploy the backend**
   Update `deploy/k8s/backend.yaml` with your ECR image URI and API key, then apply:
   ```bash
   kubectl apply -f deploy/k8s/backend.yaml
   ```

6. **Access the service**
   ```bash
   kubectl get svc owngpt-backend
   ```
   Use the external IP to reach the chat UI.

main
## License
MIT
