import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Send, BookOpen, Shield, Users, Award, CheckCircle, ArrowRight, Sparkles, Star, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
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
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Step 1: Check if user exists
      const response = await Backendless.Data.of('Users').find({
        where: `email = '${data.email}'`,
      });

      if (response.length === 0) {
        setError('No account found with this email address.');
      } else {
        // Step 2: Send password reset link
        await Backendless.UserService.restorePassword(data.email);
        setMessage('Password reset link sent successfully!');
        setEmailSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmailSent(false);
    setMessage('');
    setError('');
  };

  const securityFeatures = [
    'Secure password reset process',
    'Email verification required',
    'Account protection measures',
    'Encrypted communication'
  ];

  const stats = [
    { icon: Users, label: '2,500+', sublabel: 'Protected Users' },
    { icon: Shield, label: '100%', sublabel: 'Secure Process' },
    { icon: Award, label: '24/7', sublabel: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-xl"
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-200/20 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative min-h-screen flex">
        {/* Left Side - Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white p-8 xl:p-12 flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold">BCSITHub</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight">
            Secure Account
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Recovery
            </span>
          </h1>
          <p className="text-xl text-green-100 mb-8">
            We'll help you regain access to your account safely and securely.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
              Security Features:
            </h3>
            <ul className="space-y-3">
              {securityFeatures.map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center text-green-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                <div className="text-2xl font-bold">{stat.label}</div>
                <div className="text-xs text-green-200">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md xl:max-w-lg"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  BCSITHub
                </span>
              </div>
            </div>

            {/* Back to Sign In */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                to="/signin" 
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </motion.div>

            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {emailSent ? 'Check Your Email' : 'Forgot Password?'}
              </h2>
              <p className="text-gray-600 text-lg">
                {emailSent 
                  ? 'We\'ve sent a password reset link to your email'
                  : 'No worries! Enter your email and we\'ll send you a reset link'
                }
              </p>
            </div>

            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {!emailSent ? (
                    <motion.form 
                      key="form"
                      onSubmit={handleSubmit(onSubmit)} 
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <AnimatePresence>
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3"
                          >
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                            <span className="text-sm font-medium">{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            {...register('email')}
                            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 ${
                              errors.email ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 text-lg font-semibold"
                        loading={loading}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending Reset Link...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Send className="w-5 h-5" />
                            Send Reset Link
                          </div>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      className="text-center space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <Mail className="w-10 h-10 text-green-600" />
                      </motion.div>

                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">{message}</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">What's next?</p>
                            <ul className="space-y-1 text-xs">
                              <li>• Check your email inbox for the reset link</li>
                              <li>• Click the link to create a new password</li>
                              <li>• The link expires in 24 hours</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Didn't receive the email? Check your spam folder or
                        </p>
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          className="w-full border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!emailSent && (
                  <div className="mt-8 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-medium">Remember your password?</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link 
                        to="/signin" 
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                      >
                        <Star className="w-4 h-4" />
                        Sign in here
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Trusted Platform</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}