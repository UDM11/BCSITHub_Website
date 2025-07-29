import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Backendless from 'backendless';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

interface FormData {
  email: string;
}

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Backendless password restore
      await Backendless.UserService.restorePassword(data.email);
      setMessage('Check your email for the password reset link.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-gray-600">Enter your email to receive a reset link</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {message}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
              />

              <Button type="submit" className="w-full" size="lg" loading={loading} icon={Send}>
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Remembered your password?{' '}
              <Link to="/signin" className="text-indigo-600 font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
