import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('renders header', () => {
    render(<App />)
    expect(screen.getByText('Beacon Observatory')).toBeInTheDocument()
  })
})
