import { useEffect, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { onValue } from 'firebase/database';
import { pulsesRef, addHeartbeatPulse } from '../firebase';
import { latLngToVector3 } from '../utils/coordinates';
import { Pulse } from './Pulse';
import { getLocation } from '../utils/location';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// Define the PulseData type
interface PulseData {
  id: string;
  position: [number, number, number];
  bpm: number;
  timestamp: number;
  alive: boolean;
}

// Main Globe Component
export function Globe() {
  const [pulses, setPulses] = useState<PulseData[]>([]);
  const [userLastPulse, setUserLastPulse] = useState<number | null>(null);
  const { camera, raycaster, pointer } = useThree();
  const earth = useLoader(GLTFLoader, '/low_poly_earth.glb');

  // Fetch pulses from Firebase and filter active ones
  useEffect(() => {
    const unsubscribe = onValue(pulsesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const now = Date.now();
      const activePulses: PulseData[] = Object.entries(data)
        .map(([id, pulse]: [string, any]) => ({
          id,
          position: latLngToVector3(pulse.lat, pulse.lng) as [number, number, number],
          bpm: pulse.bpm || 60, // Default to 60 BPM if not specified
          timestamp: pulse.timestamp as number,
          alive: (now - pulse.timestamp) < 24 * 60 * 60 * 1000,
        }))
        .filter((pulse) => pulse.alive);

      setPulses(activePulses);
    });

    return () => unsubscribe();
  }, []);

  // Render the globe and pulses
  return (
    <group position={[0, 0, 0]}>
      <primitive
        object={earth.scene}
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 1, 0]}
      />
      
      {pulses.map((pulse) => (
        <Pulse
          key={pulse.id}
          position={pulse.position}
          bpm={pulse.bpm}
          timestamp={pulse.timestamp}
        />
      ))}
    </group>
  );
}