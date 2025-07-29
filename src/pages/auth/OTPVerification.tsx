import React, { useState, useEffect } from 'react';
import Backendless from 'backendless';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const { user, reloadUser } = useAuth();
  const navigate = useNavigate();

  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Redirect to sign-in if no user
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Countdown for resend cooldown
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Resend email confirmation
  const handleResend = async () => {
    if (!user?.email) {
      toast.error('No user email found.');
      return;
    }

    try {
      setSending(true);
      await Backendless.UserService.resendEmailConfirmation(user.email);
      toast.success('Verification email resent. Check your inbox!');
      setCooldown(60); // 60 seconds cooldown
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email.');
    } finally {
      setSending(false);
    }
  };

  // Check email verification status
  const handleCheckVerification = async () => {
    if (!user?.objectId) {
      toast.error('User ID not found.');
      return;
    }

    try {
      setChecking(true);

      // Corrected: Use Backendless Data API to fetch user by objectId
      const updatedUser = await Backendless.Data.of('Users').findById(user.objectId);

      // Update user in auth context or local state (make sure reloadUser accepts updated user)
      await reloadUser(updatedUser);

      if (updatedUser.emailConfirmed) {
        toast.success('Email verified! Redirecting...');
        navigate('/profile');
      } else {
        toast.error('Email not verified yet. Please check your inbox.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to check verification status.');
    } finally {
      setChecking(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">Verify Your Email</h2>
        <p className="mb-6 text-gray-700">
          A verification email has been sent to <strong>{user.email}</strong>.
          <br />
          Please check your inbox or Spam mail and click the verification link to activate your account.
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
