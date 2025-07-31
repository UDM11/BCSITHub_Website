import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, User, UserPlus, BookOpen, MapPin } from 'lucide-react';
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
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BCSITHub
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join BCSITHub</h2>
          <p className="text-gray-600">Create your account and start learning</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Create Account</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                {...register('name')}
                error={errors.name?.message}
                required
              />

              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              <Select
                label="Role"
                options={roleOptions}
                {...register('role')}
                error={errors.role?.message}
                required
              />

              {watchedRole === 'student' && (
                <>
                  <Select
                    label="Semester"
                    options={semesterOptions}
                    {...register('semester')}
                    error={errors.semester?.message}
                    required
                  />

                  <Select
                    label="College"
                    options={collegeOptions}
                    {...register('college')}
                    error={errors.college?.message}
                    required
                  />

                  {watchedCollege && watchedCollege !== 'Other' && (
                    <div className="flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{getCollegeAddress()}</span>
                    </div>
                  )}
                </>
              )}

              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                required
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                icon={UserPlus}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
