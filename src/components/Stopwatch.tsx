import React, { useState, useEffect, useRef } from 'react';

interface StopwatchProps {
  isRunning?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  className?: string;
}

const Stopwatch: React.FC<StopwatchProps> = ({ 
  isRunning = false, 
  onTimeUpdate,
  className = '' 
}) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 0.1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 10);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds}`;
  };

  return (
    <div className={`stopwatch ${className}`}>
      <div className="stopwatch-display">
        <div className="stopwatch-time">{formatTime(time)}</div>
        <div className="stopwatch-label">STOPWATCH</div>
      </div>
      <div className="stopwatch-controls">
        <div className="stopwatch-btn top-btn"></div>
        <div className="stopwatch-btn side-btn left-btn"></div>
        <div className="stopwatch-btn side-btn right-btn"></div>
      </div>
    </div>
  );
};

export default Stopwatch;
