import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  CheckCircle,
  Clock,
  User,
  Send,
  FileText,
  Video,
  Book,
  Zap,
  Heart,
  Star,
  ThumbsUp,
  AlertCircle,
  Info,
  Settings,
  Shield,
  Globe,
  Users,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  items: string[];
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create an account on BCSITHub?',
    answer: 'To create an account, click the "Sign Up" button in the top right corner, fill in your details including your student ID, email, and create a secure password. You\'ll receive a verification email to activate your account.',
    category: 'account',
    helpful: 45
  },
  {
    id: '2',
    question: 'How can I access past papers and notes?',
    answer: 'Once logged in, navigate to the "Notes" or "Past Papers" section from the main menu. You can filter by semester, subject, and year to find the specific materials you need.',
    category: 'academic',
    helpful: 38
  },
  {
    id: '3',
    question: 'Is the CGPA calculator accurate?',
    answer: 'Yes, our CGPA calculator follows the official Pokhara University grading system. However, always verify important calculations with your academic advisor for official purposes.',
    category: 'tools',
    helpful: 52
  },
  {
    id: '4',
    question: 'How do I report inappropriate content?',
    answer: 'You can report inappropriate content by clicking the "Report" button next to any post or content, or by contacting our moderation team directly through the contact form.',
    category: 'safety',
    helpful: 29
  },
  {
    id: '5',
    question: 'Can I contribute notes and materials?',
    answer: 'Absolutely! We encourage students to share their notes and materials. Use the "Upload" feature in the respective sections, and our team will review and approve quality content.',
    category: 'contribution',
    helpful: 41
  },
  {
    id: '6',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email. Make sure to check your spam folder if you don\'t see the email.',
    category: 'account',
    helpful: 33
  }
];

const supportCategories: SupportCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'New to BCSITHub? Learn the basics',
    icon: Book,
    color: 'from-blue-500 to-cyan-500',
    items: ['Account Setup', 'Platform Navigation', 'First Steps Guide', 'Profile Completion']
  },
  {
    id: 'academic-help',
    title: 'Academic Support',
    description: 'Help with studies and resources',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    items: ['Finding Notes', 'Past Papers Access', 'Study Groups', 'Academic Calendar']
  },
  {
    id: 'technical-support',
    title: 'Technical Issues',
    description: 'Troubleshooting and bug reports',
    icon: Settings,
    color: 'from-purple-500 to-pink-500',
    items: ['Login Problems', 'Upload Issues', 'Browser Compatibility', 'Mobile App Support']
  },
  {
    id: 'tools-features',
    title: 'Tools & Features',
    description: 'Using our educational tools',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    items: ['CGPA Calculator', 'Quiz Generator', 'Pomodoro Timer', 'Code Compiler']
  }
];

export function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center">
                <Headphones className="w-6 h-6 mr-2 text-orange-600" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Support Center</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">24/7 Support Available</span>
              <span className="sm:hidden">24/7 Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <HelpCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 px-4">
            Get instant answers to your questions or reach out to our support team. 
            We're here to make your BCSITHub experience smooth and productive.
          </p>

          {/* Search Bar */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-lg text-lg"
            />
          </motion.div>
        </motion.div>

        {/* Support Categories */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="shadow-lg border-0 bg-white overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <ul className="space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-500 flex items-center">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="all">All Categories</option>
                <option value="account">Account</option>
                <option value="academic">Academic</option>
                <option value="tools">Tools</option>
                <option value="safety">Safety</option>
                <option value="contribution">Contribution</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-md border-0 bg-white overflow-hidden">
                    <CardContent className="p-0">
                      <motion.div
                        className="p-6 cursor-pointer"
                        onClick={() => toggleFAQ(faq.id)}
                        whileHover={{ backgroundColor: "rgba(249, 115, 22, 0.02)" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 pr-4">
                              {faq.question}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center">
                                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {faq.helpful} helpful
                              </span>
                              <span className="capitalize px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {faq.category}
                              </span>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </div>
                      </motion.div>

                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-100"
                          >
                            <div className="p-6">
                              <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <span className="text-xs sm:text-sm text-gray-500">Was this helpful?</span>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Yes
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                    No
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg border-0 bg-white lg:sticky lg:top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-orange-600" />
                  Contact Support
                </h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                {/* Quick Contact Options */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Other Ways to Reach Us</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-3 text-orange-600" />
                      support@bcsithub.com
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-orange-600" />
                      +977-123-456-789
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-3 text-orange-600" />
                      24/7 Support Available
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Resources */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-8 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mb-6"
              >
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Need More Help?</h3>
                <p className="text-orange-100 mb-6">
                  Check out our video tutorials, user guides, and community forums for additional support.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button
                  className="bg-white text-orange-600 hover:bg-orange-50"
                  size="lg"
                >
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Video Tutorials</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  size="lg"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">User Guide</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 sm:col-span-2 md:col-span-1"
                  size="lg"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Community Forum</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}