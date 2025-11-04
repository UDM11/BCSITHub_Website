import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, UserPlus, BookOpen, MapPin, Eye, EyeOff, Shield, Users, Award, CheckCircle, ArrowRight, Sparkles, Star, GraduationCap, Building, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string().required('Role is required'),
  semester: yup.number().when('role', {
    is: 'student',
    then: (schema) => schema.required('Semester is required for students'),
    otherwise: (schema) => schema.notRequired(),
  }),
  college: yup.string().when('role', {
    is: 'student',
    then: (schema) => schema.required('College is required for students'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  semester?: number;
  college?: string;
}

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
];

const semesterOptions = [
  { value: 1, label: '1st Semester' },
  { value: 2, label: '2nd Semester' },
  { value: 3, label: '3rd Semester' },
  { value: 4, label: '4th Semester' },
  { value: 5, label: '5th Semester' },
  { value: 6, label: '6th Semester' },
  { value: 7, label: '7th Semester' },
  { value: 8, label: '8th Semester' },
];

const collegeOptions = [
  { value: 'Ace Institute of Management', label: 'Ace Institute of Management', address: 'Bibhuti Janak Marg, New Baneshwor, Kathmandu' },
  { value: 'Gandaki College of Engineering and Science', label: 'Gandaki College of Engineering and Science', address: 'Pokhara, Kaski' },
  { value: 'Nepal College of Information Technology', label: 'Nepal College of Information Technology', address: 'Balkumari, Lalitpur' },
  { value: 'Pokhara University', label: 'Pokhara University', address: 'Pokhara, Kaski' },
  { value: 'Prime College', label: 'Prime College', address: 'Devkota Sadak, Mid Baneshwor, Kathmandu' },
  { value: 'Kathmandu College of Technology', label: 'Kathmandu College of Technology', address: 'Sinamangal, Kathmandu' },
  { value: 'Medhavi College', label: 'Medhavi College', address: 'Shankhamul, Kathmandu' },
  { value: 'Crimson College of Technology', label: 'Crimson College of Technology', address: 'Devinagar, Butwal, Rupandehi' },
  { value: 'SAIM College', label: 'SAIM College', address: 'Old Baneswor Chowk, Kathmandu' },
  { value: 'Apollo International College', label: 'Apollo International College', address: 'Lakhechaur Marg, Baneshwor, Kathmandu' },
  { value: 'Quest International College', label: 'Quest International College', address: 'Gwarko, Lalitpur' },
  { value: 'Shubhashree College of Management', label: 'Shubhashree College of Management', address: 'New Baneshwor, Kathmandu' },
  { value: 'Liberty College', label: 'Liberty College', address: 'Pragati Marg-2, Anamnagar, Kathmandu' },
  { value: 'Uniglobe College', label: 'Uniglobe College', address: 'New Baneshwor, Kathmandu' },
  { value: 'Excel Business College', label: 'Excel Business College', address: 'Lakhechaur Marg, New Baneshwor, Kathmandu' },
  { value: 'Rajdhani Model College', label: 'Rajdhani Model College', address: 'Old Baneshwor, Kathmandu' },
  { value: 'Other', label: 'Other College', address: '' },
];

export function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedRole = watch('role');
  const watchedCollege = watch('college');

  const getCollegeAddress = () => {
    if (!watchedCollege) return '';
    const college = collegeOptions.find((c) => c.value === watchedCollege);
    return college ? college.address : '';
  };

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ['name', 'email', 'role'] 
      : ['password', 'confirmPassword'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError('');

      const additionalData: any = {};
      if (data.role === 'student') {
        additionalData.semester = data.semester;
        additionalData.college = data.college;
        additionalData.collegeAddress = getCollegeAddress();
      }

      await signUp(data.email, data.password, data.name, data.role, additionalData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Access to comprehensive study materials',
    'Interactive learning tools and calculators',
    'Past papers and exam resources',
    'Community support and discussions',
    'Progress tracking and analytics',
    'Mobile-friendly platform'
  ];

  const stats = [
    { icon: Users, label: '2,500+', sublabel: 'Active Students' },
    { icon: Award, label: '95%', sublabel: 'Success Rate' },
    { icon: Shield, label: '100%', sublabel: 'Secure Platform' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-200/20 rounded-full blur-xl"
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
            Start Your
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of BCSIT students and unlock your academic potential with our comprehensive platform.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
              Why choose BCSITHub?
            </h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center text-green-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300 flex-shrink-0" />
                  {benefit}
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

            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-lg">
                Join the community of successful BCSIT students
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Basic Info</span>
                </div>
                <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
                <div className={`flex items-center ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">Security</span>
                </div>
              </div>
            </div>

            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                  <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Enter your full name"
                              {...register('name')}
                              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 ${
                                errors.name ? 'border-red-300' : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              placeholder="Enter your email"
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

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            I am a
                          </label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                              {...register('role')}
                              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 ${
                                errors.role ? 'border-red-300' : 'border-gray-200'
                              }`}
                            >
                              <option value="">Select your role</option>
                              {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.role && (
                            <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                          )}
                        </div>

                        {watchedRole === 'student' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-6"
                          >
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Semester
                              </label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                  {...register('semester')}
                                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 ${
                                    errors.semester ? 'border-red-300' : 'border-gray-200'
                                  }`}
                                >
                                  <option value="">Select your semester</option>
                                  {semesterOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {errors.semester && (
                                <p className="mt-2 text-sm text-red-600">{errors.semester.message}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                College
                              </label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                  {...register('college')}
                                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 ${
                                    errors.college ? 'border-red-300' : 'border-gray-200'
                                  }`}
                                >
                                  <option value="">Select your college</option>
                                  {collegeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {errors.college && (
                                <p className="mt-2 text-sm text-red-600">{errors.college.message}</p>
                              )}
                            </div>

                            {watchedCollege && watchedCollege !== 'Other' && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded-xl border border-green-200"
                              >
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                <span>{getCollegeAddress()}</span>
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        <Button
                          type="button"
                          onClick={nextStep}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 text-lg font-semibold"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a strong password"
                              {...register('password')}
                              className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 ${
                                errors.password ? 'border-red-300' : 'border-gray-200'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              {...register('confirmPassword')}
                              className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 ${
                                errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                          )}
                        </div>

                        <div className="flex gap-4">
                          <Button
                            type="button"
                            onClick={prevStep}
                            variant="outline"
                            className="flex-1 py-3"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 font-semibold"
                            loading={loading}
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                Create Account
                              </div>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <div className="mt-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
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
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Join 2,500+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Free Forever</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}