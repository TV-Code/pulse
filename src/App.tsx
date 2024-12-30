import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { onValue } from 'firebase/database'
import { pulsesRef, addPulse } from './firebase';
import { Globe } from './components/Globe'
import { useEffect, useState } from 'react'
import { HeartbeatRecorder } from './components/HeartbeatRecorder';

function App() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    onValue(pulsesRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Pulses Data:', data);
    });
    // Get location on mount
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setLocation({
          lat: data.latitude,
          lng: data.longitude
        })
      })
  }, [])

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'var(--background)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed',
        top: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 1000,
        color: 'var(--text)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          Global Heartbeat
        </h1>
        <p style={{ 
          fontSize: '14px',
          color: 'var(--muted)',
          maxWidth: '400px',
          lineHeight: 1.5
        }}>
          Share your heartbeat to join the global rhythm of human connection
        </p>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 4] }}
        style={{
          background: 'var(--background)'
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        <Globe />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      <HeartbeatRecorder />
    </div>
  );
}

export default App