import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  GraduationCap,
  Award,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  TrendingUp,
  Clock,
  Download,
  ArrowRight,
  Video,
  MessageCircle,
  Globe,
  Smartphone,
  Laptop,
  Target,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Plus,
  Minus,
  ExternalLink,
  Trophy,
  Brain,
  Lightbulb,
  Heart,
  Coffee,
  Bookmark,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Flame,
  Timer,
  BookmarkPlus,
  Share2,
  ThumbsUp,
  Eye,
  Headphones,
  FileVideo,
  Image,
  Mic,
  Camera,
  Gamepad2,
  Puzzle,
  Calculator,
  Code,
  Database,
  Server,
  Wifi,
  Lock,
  Unlock,
  Gift,
  Crown,
  Medal,
  Sparkles,
  Rocket,
  Mountain,
  Flag,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

// Features data
const features = [
  {
    icon: BookOpen,
    title: 'Smart Study Materials',
    description: 'AI-curated notes, tutorials, and resources tailored to your semester and learning pace.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Expert Community',
    description: 'Connect with top educators and peer mentors for personalized guidance.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Track your learning journey with detailed insights and performance metrics.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    icon: GraduationCap,
    title: 'Exam Excellence',
    description: 'Comprehensive past papers, mock tests, and exam strategies for guaranteed success.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    gradient: 'from-orange-500 to-red-600',
  },
];

// Testimonials data
const testimonials = [
  {
    name: 'Priya Sharma',
    role: '6th Semester, BCSIT',
    college: 'Pokhara University',
    content: 'BCSITHub transformed my study routine. The organized notes and past papers helped me score 85% in my finals!',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Rajesh Thapa',
    role: '8th Semester, BCSIT',
    college: 'Gandaki College',
    content: 'The video courses are exceptional. Expert teachers explain complex topics in the simplest way possible.',
    rating: 5,
    avatar: 'RT',
  },
  {
    name: 'Anita Gurung',
    role: '4th Semester, BCSIT',
    college: 'Cosmos College',
    content: 'Amazing platform! The community support and resources are exactly what BCSIT students need.',
    rating: 5,
    avatar: 'AG',
  },
];

// Quick access features
const quickFeatures = [
  { icon: Clock, title: 'Study Planner', description: 'Personalized study schedules' },
  { icon: Download, title: 'Offline Access', description: 'Download materials for offline study' },
  { icon: CheckCircle, title: 'Progress Tracking', description: 'Monitor your learning milestones' },
];

// Popular courses data
const popularCourses = [
  {
    title: 'Data Structures & Algorithms',
    semester: '3rd Semester',
    students: '1,200+',
    rating: 4.9,
    image: '📊',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs'],
  },
  {
    title: 'Database Management System',
    semester: '4th Semester', 
    students: '980+',
    rating: 4.8,
    image: '🗄️',
    topics: ['SQL', 'Normalization', 'Transactions', 'Indexing'],
  },
  {
    title: 'Web Development',
    semester: '5th Semester',
    students: '1,500+',
    rating: 4.9,
    image: '🌐',
    topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
  },
];

// How it works steps
const howItWorksSteps = [
  {
    step: '01',
    title: 'Sign Up Free',
    description: 'Create your account in seconds and get instant access to all resources.',
    icon: Users,
  },
  {
    step: '02', 
    title: 'Choose Your Semester',
    description: 'Select your current semester and customize your learning path.',
    icon: Target,
  },
  {
    step: '03',
    title: 'Start Learning',
    description: 'Access notes, videos, and practice materials tailored to your needs.',
    icon: BookOpen,
  },
  {
    step: '04',
    title: 'Track Progress',
    description: 'Monitor your learning journey and achieve academic excellence.',
    icon: TrendingUp,
  },
];

// FAQ data
const faqs = [
  {
    question: 'Is BCSITHub completely free to use?',
    answer: 'Yes! BCSITHub is completely free for all BCSIT students. We believe education should be accessible to everyone.',
  },
  {
    question: 'Which semesters and subjects are covered?',
    answer: 'We cover all 8 semesters of BCSIT program with comprehensive materials for every subject in the Pokhara University curriculum.',
  },
  {
    question: 'Can I download materials for offline study?',
    answer: 'Absolutely! You can download notes, past papers, and other study materials to access them offline anytime.',
  },
  {
    question: 'How often is the content updated?',
    answer: 'Our content is regularly updated by expert teachers and students. New materials are added weekly based on the latest curriculum.',
  },
  {
    question: 'Can I contribute my own notes and materials?',
    answer: 'Yes! We encourage students to share their notes and resources. You can upload materials after creating an account.',
  },
];

