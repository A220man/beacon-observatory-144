import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "beacon-observatory"}

def test_list_models():
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert isinstance(data["models"], list)
    # If there are models, verify they have the expected structure
    for model in data["models"]:
        assert "id" in model
        assert "format" in model
        assert "size_bytes" in model
        assert model["format"] in [".stl", ".step", ".stp", ".obj", ".gltf", ".glb"]

def test_get_model_not_found():
    response = client.get("/api/models/nonexistent")
    assert response.status_code == 404
