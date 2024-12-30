import { useState, useCallback, useEffect } from 'react';

interface HeartbeatRecording {
  isRecording: boolean;
  beats: number[];
  averageBPM: number | null;
  timeRemaining: number;
}

export const useHeartbeatRecorder = (recordingDuration: number = 15) => {
  const [recording, setRecording] = useState<HeartbeatRecording>({
    isRecording: false,
    beats: [],
    averageBPM: null,
    timeRemaining: recordingDuration
  });

  const startRecording = useCallback(() => {
    setRecording({
      isRecording: true,
      beats: [],
      averageBPM: null,
      timeRemaining: recordingDuration
    });
  }, [recordingDuration]);

  const addBeat = useCallback(() => {
    if (!recording.isRecording) return;
    
    setRecording(prev => ({
      ...prev,
      beats: [...prev.beats, Date.now()]
    }));
  }, [recording.isRecording]);

  const calculateBPM = useCallback((beats: number[]): number => {
    if (beats.length < 2) return 0;
    
    // Calculate intervals between beats
    const intervals = beats.slice(1).map((beat, i) => beat - beats[i]);
    
    // Calculate average interval in milliseconds
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    
    // Convert to BPM
    return Math.round(60000 / avgInterval);
  }, []);

  // Handle countdown and recording completion
  useEffect(() => {
    if (!recording.isRecording) return;

    const interval = setInterval(() => {
      setRecording(prev => {
        if (prev.timeRemaining <= 0) {
          const bpm = calculateBPM(prev.beats);
          return {
            ...prev,
            isRecording: false,
            averageBPM: bpm,
            timeRemaining: 0
          };
        }
        
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [recording.isRecording, calculateBPM]);

  return {
    isRecording: recording.isRecording,
    timeRemaining: recording.timeRemaining,
    averageBPM: recording.averageBPM,
    startRecording,
    addBeat
  };
};