import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';  // <-- Import your Button component here

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const LoginRedirectModal: React.FC<Props> = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOk = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-3">Login Required</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-5">{message}</p>
        <Button onClick={handleOk}>
          OK
        </Button>
      </div>
    </div>
  );
};

export default LoginRedirectModal;
