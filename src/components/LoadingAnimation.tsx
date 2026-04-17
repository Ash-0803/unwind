import React, { useEffect } from 'react';

interface LoadingAnimationProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Loading next round...", 
  duration = 3000,
  onComplete 
}) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return (
    <div className="loading-animation-container">
      <div className="loader"></div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  );
};

export default LoadingAnimation;
