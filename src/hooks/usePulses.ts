import { useState, useCallback } from "react";
import * as THREE from 'three'

interface Pulse {
    id: string;
    position: [number, number, number];
    radius: number;
    alive: boolean;
  }
  
  export const usePulses = () => {
    const [pulses, setPulses] = useState<Pulse[]>([]);
    
    const checkPulseMerge = useCallback((pulses: Pulse[]) => {
      const merged: Pulse[] = [...pulses];
      
      for (let i = 0; i < merged.length; i++) {
        for (let j = i + 1; j < merged.length; j++) {
          const p1 = merged[i];
          const p2 = merged[j];
          
          if (!p1.alive || !p2.alive) continue;
          
          const distance = new THREE.Vector3(...p1.position)
            .distanceTo(new THREE.Vector3(...p2.position));
            
          if (distance < (p1.radius + p2.radius)) {
            // Merge pulses
            const newRadius = Math.max(p1.radius, p2.radius) * 1.5;
            const newPosition = [
              (p1.position[0] + p2.position[0]) / 2,
              (p1.position[1] + p2.position[1]) / 2,
              (p1.position[2] + p2.position[2]) / 2,
            ] as [number, number, number];
            
            merged[i] = {
              ...p1,
              position: newPosition,
              radius: newRadius
            };
            merged[j] = { ...p2, alive: false };
          }
        }
      }
      
      return merged.filter(p => p.alive);
    }, []);
    
    return { pulses, checkPulseMerge };
  };