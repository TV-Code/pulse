import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAC-Kyb9Le6N_MdQgd3JW__auHT5aU0KvY",
    authDomain: "pulse-12427.firebaseapp.com",
    projectId: "pulse-12427",
    storageBucket: "pulse-12427.firebasestorage.app",
    messagingSenderId: "992266187797",
    appId: "1:992266187797:web:f176f7900f88cfb8994a1c"
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