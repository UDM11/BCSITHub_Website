import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  GraduationCap,
  Award,
  Zap,
  Shield,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

// Features data
const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Notes',
    description: 'Access semester-wise and chapter-wise tutorials, notes, and study materials.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    icon: Users,
    title: 'Expert Teachers',
    description: 'Learn from experienced teachers who upload video courses and assignments.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: FileText,
    title: 'Notes',
    description: 'Access semester-wise and chapter-wise tutorials, notes, and study materials.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: GraduationCap,
    title: 'Past Papers',
    description: 'Access question papers from previous exams shared by students across colleges.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

// Stats data
const stats = [
  { label: 'Active Students', value: '2,500+', icon: Users },
  { label: 'Practice Questions', value: '10,000+', icon: FileText },
  { label: 'Video Courses', value: '500+', icon: BookOpen },
  { label: 'College Partners', value: '25+', icon: Award },
];

// Reusable button component
const PrimaryButton = ({ icon: Icon, children, disabled, onClick }) => (
  <Button
    size="lg"
    className={`bg-black text-white hover:bg-white hover:text-black w-full sm:w-auto ${
      disabled ? 'opacity-70 cursor-not-allowed' : ''
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {Icon && <Icon />}
    {children}
  </Button>
);

// Reusable info card component
const InfoCard = ({ icon: Icon, title, description, color, bgColor }) => (
  <Card className="h-full hover:scale-105 transition-transform duration-300">
    <CardContent className="text-center">
      <div className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

export function Home() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      await new Promise((res) => setTimeout(res, 1500));
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Preparing your learning resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              BCSITHub
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto"
          >
            Your comprehensive educational platform for BCSIT students at Pokhara University.
            Access notes, past papers, share resources, and excel in your academics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <PrimaryButton
              icon={GraduationCap}
              onClick={() => !user && navigate('/signup')}
              disabled={!!user}
            >
              Get Started Free
            </PrimaryButton>
            <Link to="/syllabus" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto"
              >
                <BookOpen />
                Explore Syllabus
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed specifically for BCSIT students
            </p>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <InfoCard {...feature} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of BCSIT students who are already excelling with BCSITHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton
              icon={Zap}
              onClick={() => !user && navigate('/signup')}
              disabled={!!user}
            >
              Start Learning Today
            </PrimaryButton>
            <Link to="/colleges" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto"
              >
                <Shield />
                Find Your College
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
