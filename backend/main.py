from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os

app = FastAPI(title="Beacon Observatory", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = Path(os.getenv("MODELS_DIR", "/app/models")).resolve()

@app.get("/health")
def health():
    return {"status": "ok", "service": "beacon-observatory"}

@app.get("/api/models")
def list_models():
    if not MODELS_DIR.exists():
        return {"models": []}
    models = []
    for path in MODELS_DIR.iterdir():
        if path.suffix.lower() in [".stl", ".step", ".stp", ".obj", ".gltf", ".glb"]:
            models.append({
                "id": path.stem,
                "format": path.suffix.lower(),
                "size_bytes": path.stat().st_size
            })
    return {"models": models}

@app.get("/api/models/{model_id}")
def get_model(model_id: str):
    for ext in [".stl", ".step", ".stp", ".obj", ".gltf", ".glb"]:
        path = MODELS_DIR / f"{model_id}{ext}"
        if path.exists():
            return FileResponse(path, media_type="application/octet-stream", filename=path.name)
    raise HTTPException(404, "Model not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
