import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
vb3lhg-codex/create-owngpt-github-repository-and-system
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


main

import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
vb3lhg-codex/create-owngpt-github-repository-and-system
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

main

VLLM_API_BASE = os.getenv("VLLM_API_BASE", "http://localhost:8001")
API_KEY = os.getenv("OWN_API_KEY", "dev-key")
MODEL = os.getenv("MODEL_NAME", "gpt-oss-120b")


async def stream_vllm(messages):
    payload = {"model": MODEL, "messages": messages, "stream": True}
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream(
            "POST", f"{VLLM_API_BASE}/v1/chat/completions", json=payload
        ) as r:
            async for line in r.aiter_lines():
                if line:
                    yield f"{line}\n"


@app.post("/api/chat")
async def chat(request: Request):
    if request.headers.get("x-own-key") != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    data = await request.json()
    messages = data.get("messages", [])
    generator = stream_vllm(messages)
    return StreamingResponse(generator, media_type="text/event-stream")


@app.get("/api/models")
async def models(request: Request):
    if request.headers.get("x-own-key") != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{VLLM_API_BASE}/v1/models")
        return JSONResponse(r.json())
vb3lhg-codex/create-owngpt-github-repository-and-system
main


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "api_key": API_KEY, "model": MODEL}
    )
vb3lhg-codex/create-owngpt-github-repository-and-system

main
main
