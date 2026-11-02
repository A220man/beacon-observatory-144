import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  STLLoader: vi.fn(),
  GLTFLoader: vi.fn(),
  OBJLoader: vi.fn(),
}))

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ models: [] })
    }))
  })

  it('renders header', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Beacon Observatory')).toBeInTheDocument()
    })
  })
})
