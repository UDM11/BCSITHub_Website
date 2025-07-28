// src/components/auth/SignUpForm.tsx
import React, { useState } from 'react';
import { registerUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await registerUser(email, password);
      toast.success('Verification email sent. Please check your inbox.');

      // Optional: redirect to OTPVerification page
      navigate('/verify');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
}
