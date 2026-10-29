# Beacon Observatory — Ryan Vo

> Work in progress. This checkpoint may be incomplete or fail tests. See PLAN.md and STATUS.md before use.


Give your agent CAD superpowers.

## Quick Start

```bash
# Using Docker Compose (recommended)
docker compose up --build

# Or run locally
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend (in another terminal)
cd frontend
npm install
npm run start
```

- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- Health check: http://localhost:8000/health
- Models API: http://localhost:8000/api/models

## Project Structure

```
beacon-observatory/
├── backend/           # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── test_main.py
├── frontend/          # React + Three.js frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── index.html
├── models/            # Sample CAD models (STL, STEP, etc.)
│   └── cube.stl
├── docker-compose.yml
├── feature-plan.json
└── PLAN.md
```

## Features

- **3D Model Viewer**: Load and view STL, GLTF/GLB, OBJ files in the browser
- **Model Browser**: Sidebar with available models from `/models` directory
- **Orbit Controls**: Rotate, pan, zoom with mouse
- **REST API**: FastAPI backend serves models and health checks

## Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run start
```

### Tests
```bash
# Backend
cd backend
pytest test_main.py -v

# Frontend
cd frontend
npm test
```

## Adding Models

Place STL, STEP (.step/.stp), OBJ, or GLTF/GLB files in the `models/` directory. They will appear automatically in the model browser.

## License

MIT

Maintainer: Ryan Vo <ryandtvo@gmail.com>
