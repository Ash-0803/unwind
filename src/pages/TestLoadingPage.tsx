import React, { useState, useEffect } from 'react';
import LoadingAnimation from '../components/LoadingAnimation';
import { useNavigate } from 'react-router-dom';

const TestLoadingPage: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true); // Show immediately on load
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleShowLoading = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 5000);
  };

  return (
    <div className="page center-empty">
      {showLoading ? (
        <LoadingAnimation 
          message="Testing 3D Animation..."
          duration={5000}
        />
      ) : (
        <div className="empty-state">
          <h1>3D Loading Animation Test</h1>
          <p>The 3D animation test has completed. Click the button to test again.</p>
          
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleShowLoading}
            style={{ margin: '1rem' }}
          >
            Show 3D Loading Animation Again
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ margin: '1rem' }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default TestLoadingPage;
