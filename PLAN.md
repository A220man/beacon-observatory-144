# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

step-support

## Roadmap

### continue-implementation — Continue implementation and resolve known failures

Status: done

Acceptance:
- Run checks, fix failures, and implement the next planned feature

Implementation: `backend/main.py`, `frontend/src/App.tsx`, `frontend/vite.config.ts`

Tests: `backend/test_main.py`, `frontend/src/App.test.tsx`

### model-info-display — Display model metadata in viewer area

Status: done

Acceptance:
- Selected model shows name, format, and file size in viewer header

Implementation: `frontend/src/App.tsx`

Tests: `frontend/src/App.test.tsx`

### step-support — STEP file format support

Status: done

Acceptance:
- Backend serves .step/.stp files from models directory
- Frontend loads and renders STEP files using three-stdlib AssimpLoader
- Model info shows STEP format correctly

Implementation: `backend/main.py`, `frontend/src/App.tsx`

Tests: `backend/test_main.py`, `frontend/src/App.test.tsx`

