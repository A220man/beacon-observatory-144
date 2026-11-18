import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { STLLoader, GLTFLoader, OBJLoader, AssimpLoader } from 'three-stdlib'
import * as THREE from 'three'

interface Model {
  id: string
  format: string
  size_bytes: number
}
        }
      } catch (e) {
        if (!cancelled) setError(String(e))
      }
    }
    loadModel()
    return () => { cancelled = true }
  }, [modelUrl, format])

  if (error) return <div style={{ padding: '1rem', color: '#c00' }}>Error: {error}</div>
  if (!geometry) return <div style={{ padding: '1rem', color: '#666' }}>Loading...</div>

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#4a90d9" roughness={0.5} metalness={0.1} />
    </mesh>
  )
}

function App() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/models')
      .then(r => r.json())
      .then(data => {
        setModels(data.models)
        setLoading(false)
      })
      .catch(e => {
        setError(String(e))
        setLoading(false)
      })
  }, [])

  const styles = {
    container: { display: 'flex', flexDirection: 'column' as const, minHeight: '100vh', background: '#f5f5f5' },
    header: { padding: '1rem 2rem', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    title: { fontSize: '1.5rem', fontWeight: 600, color: '#212529' },
    main: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', padding: '1.5rem 2rem', flex: 1 },
    sidebar: { background: 'white', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' },
    sidebarTitle: { fontSize: '0.875rem', fontWeight: 600, color: '#495057', marginBottom: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    modelList: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
    modelItem: (selected: boolean) => ({ padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s', background: selected ? '#4a90d9' : 'transparent', color: selected ? 'white' : '#212529', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }),
    badge: { fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: '#e9ecef', color: '#495057' },
    viewer: { flex: 1, background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
    viewerInner: { width: '100%', height: '100%', minHeight: '600px' },
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading models...</div>
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#c00' }}>Error: {error}</div>

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Beacon Observatory</h1>
      </header>
      <main style={styles.main}>
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Models</h2>
          <div style={styles.modelList}>
            {models.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No models found</div>
            ) : (
              models.map(model => (
                <div
                  key={model.id}
                  style={styles.modelItem(selectedModel?.id === model.id)}
                  onClick={() => setSelectedModel(model)}
                >
                  <span>{model.id}</span>
                  <span style={styles.badge}>{model.format}</span>
                </div>
              ))
            )}
          </div>
        </aside>
        <section style={styles.viewer}>
          <div style={styles.viewerInner}>
            {selectedModel ? (
              <>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', background: '#fafafa' }}>
                  <div style={{ fontWeight: 600, color: '#212529', fontSize: '1rem' }}>{selectedModel.id}</div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
                    <span>Format: {selectedModel.format}</span>
                    <span>Size: {(selectedModel.size_bytes / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <Canvas camera={{ position: [50, 50, 50], fov: 50 }}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[100, 100, 50]} intensity={1} />
                  <ViewerCanvas modelUrl={`/api/models/${selectedModel.id}`} format={selectedModel.format} />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                  <gridHelper args={[200, 20, '#e0e0e0', '#e0e0e0']} />
                </Canvas>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '600px', color: '#666' }}>
                Select a model to view
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (geometries.length === 1) return geometries[0];
  const merged = new THREE.BufferGeometry();
  const totalVertices = geometries.reduce((sum, g) => sum + (g.getAttribute(\"position\") ? g.getAttribute(\"position\").count : 0), 0);
  const mergedPosition = new Float32Array(totalVertices * 3);
  let posOffset = 0;
  for (const g of geometries) {
    const pos = g.getAttribute(\"position\");
    if (pos) {
      mergedPosition.set(pos.array, posOffset);
      posOffset += pos.count * 3;
    }
  }
  merged.setAttribute(\"position\", new THREE.BufferAttribute(mergedPosition, 3));

  const normalArrays: Float32Array[] = [];
  for (const g of geometries) {
    const norm = g.getAttribute(\"normal\");
    if (norm) normalArrays.push(norm.array);
  }
  if (normalArrays.length > 0) {
    const mergedNormal = new Float32Array(totalVertices * 3);
    let normOffset = 0;
    for (const arr of normalArrays) {
      mergedNormal.set(arr, normOffset);
      normOffset += arr.length / 3 * 3;
    }
    merged.setAttribute(\"normal\", new THREE.BufferAttribute(mergedNormal, 3));
  }

  const uvArrays: Float32Array[] = [];
  for (const g of geometries) {
    const uv = g.getAttribute(\"uv\");
    if (uv) uvArrays.push(uv.array);
  }
  if (uvArrays.length > 0) {
    const mergedUV = new Float32Array(totalVertices * 2);
    let uvOffset = 0;
    for (const arr of uvArrays) {
      mergedUV.set(arr, uvOffset);
      uvOffset += arr.length / 2 * 2;
    }
    merged.setAttribute(\"uv\", new THREE.BufferAttribute(mergedUV, 2));
  }

  return merged;
}
