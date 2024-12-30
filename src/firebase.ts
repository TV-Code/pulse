import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push } from 'firebase/database';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  
  export const pulsesRef = ref(db, 'pulses');
  
  interface HeartbeatPulse {
    lat: number;
    lng: number;
    timestamp: number;
    bpm: number;
    alive: boolean;
  }
  
  export const addHeartbeatPulse = (lat: number, lng: number, bpm: number) => {
    push(pulsesRef, {
      lat,
      lng,
      bpm,
      timestamp: Date.now(),
      alive: true
    });
  };
  
  export const subscribeToPulses = (callback: (pulses: Record<string, HeartbeatPulse>) => void) => {
    return onValue(pulsesRef, (snapshot) => {
      const data = snapshot.val() as Record<string, HeartbeatPulse> | null;
      if (data) {
        callback(data);
      }
    });
  };