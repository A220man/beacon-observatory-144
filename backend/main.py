from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import time

app = FastAPI(title="Beacon Observatory", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default to models/ relative to project root for local dev, /app/models for Docker
DEFAULT_MODELS_DIR = Path(__file__).parent.parent / "models"
MODELS_DIR = Path(os.getenv("MODELS_DIR", str(DEFAULT_MODELS_DIR))).resolve()

# Simple cache for model list: {models: [...], last_fetched: timestamp}
_model_cache: dict = {"models": [], "last_fetched": 0}
CACHE_TTL = 5

@app.get("/health")
def health():
    return {"status": "ok", "service": "beacon-observatory"}

@app.get("/api/models")
def list_models():
    now = int(time.time())
    if now - _model_cache["last_fetched"] < CACHE_TTL:
        return _model_cache
    if not MODELS_DIR.exists():
        _model_cache["models"] = []; _model_cache["last_fetched"] = now
        return _model_cache
    models = []
    try:
        for entry in MODELS_DIR.iterdir():
            if not entry.is_file():
                continue
            suffix = entry.suffix.lower()
            if suffix not in [".stl", ".step", ".stp", ".obj", ".gltf", ".glb"]:
                continue
            try:
                size = entry.stat().st_size
            except OSError:
                continue
            models.append({
                "id": entry.stem,
                "format": suffix,
                "size_bytes": size
            })
    except OSError:
        pass
    _model_cache["models"] = models; _model_cache["last_fetched"] = now
    return _model_cache

@app.get("/api/models/{model_id}")
def get_model(model_id: str):
    if ".." in model_id or model_id.startswith("/"):
        raise HTTPException(400, "Invalid model ID")
    for ext in [".stl", ".step", ".stp", ".obj", ".gltf", ".glb"]:
        path = MODELS_DIR / f"{model_id}{ext}"
        try:
            if path.is_file() and path.exists():
                return FileResponse(path, media_type="application/octet-stream", filename=path.name)
        except OSError:
            continue
    raise HTTPException(404, "Model not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

