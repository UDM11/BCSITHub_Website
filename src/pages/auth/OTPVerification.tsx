import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const { user, reloadUser } = useAuth();
  const navigate = useNavigate();

  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Resend verification email handler
  const handleResend = async () => {
    if (!auth.currentUser) {
      toast.error('No user logged in.');
      return;
    }

    try {
      setSending(true);
      await sendEmailVerification(auth.currentUser);
      toast.success('Verification email resent. Check your inbox!');
      setCooldown(60); // 60 seconds cooldown before resend again
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email.');
    } finally {
      setSending(false);
    }
  };

  // Check if email is verified now
  const handleCheckVerification = async () => {
    try {
      setChecking(true);
      await reloadUser(); // Use context reloadUser to refresh current user

      if (auth.currentUser?.emailVerified) {
        toast.success('Email verified! Redirecting...');
        navigate('/profile'); // Redirect to protected page after verification
      } else {
        toast.error('Email not verified yet. Please check your inbox.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to check verification status.');
    } finally {
      setChecking(false);
    }
  };

  if (!user) {
    return null; // or loading spinner if you want
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">Verify Your Email</h2>
        <p className="mb-6 text-gray-700">
          A verification email has been sent to <strong>{user.email}</strong>.
          <br />
          Please check your inbox or Spam and click the verification link to activate your account.
        </p>

        <Button
          onClick={handleCheckVerification}
          disabled={checking}
          className="mb-4 w-full"
        >
          {checking ? 'Checking...' : 'I Have Verified My Email'}
        </Button>

        <div className="mb-4 text-sm text-gray-600">
          Didn&apos;t receive the email?{' '}
          <button
            onClick={handleResend}
            disabled={sending || cooldown > 0}
            className={`font-semibold underline ml-1 ${
              sending || cooldown > 0
                ? 'cursor-not-allowed text-gray-400'
                : 'cursor-pointer text-indigo-600 hover:text-indigo-800'
            }`}
          >
            {sending
              ? 'Sending...'
              : cooldown > 0
              ? `Resend available in ${cooldown}s`
              : 'Resend Email'}
          </button>
        </div>

        <Button variant="outline" className="w-full" onClick={() => navigate('/signin')}>
          Back to Sign In
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