// Partner colleges
const partnerColleges = [
  'Gandaki College of Engineering',
  'Cosmos College of Management',
  'Pokhara Engineering College',
  'Herald College Kathmandu',
  'Kantipur Engineering College',
  'Prime College',
];

// Success stories data
const successStories = [
  {
    name: 'Suman Karki',
    achievement: 'Secured Job at Microsoft',
    story: 'BCSITHub helped me master algorithms and data structures. The practice problems were exactly what I needed for technical interviews.',
    image: 'SK',
    company: 'Microsoft',
    salary: 'NPR 2,50,000/month',
    semester: '8th Semester Graduate',
  },
  {
    name: 'Kritika Shrestha',
    achievement: 'Started Tech Startup',
    story: 'The web development resources on BCSITHub gave me the foundation to build my own EdTech startup serving 10,000+ students.',
    image: 'KS',
    company: 'EduTech Nepal',
    salary: 'Founder & CEO',
    semester: '7th Semester Graduate',
  },
  {
    name: 'Bibek Adhikari',
    achievement: 'Full Stack Developer',
    story: 'From struggling with programming basics to becoming a full-stack developer. BCSITHub made the impossible possible.',
    image: 'BA',
    company: 'Leapfrog Technology',
    salary: 'NPR 1,80,000/month',
    semester: '6th Semester Graduate',
  },
];

// Study tools data
const studyTools = [
  {
    icon: Calculator,
    title: 'CGPA Calculator',
    description: 'Calculate your CGPA and track academic progress',
    users: '15,000+',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    description: 'Boost productivity with focused study sessions',
    users: '8,500+',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Puzzle,
    title: 'Code Compiler',
    description: 'Practice coding with our online compiler',
    users: '12,000+',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Brain,
    title: 'Quiz Generator',
    description: 'AI-powered quizzes for better retention',
    users: '20,000+',
    color: 'from-purple-500 to-violet-500',
  },
];

// Live stats data
const liveStats = [
  { label: 'Students Online', value: '1,247', icon: Activity, color: 'text-green-500' },
  { label: 'Notes Downloaded Today', value: '3,892', icon: Download, color: 'text-blue-500' },
  { label: 'Questions Solved', value: '15,634', icon: CheckCircle, color: 'text-purple-500' },
  { label: 'Study Hours This Week', value: '28,456', icon: Clock, color: 'text-orange-500' },
];

// Community features
const communityFeatures = [
  {
    icon: MessageCircle,
    title: 'Discussion Forums',
    description: 'Connect with peers and get help from seniors',
    count: '2,500+ discussions',
  },
  {
    icon: Users,
    title: 'Study Groups',
    description: 'Join or create study groups for collaborative learning',
    count: '150+ active groups',
  },
  {
    icon: Lightbulb,
    title: 'Doubt Clearing',
    description: 'Get instant help from expert mentors',
    count: '500+ mentors online',
  },
  {
    icon: Share2,
    title: 'Resource Sharing',
    description: 'Share and discover study materials',
    count: '10,000+ resources shared',
  },
];

// Achievement badges
const achievements = [
  { icon: Trophy, title: 'Top Performer', description: 'Score 90%+ in semester', color: 'text-yellow-500' },
  { icon: Flame, title: 'Study Streak', description: '30 days continuous learning', color: 'text-red-500' },
  { icon: Crown, title: 'Quiz Master', description: 'Complete 100+ quizzes', color: 'text-purple-500' },
  { icon: Medal, title: 'Helper', description: 'Help 50+ students', color: 'text-blue-500' },
  { icon: Rocket, title: 'Fast Learner', description: 'Complete course in record time', color: 'text-green-500' },
  { icon: Mountain, title: 'Challenger', description: 'Solve hardest problems', color: 'text-gray-500' },
];

// Pricing comparison
const pricingFeatures = [
  { feature: 'Access to all notes and materials', free: true, premium: true },
  { feature: 'Past papers and solutions', free: true, premium: true },
  { feature: 'Basic study tools', free: true, premium: true },
  { feature: 'Community access', free: true, premium: true },
  { feature: 'Advanced analytics', free: false, premium: true },
  { feature: 'Priority support', free: false, premium: true },
  { feature: 'Offline downloads', free: false, premium: true },
  { feature: 'Ad-free experience', free: false, premium: true },
  { feature: 'Exclusive content', free: false, premium: true },
];

