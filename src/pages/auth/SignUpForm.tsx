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
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser({ email, password, name, role });
      toast.success('Verification email sent. Please check your inbox.');
      navigate('/verify');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <Input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

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

      <select
        value={role}
        onChange={e => setRole(e.target.value as 'student' | 'teacher' | 'admin')}
        className="w-full p-2 border rounded"
        required
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
}
