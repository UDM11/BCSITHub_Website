import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Timer, 
  Coffee, 
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Volume2,
  VolumeX,
  Zap,
  Award,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';

interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  completedAt: Date;
}

interface PomodoroStats {
  totalSessions: number;
  totalFocusTime: number;
  todaySessions: number;
  weekSessions: number;
  streak: number;
}

const TIMER_TYPES = {
  work: { duration: 25 * 60, label: 'Focus Time', color: 'from-red-500 to-pink-500', icon: Target },
  shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'from-green-500 to-emerald-500', icon: Coffee },
  longBreak: { duration: 15 * 60, label: 'Long Break', color: 'from-blue-500 to-cyan-500', icon: Coffee }
};

export function PomodoroTimer() {
  const [currentType, setCurrentType] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_TYPES.work.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [stats, setStats] = useState<PomodoroStats>({
    totalSessions: 0,
    totalFocusTime: 0,
    todaySessions: 0,
    weekSessions: 0,
    streak: 0
  });
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customDurations, setCustomDurations] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [completedCycles, setCompletedCycles] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create a simple beep sound using Web Audio API as fallback
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    // Try to load notification sound, fallback to beep
    audioRef.current = {
      play: () => {
        try {
          createBeepSound();
        } catch (error) {
          console.log('Audio notification not available');
        }
      }
    } as HTMLAudioElement;
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);
  
  // Update document title with timer
  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(timeLeft)} - ${TIMER_TYPES[currentType].label} | BCSITHub`;
    } else {
      document.title = 'Pomodoro Timer | BCSITHub';
    }
    
    return () => {
      document.title = 'BCSITHub - Master BCSIT with Confidence';
    };
  }, [timeLeft, isRunning, currentType]);

  // Load data from localStorage and request notification permission
  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    const savedStats = localStorage.getItem('pomodoroStats');
    const savedSettings = localStorage.getItem('pomodoroSettings');

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCustomDurations(settings.durations);
      setSoundEnabled(settings.soundEnabled);
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
    
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const sessionType = TIMER_TYPES[currentType].label;
      new Notification(`${sessionType} Complete!`, {
        body: currentType === 'work' ? 'Time for a break!' : 'Ready to focus again?',
        icon: '/favicon.ico',
        tag: 'pomodoro-timer'
      });
    }

    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      type: currentType,
      duration: TIMER_TYPES[currentType].duration,
      completedAt: new Date()
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('pomodoroSessions', JSON.stringify(updatedSessions));

    // Update stats
    const newStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      totalFocusTime: currentType === 'work' ? stats.totalFocusTime + TIMER_TYPES[currentType].duration : stats.totalFocusTime,
      todaySessions: stats.todaySessions + 1,
      weekSessions: stats.weekSessions + 1,
      streak: currentType === 'work' ? stats.streak + 1 : stats.streak
    };
    setStats(newStats);
    localStorage.setItem('pomodoroStats', JSON.stringify(newStats));

    // Auto-switch to next timer type
    if (currentType === 'work') {
      setCompletedCycles(prev => prev + 1);
      const nextType = completedCycles > 0 && (completedCycles + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setCurrentType(nextType);
      setTimeLeft(TIMER_TYPES[nextType].duration);
    } else {
      setCurrentType('work');
      setTimeLeft(TIMER_TYPES.work.duration);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_TYPES[currentType].duration);
  };

  const switchTimerType = (type: 'work' | 'shortBreak' | 'longBreak') => {
    setCurrentType(type);
    setTimeLeft(TIMER_TYPES[type].duration);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = TIMER_TYPES[currentType].duration;
    return ((total - timeLeft) / total) * 100;
  };

  const saveSettings = () => {
    const settings = {
      durations: customDurations,
      soundEnabled
    };
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    
    // Update timer types with custom durations
    TIMER_TYPES.work.duration = customDurations.work * 60;
    TIMER_TYPES.shortBreak.duration = customDurations.shortBreak * 60;
    TIMER_TYPES.longBreak.duration = customDurations.longBreak * 60;
    
    // Reset current timer if not running
    if (!isRunning) {
      setTimeLeft(TIMER_TYPES[currentType].duration);
    }
    
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <div className={`bg-white shadow-sm border-b transition-all duration-300 ${isRunning ? 'border-l-4 border-l-red-500' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center">
                <Timer className="w-6 h-6 text-indigo-600 mr-2" />
                <h1 className="text-xl font-bold text-gray-900">Pomodoro Timer</h1>
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-3 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full"
                  >
                    Running
                  </motion.div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center"
                size="sm"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white shadow-xl border-0 overflow-hidden">
                <CardContent className="p-8 sm:p-12">
                  {/* Timer Type Selector */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {Object.entries(TIMER_TYPES).map(([key, type]) => (
                      <motion.button
                        key={key}
                        onClick={() => switchTimerType(key as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          currentType === key
                            ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <type.icon className="w-4 h-4 inline mr-2" />
                        {type.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Timer Display */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto mb-8"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      {/* Progress Ring */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-gray-200"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Timer Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-2"
                          key={timeLeft}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {formatTime(timeLeft)}
                        </motion.div>
                        <div className={`text-sm sm:text-lg font-medium bg-gradient-to-r ${TIMER_TYPES[currentType].color} bg-clip-text text-transparent`}>
                          {TIMER_TYPES[currentType].label}
                        </div>
                      </div>
                    </motion.div>

                    {/* Control Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                        <Button
                          onClick={toggleTimer}
                          size="lg"
                          className={`bg-gradient-to-r ${TIMER_TYPES[currentType].color} hover:opacity-90 text-white px-8 py-4 rounded-2xl shadow-lg w-full sm:w-auto`}
                        >
                          {isRunning ? (
                            <>
                              <Pause className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                        <Button
                          onClick={resetTimer}
                          variant="outline"
                          size="lg"
                          className="px-8 py-4 rounded-2xl border-2 w-full sm:w-auto"
                        >
                          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                          Reset
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Session Progress</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${TIMER_TYPES[currentType].color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgress()}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(getProgress())}% Complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sessions</span>
                      <span className="font-bold text-2xl text-indigo-600">{stats.todaySessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Focus Time</span>
                      <span className="font-bold text-2xl text-green-600">
                        {Math.round(stats.totalFocusTime / 60)}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Streak</span>
                      <span className="font-bold text-2xl text-orange-600">{stats.streak}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Achievement</h3>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{completedCycles}</div>
                    <div className="text-indigo-100">Cycles Completed</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="space-y-3">
                    {sessions.slice(-5).reverse().map((session) => (
                      <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${TIMER_TYPES[session.type].color} mr-3`} />
                          <span className="text-sm text-gray-600">
                            {TIMER_TYPES[session.type].label}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.completedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        No sessions yet. Start your first timer!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pomodoro Tips</h3>
                <p className="text-gray-600">Maximize your productivity with these proven techniques</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Target, title: "Stay Focused", tip: "Eliminate distractions during work sessions" },
                  { icon: Coffee, title: "Take Breaks", tip: "Use breaks to rest and recharge your mind" },
                  { icon: TrendingUp, title: "Track Progress", tip: "Monitor your daily productivity patterns" },
                  { icon: CheckCircle, title: "Complete Tasks", tip: "Finish one task before starting another" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.tip}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
              <h3 className="text-xl font-bold text-gray-900 mb-6">Timer Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={customDurations.work}
                    onChange={(e) => setCustomDurations(prev => ({ ...prev, work: parseInt(e.target.value) || 25 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    max="60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={customDurations.shortBreak}
                    onChange={(e) => setCustomDurations(prev => ({ ...prev, shortBreak: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    max="30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={customDurations.longBreak}
                    onChange={(e) => setCustomDurations(prev => ({ ...prev, longBreak: parseInt(e.target.value) || 15 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                    max="60"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Sound Notifications
                  </label>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      soundEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={saveSettings}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
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
    </div>
  );
}