// Stats data
const stats = [
  { label: 'Active Students', value: '2,500+', icon: Users },
  { label: 'Practice Questions', value: '10,000+', icon: FileText },
  { label: 'Video Courses', value: '500+', icon: BookOpen },
  { label: 'College Partners', value: '25+', icon: Award },
];

// Reusable button component
const PrimaryButton = ({ icon: Icon, children, disabled, onClick }: any) => (
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

// Enhanced feature card component
const FeatureCard = ({ icon: Icon, title, description, color, bgColor, gradient, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="group"
  >
    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <CardContent className="text-center p-8 relative z-10">
        <motion.div 
          className={`w-20 h-20 ${bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className={`w-10 h-10 ${color}`} />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <motion.div 
          className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: -20 }}
          whileHover={{ x: 0 }}
        >
          <ChevronRight className="w-5 h-5 text-indigo-600 mx-auto" />
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
);

// Testimonial card component
const TestimonialCard = ({ testimonial, index }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
    <div className="flex items-center">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
        {testimonial.avatar}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
        <p className="text-xs text-indigo-600">{testimonial.college}</p>
      </div>
    </div>
  </motion.div>
);

export function Home() {
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [liveStatsValues, setLiveStatsValues] = useState(liveStats);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    async function init() {
      await new Promise((res) => setTimeout(res, 1000));
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStatsValues(prev => prev.map(stat => ({
        ...stat,
        value: (parseInt(stat.value.replace(',', '')) + Math.floor(Math.random() * 10)).toLocaleString()
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <motion.div 
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto"></div>
          </motion.div>
          <motion.p 
            className="text-gray-600 mt-6 text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Preparing your learning experience...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center min-h-screen">
          <div className="w-full text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">Trusted by 2,500+ BCSIT Students</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              Master{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                BCSIT
              </span>
              <br />with Confidence
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-12 text-indigo-100 max-w-4xl mx-auto leading-relaxed"
            >
              The ultimate learning platform designed exclusively for BCSIT students. 
              Access premium study materials, connect with expert mentors, and achieve academic excellence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PrimaryButton
                  icon={GraduationCap}
                  onClick={() => !user && navigate('/signup')}
                  disabled={!!user}
                >
                  Start Learning Free
                </PrimaryButton>
              </motion.div>
              
              <Link to="/syllabus" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/30 text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto backdrop-blur-sm bg-white/10"
                  >
                    <Play className="mr-2" />
                    Watch Demo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Quick features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              {quickFeatures.map((feature, index) => (
                <div key={feature.title} className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <feature.icon className="w-6 h-6 text-indigo-200 mr-3" />
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-indigo-200">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        <motion.div style={{ y: y1 }} className="absolute top-20 right-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30" />
        <motion.div style={{ y: y2 }} className="absolute bottom-20 left-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-indigo-100 text-indigo-600 rounded-full px-6 py-2 mb-6">
              <Zap className="w-5 h-5 mr-2" />
              <span className="font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Excel</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools and resources designed specifically for BCSIT students at Pokhara University
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-purple-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">Join the growing community of successful BCSIT students</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div 
                  className="flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <motion.div 
                  className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-yellow-100 text-yellow-600 rounded-full px-6 py-2 mb-6">
              <Star className="w-5 h-5 mr-2 fill-current" />
              <span className="font-semibold">Student Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Students Say About
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> BCSITHub</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from BCSIT students who transformed their academic journey with us
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-green-100 text-green-600 rounded-full px-6 py-2 mb-6">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-semibold">Most Popular</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Top Courses This
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Semester</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students mastering these essential BCSIT subjects
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div className="text-4xl mb-4">{course.image}</div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                      {course.semester}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.students} students enrolled</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.topics.map((topic) => (
                      <span key={topic} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-600 rounded-full px-6 py-2 mb-6">
              <Play className="w-5 h-5 mr-2" />
              <span className="font-semibold">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How BCSITHub
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and transform your learning experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200 transform -translate-x-1/2" />
                )}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center bg-purple-100 text-purple-600 rounded-full px-6 py-2 mb-6">
                <Smartphone className="w-5 h-5 mr-2" />
                <span className="font-semibold">Multi-Platform</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Study Anywhere,
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Anytime</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Access BCSITHub on any device - desktop, tablet, or mobile. 
                Your progress syncs seamlessly across all platforms.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <Laptop className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Desktop & Laptop</h4>
                    <p className="text-gray-600">Full-featured experience with advanced tools</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mobile App</h4>
                    <p className="text-gray-600">Study on-the-go with offline capabilities</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Web Browser</h4>
                    <p className="text-gray-600">No downloads needed, works everywhere</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">📱 Mobile App Coming Soon!</h3>
                  <p className="text-indigo-100 mb-6">
                    Get notified when our mobile app launches with exclusive features and offline access.
                  </p>
                  <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                    Notify Me
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-orange-100 text-orange-600 rounded-full px-6 py-2 mb-6">
              <MessageCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Got Questions?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about BCSITHub
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
              <Mail className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="font-semibold text-white">Stay Updated</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Never Miss an
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Update</span>
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
              Get the latest study materials, exam updates, and exclusive content delivered to your inbox.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-900"
                />
                <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8 py-4 rounded-xl font-semibold">
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-indigo-200 text-sm mt-4">
                Join 5,000+ students already subscribed. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-green-100 text-green-600 rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 mr-2" />
              <span className="font-semibold">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              From Students to
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real success stories from BCSIT graduates who transformed their careers with BCSITHub
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4">
                      {story.image}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                      <p className="text-green-600 font-semibold">{story.achievement}</p>
                      <p className="text-sm text-gray-500">{story.semester}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{story.story}"</p>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{story.company}</p>
                        <p className="text-sm text-gray-600">{story.salary}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Activity className="w-5 h-5 text-green-400 mr-2" />
              <span className="font-semibold">Live Activity</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-time Platform
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Activity</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {liveStatsValues.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-700 transition-colors"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Tools Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-indigo-100 text-indigo-600 rounded-full px-6 py-2 mb-6">
              <Puzzle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Study Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Tools for
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Better Learning</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your study experience with our suite of interactive tools
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {studyTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{tool.title}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{tool.users} users</span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-purple-100 text-purple-600 rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 mr-2" />
              <span className="font-semibold">Community</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Learn Together,
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Grow Together</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a vibrant community of BCSIT students helping each other succeed
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
                  {feature.count}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-yellow-500/20 text-yellow-400 rounded-full px-6 py-2 mb-6">
              <Award className="w-5 h-5 mr-2" />
              <span className="font-semibold">Achievements</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Unlock Your
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Potential</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Earn badges and recognition as you progress through your learning journey
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                <achievement.icon className={`w-12 h-12 ${achievement.color} mx-auto mb-4`} />
                <h3 className="font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-blue-100 text-blue-600 rounded-full px-6 py-2 mb-6">
              <Gift className="w-5 h-5 mr-2" />
              <span className="font-semibold">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Learning Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and upgrade when you're ready for advanced features
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">₹0</div>
                <p className="text-gray-600">Forever free for all students</p>
              </div>
              <ul className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.free ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                    )}
                    <span className={feature.free ? 'text-gray-900' : 'text-gray-400'}>
                      {feature.feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-gray-800">
                Get Started Free
              </Button>
            </motion.div>
            
            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-2 rounded-bl-2xl font-bold text-sm">
                POPULAR
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold mb-2">₹99</div>
                <p className="text-indigo-100">Per month, cancel anytime</p>
              </div>
              <ul className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-white">{feature.feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">
                Upgrade to Premium
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Colleges Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Leading Colleges</h3>
            <p className="text-gray-600">Students from top BCSIT colleges choose BCSITHub</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {partnerColleges.map((college, index) => (
              <div key={college} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{college}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(159, 122, 234, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
              <Zap className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="font-semibold">Limited Time Offer</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Your Learning?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of BCSIT students who are already excelling with BCSITHub.
              Start your journey to academic excellence today!
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PrimaryButton
                  icon={Zap}
                  onClick={() => !user && navigate('/signup')}
                  disabled={!!user}
                >
                  Start Learning Today
                </PrimaryButton>
              </motion.div>
              
              <Link to="/colleges" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/30 text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto backdrop-blur-sm bg-white/10"
                  >
                    <Shield className="mr-2" />
                    Find Your College
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-indigo-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>100% Free to Start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Instant Access</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
