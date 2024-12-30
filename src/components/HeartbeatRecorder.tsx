import React, { useCallback } from 'react';
import { useHeartbeatRecorder } from '../hooks/useHearbeatRecorder';
import { addHeartbeatPulse } from '../firebase';
import { getLocation } from '../utils/location';

export const HeartbeatRecorder: React.FC = () => {
  const { isRecording, timeRemaining, averageBPM, startRecording, addBeat } = useHeartbeatRecorder(15);

  const handleRecordComplete = useCallback(async () => {
    if (!averageBPM) return;
    
    try {
      const location = await getLocation();
      await addHeartbeatPulse(location.lat, location.lng, averageBPM);
      localStorage.setItem('lastPulseTime', Date.now().toString());
    } catch (error) {
      console.error('Failed to add heartbeat:', error);
    }
  }, [averageBPM]);

  React.useEffect(() => {
    if (!isRecording && averageBPM) {
      handleRecordComplete();
    }
  }, [isRecording, averageBPM, handleRecordComplete]);

  if (!isRecording && !averageBPM) {
    return (
        <div className="fadeIn" style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 'fit-content',
            textAlign: 'center',
            zIndex: 1000
          }}>
        <button 
          onClick={startRecording}
          style={{
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 500,
            borderRadius: '30px',
            border: 'none',
            background: 'var(--primary)',
            color: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 12px rgba(255, 75, 75, 0.2)'
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Share Your Heartbeat
        </button>
      </div>
    );
  }

  return (
    <div className="fadeIn" style={{ 
      position: 'fixed', 
      bottom: 40, 
      left: '50%', 
      transform: 'translateX(-50%)',
      textAlign: 'center',
      background: 'white',
      padding: '24px',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      {isRecording ? (
        <>
          <div style={{ 
            marginBottom: '16px', 
            fontSize: '16px',
            color: 'var(--muted)',
            letterSpacing: '0.5px'
          }}>
            Tap in rhythm with your heartbeat
          </div>
          <div style={{ 
            marginBottom: '24px', 
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--text)'
          }}>
            {timeRemaining}
          </div>
          <button 
            onClick={addBeat}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--primary)',
              color: 'white',
              cursor: 'pointer',
              animation: 'pulse 2s infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '1px',
              boxShadow: '0 6px 20px rgba(255, 75, 75, 0.25)'
            }}
          >
            TAP
          </button>
        </>
      ) : (
        <div style={{ padding: '12px 24px' }}>
          <div style={{ 
            fontSize: '14px',
            color: 'var(--muted)',
            marginBottom: '8px'
          }}>
            Your heartbeat
          </div>
          <div style={{ 
            fontSize: '32px',
            fontWeight: 600,
            color: 'var(--text)'
          }}>
            {averageBPM} BPM
          </div>
        </div>
      )}
    </div>
  );
};