import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Play, 
  RotateCcw, 
  Download, 
  Share2, 
  Settings, 
  Clock, 
  CheckCircle,
  XCircle,
  Award,
  Target,
  Zap,
  BookOpen,
  Users,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Eye,
  EyeOff,
  Star,
  Trophy,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Plus,
  Minus,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  percentage: number;
}

interface QuizApiQuestion {
  id: number;
  question: string;
  description: string | null;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };
  multiple_correct_answers: boolean;
  correct_answers: {
    answer_a_correct: boolean;
    answer_b_correct: boolean;
    answer_c_correct: boolean;
    answer_d_correct: boolean;
    answer_e_correct: boolean;
    answer_f_correct: boolean;
  };
  correct_answer: string | null;
  explanation: string | null;
  tip: string | null;
  tags: { name: string }[];
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface QuizApiResponse extends Array<QuizApiQuestion> {}

const QUIZ_CATEGORIES = [
  { id: 'programming', name: 'Programming', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { id: 'database', name: 'Database', icon: '🗄️', color: 'from-green-500 to-emerald-500' },
  { id: 'networking', name: 'Networking', icon: '🌐', color: 'from-purple-500 to-pink-500' },
  { id: 'algorithms', name: 'Algorithms', icon: '🧮', color: 'from-orange-500 to-red-500' },
  { id: 'web-dev', name: 'Web Development', icon: '🎨', color: 'from-indigo-500 to-purple-500' },
  { id: 'software-eng', name: 'Software Engineering', icon: '⚙️', color: 'from-gray-500 to-slate-500' }
];

// QuizAPI.io service functions
const QUIZ_API_URL = 'https://quizapi.io/api/v1/questions';

// Category mapping for QuizAPI
const getQuizApiCategory = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'programming': 'code',
    'database': 'sql',
    'networking': 'linux',
    'algorithms': 'code',
    'web-dev': 'html',
    'software-eng': 'docker',
    'all': ''
  };
  return categoryMap[category] || '';
};

// Difficulty mapping for QuizAPI
const getQuizApiDifficulty = (difficulty: string): string => {
  const difficultyMap: { [key: string]: string } = {
    'all': '',
    'Easy': 'Easy',
    'Medium': 'Medium', 
    'Hard': 'Hard'
  };
  return difficultyMap[difficulty] || '';
};

// Transform QuizAPI data to your app format
const transformQuizApiQuestions = (apiQuestions: QuizApiQuestion[]): Question[] => {
  return apiQuestions.map((apiQ, index) => {
    // Extract valid options
    const options = Object.entries(apiQ.answers)
      .filter(([_, value]) => value !== null && value.trim() !== '')
      .map(([_, value]) => value as string);

    // Find correct answer index
    let correctAnswerIndex = 0;
    Object.entries(apiQ.correct_answers).forEach(([key, isCorrect], idx) => {
      if (isCorrect === true && options[idx]) {
        correctAnswerIndex = idx;
      }
    });

    return {
      id: `quizapi-${apiQ.id || index}-${Date.now()}`,
      question: apiQ.question,
      options: options,
      correctAnswer: correctAnswerIndex,
      explanation: apiQ.explanation || apiQ.tip || `The correct answer is: ${options[correctAnswerIndex]}`,
      difficulty: apiQ.difficulty,
      category: apiQ.category.toLowerCase().replace(/\s+/g, '-'),
      points: apiQ.difficulty === 'Easy' ? 10 : apiQ.difficulty === 'Medium' ? 20 : 30
    };
  });
};

