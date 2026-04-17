import React, { useEffect, useState } from 'react';

interface SimpleLoadingAnimationProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

const SimpleLoadingAnimation: React.FC<SimpleLoadingAnimationProps> = ({ 
  message = "Loading next round...", 
  duration = 3000,
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <div className="loading-animation-container">
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="simple-loader">
            <div className="loader-cube">
              <div className="cube-face cube-front"></div>
              <div className="cube-face cube-back"></div>
              <div className="cube-face cube-left"></div>
              <div className="cube-face cube-right"></div>
              <div className="cube-face cube-top"></div>
              <div className="cube-face cube-bottom"></div>
            </div>
            <div className="loader-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          </div>
          <div className="loading-text">
            <h2>{message}</h2>
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoadingAnimation;
