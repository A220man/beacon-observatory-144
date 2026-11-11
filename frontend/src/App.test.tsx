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

vi.mock('three-stdlib', () => ({
  AssimpLoader: vi.fn().mockImplementation(() => ({
    parse: vi.fn().mockReturnValue({
      scene: {
        traverse: vi.fn((callback) => {
          callback({ geometry: { center: vi.fn() } })
        })
      }
    })
  }))
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

  it('displays model info when model is selected', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ models: [{ id: 'cube', format: '.stl', size_bytes: 1405 }] })
      })
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(100))
      })
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Beacon Observatory')).toBeInTheDocument()
    })

    // Click on the model in the sidebar
    await waitFor(() => {
      expect(screen.getByText('cube')).toBeInTheDocument()
    })
    screen.getByText('cube').click()

    // Check that model info is displayed
    await waitFor(() => {
      expect(screen.getByText('Format: .stl')).toBeInTheDocument()
      expect(screen.getByText('Size: 1.4 KB')).toBeInTheDocument()
    })
  })

  it('displays model info for STEP format', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ models: [{ id: 'part', format: '.step', size_bytes: 2048 }] })
      })
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(100))
      })
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Beacon Observatory')).toBeInTheDocument()
    })

    // Click on the model in the sidebar
    await waitFor(() => {
      expect(screen.getByText('part')).toBeInTheDocument()
    })
    screen.getByText('part').click()

    // Check that model info is displayed
    await waitFor(() => {
      expect(screen.getByText('Format: .step')).toBeInTheDocument()
      expect(screen.getByText('Size: 2.0 KB')).toBeInTheDocument()
    })
  })
})
