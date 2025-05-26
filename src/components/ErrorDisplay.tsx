import React, { useEffect } from 'react';

interface ErrorDisplayProps {
  message: string;
  onClose: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="error">
      {message}
      <button onClick={onClose} className="error-close">×</button>
    </div>
  );
};

export default ErrorDisplay;