export function QuizGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(10);
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalTime: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeRemaining, showResults]);

  // Fetch questions from QuizAPI
  const fetchQuestionsFromQuizApi = async (): Promise<Question[]> => {
    const apiKey = import.meta.env.VITE_QUIZ_API_KEY;
    
    if (!apiKey) {
      throw new Error('QuizAPI API key not found. Please check your .env file');
    }

    const params = new URLSearchParams();
    params.append('limit', questionCount.toString());
    
    const category = getQuizApiCategory(selectedCategory);
    if (category) params.append('category', category);
    
    const difficultyParam = getQuizApiDifficulty(difficulty);
    if (difficultyParam) params.append('difficulty', difficultyParam);

    try {
      console.log('Fetching questions from QuizAPI...');
      const response = await fetch(`${QUIZ_API_URL}?${params}`, {
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`QuizAPI Error: ${response.status} - ${response.statusText}`);
      }

      const data: QuizApiResponse = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No questions received from QuizAPI');
      }

      return transformQuizApiQuestions(data);
    } catch (error) {
      console.error('QuizAPI fetch error:', error);
      throw error;
    }
  };

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting quiz generation...');
      
      let questions: Question[];
      
      // Fetch questions from QuizAPI
      console.log('Attempting to fetch from QuizAPI...');
      questions = await fetchQuestionsFromQuizApi();
      console.log(`Successfully fetched ${questions.length} questions from QuizAPI`);

      // Validate we have questions
      if (!questions || questions.length === 0) {
        throw new Error('No questions available for the selected criteria');
      }

      // Apply shuffling if enabled
      if (shuffleQuestions) {
        questions = questions.sort(() => Math.random() - 0.5);
      }

      setCurrentQuiz(questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setQuizStarted(true);
      setTimeRemaining(timeLimit * 60);
      setShowExplanation(false);
      
      console.log(`Quiz started with ${questions.length} questions`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz';
      setError(errorMessage);
      console.error('Quiz generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuiz[currentQuestionIndex].id]: answerIndex
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleQuizComplete = () => {
    const correctAnswers = currentQuiz.reduce((count, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? count + 1 : count;
    }, 0);
    
    const totalPoints = currentQuiz.reduce((sum, question) => {
      return selectedAnswers[question.id] === question.correctAnswer ? sum + question.points : sum;
    }, 0);
    
    const percentage = Math.round((correctAnswers / currentQuiz.length) * 100);
    const timeSpent = (timeLimit * 60) - timeRemaining;
    
    const result: QuizResult = {
      score: totalPoints,
      totalQuestions: currentQuiz.length,
      correctAnswers,
      timeSpent,
      percentage
    };
    
    setQuizResult(result);
    setShowResults(true);
    setQuizStarted(false);
    
    // Update stats
    setQuizStats(prev => ({
      totalQuizzes: prev.totalQuizzes + 1,
      averageScore: Math.round(((prev.averageScore * prev.totalQuizzes) + percentage) / (prev.totalQuizzes + 1)),
      bestScore: Math.max(prev.bestScore, percentage),
      totalTime: prev.totalTime + timeSpent
    }));
  };

  const resetQuiz = () => {
    setCurrentQuiz([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizStarted(false);
    setTimeRemaining(0);
    setQuizResult(null);
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (percentage: number) => {
    if (percentage >= 90) return 'from-green-500 to-emerald-600';
    if (percentage >= 70) return 'from-blue-500 to-indigo-600';
    if (percentage >= 50) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Quiz Generator</h1>
                {quizStarted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-3 px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full"
                  >
                    In Progress
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!quizStarted && !showResults && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="flex items-center"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Settings
                  </Button>
                </>
              )}
              {quizStarted && (
                <>
                  <motion.div
                    animate={{ scale: timeRemaining < 60 ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 1, repeat: timeRemaining < 60 ? Infinity : 0 }}
                    className="flex items-center bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    <span className={`font-mono font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </motion.div>
                  <div className="flex items-center bg-purple-100 px-3 py-2 rounded-lg">
                    <Activity className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">
                      {currentQuestionIndex + 1} / {currentQuiz.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizStarted && !showResults ? (
          /* Quiz Setup */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  AI-Powered Quiz Generator
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Test your knowledge with personalized quizzes tailored to your learning needs
                </p>
              </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search quiz topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </motion.div>

            {/* Quiz Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lg border-0 bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-purple-600" />
                      Select Category
                    </h3>
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory('all')}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                          selectedCategory === 'all'
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Target className="w-4 h-4 inline mr-2" />
                        All Categories
                      </motion.button>
                      {QUIZ_CATEGORIES.map((category, index) => (
                        <motion.button
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                            selectedCategory === category.id
                              ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                          <ChevronRight className="w-4 h-4 float-right mt-0.5" />
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="shadow-lg border-0 bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-purple-600" />
                      Quiz Settings
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-purple-600" />
                          Difficulty Level
                        </label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="all">All Levels</option>
                          <option value="Easy">🟢 Easy</option>
                          <option value="Medium">🟡 Medium</option>
                          <option value="Hard">🔴 Hard</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <HelpCircle className="w-4 h-4 mr-2 text-purple-600" />
                          Questions: {questionCount}
                        </label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setQuestionCount(Math.max(5, questionCount - 1))}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="range"
                            min="5"
                            max="20"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <button
                            onClick={() => setQuestionCount(Math.min(20, questionCount + 1))}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5</span>
                          <span>20</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-purple-600" />
                          Time Limit: {timeLimit} minutes
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          value={timeLimit}
                          onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5 min</span>
                          <span>30 min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <Shuffle className="w-4 h-4 mr-2 text-purple-600" />
                          Shuffle Questions
                        </label>
                        <button
                          onClick={() => setShuffleQuestions(!shuffleQuestions)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            shuffleQuestions ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              shuffleQuestions ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Your Stats
                    </h3>
                    <div className="space-y-4">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex justify-between items-center p-2 rounded-lg bg-white/10"
                      >
                        <span className="text-purple-100 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Quizzes Taken
                        </span>
                        <span className="font-bold text-xl">{quizStats.totalQuizzes}</span>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex justify-between items-center p-2 rounded-lg bg-white/10"
                      >
                        <span className="text-purple-100 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Average Score
                        </span>
                        <span className="font-bold text-xl">{quizStats.averageScore}%</span>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex justify-between items-center p-2 rounded-lg bg-white/10"
                      >
                        <span className="text-purple-100 flex items-center">
                          <Trophy className="w-4 h-4 mr-2" />
                          Best Score
                        </span>
                        <span className="font-bold text-xl">{quizStats.bestScore}%</span>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="flex justify-between items-center p-2 rounded-lg bg-white/10"
                      >
                        <span className="text-purple-100 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Total Time
                        </span>
                        <span className="font-bold text-xl">{Math.round(quizStats.totalTime / 60)}m</span>
                      </motion.div>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="text-center">
                            <Star className="w-6 h-6 mx-auto mb-1 text-yellow-300" />
                            <div className="text-xs text-purple-100">Streak</div>
                            <div className="font-bold">5</div>
                          </div>
                          <div className="text-center">
                            <Award className="w-6 h-6 mx-auto mb-1 text-orange-300" />
                            <div className="text-xs text-purple-100">Rank</div>
                            <div className="font-bold">#12</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6"
                >
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-600 mr-3" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800">Quiz Generation Failed</h4>
                          <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                        <button
                          onClick={() => setError(null)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          onClick={generateQuiz}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Try Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Quiz Button */}
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={generateQuiz}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-2" />
                      Generate Smart Quiz
                    </>
                  )}
                </Button>
              </motion.div>
              
              {/* API Status Indicator */}
              {import.meta.env.VITE_QUIZ_API_KEY && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center justify-center text-sm text-gray-600"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Connected to QuizAPI.io
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : quizStarted ? (
          /* Quiz Interface */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round(((currentQuestionIndex + 1) / currentQuiz.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                        Question {currentQuestionIndex + 1}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentQuiz[currentQuestionIndex]?.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                        currentQuiz[currentQuestionIndex]?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {currentQuiz[currentQuestionIndex]?.difficulty}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        {currentQuiz[currentQuestionIndex]?.points} pts
                      </span>
                    </div>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {showExplanation ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {showExplanation ? 'Hide' : 'Show'} Hint
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                    {currentQuiz[currentQuestionIndex]?.question}
                  </h3>
                  
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6"
                    >
                      <div className="flex items-center mb-2">
                        <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Explanation</span>
                      </div>
                      <p className="text-blue-700">{currentQuiz[currentQuestionIndex]?.explanation}</p>
                    </motion.div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-4 mb-8">
                  {currentQuiz[currentQuestionIndex]?.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                        selectedAnswers[currentQuiz[currentQuestionIndex].id] === index
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                          selectedAnswers[currentQuiz[currentQuestionIndex].id] === index
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuiz[currentQuestionIndex].id] === index && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span className="ml-3">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {currentQuiz.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentQuestionIndex
                            ? 'bg-purple-600'
                            : selectedAnswers[currentQuiz[index].id] !== undefined
                            ? 'bg-green-400'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center"
                  >
                    {currentQuestionIndex === currentQuiz.length - 1 ? 'Finish Quiz' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <div className={`bg-gradient-to-r ${getScoreGradient(quizResult?.percentage || 0)} p-8 text-white text-center`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Trophy className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
                  <p className="text-xl opacity-90">Here are your results</p>
                </motion.div>
              </div>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(quizResult?.percentage || 0)}`}>
                      {quizResult?.percentage}%
                    </div>
                    <div className="text-gray-600">Final Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {quizResult?.correctAnswers}
                    </div>
                    <div className="text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {quizResult?.score}
                    </div>
                    <div className="text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {formatTime(quizResult?.timeSpent || 0)}
                    </div>
                    <div className="text-gray-600">Time Spent</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Another Quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Results
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features Section */}
        {!quizStarted && !showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Zap className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">
                    Advanced Quiz Features
                  </h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Experience intelligent quiz generation with comprehensive analytics
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { 
                      icon: Brain, 
                      title: "AI-Powered Questions", 
                      description: "Intelligent question generation based on your learning progress and weak areas"
                    },
                    { 
                      icon: Target, 
                      title: "Adaptive Difficulty", 
                      description: "Dynamic difficulty adjustment based on your performance and skill level"
                    },
                    { 
                      icon: BarChart3, 
                      title: "Detailed Analytics", 
                      description: "Comprehensive performance tracking with insights and improvement suggestions"
                    },
                    { 
                      icon: Clock, 
                      title: "Timed Challenges", 
                      description: "Customizable time limits to simulate real exam conditions"
                    },
                    { 
                      icon: Award, 
                      title: "Achievement System", 
                      description: "Earn badges and track your progress with gamified learning"
                    },
                    { 
                      icon: Users, 
                      title: "Collaborative Learning", 
                      description: "Share quizzes with classmates and compete on leaderboards"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Modal */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAnalytics(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
                    Quiz Analytics
                  </h3>
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <CardContent className="p-6 text-center">
                      <PieChart className="w-8 h-8 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold mb-2">Performance</h4>
                      <div className="text-3xl font-bold">{quizStats.averageScore}%</div>
                      <div className="text-sm opacity-80">Average Score</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <CardContent className="p-6 text-center">
                      <Activity className="w-8 h-8 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold mb-2">Activity</h4>
                      <div className="text-3xl font-bold">{quizStats.totalQuizzes}</div>
                      <div className="text-sm opacity-80">Quizzes Completed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-8 h-8 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold mb-2">Time Spent</h4>
                      <div className="text-3xl font-bold">{Math.round(quizStats.totalTime / 60)}</div>
                      <div className="text-sm opacity-80">Minutes</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Recent Performance
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Performance chart will be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-600" />
                    Quiz Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Shuffle className="w-4 h-4 mr-2 text-purple-600" />
                      Auto-shuffle Questions
                    </label>
                    <button
                      onClick={() => setShuffleQuestions(!shuffleQuestions)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        shuffleQuestions ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          shuffleQuestions ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                      Show Explanations
                    </label>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Star className="w-4 h-4 mr-2 text-purple-600" />
                      Save Progress
                    </label>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Save Settings
                  </Button>
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Quiz</h3>
                <p className="text-gray-600">Fetching questions from QuizAPI...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}