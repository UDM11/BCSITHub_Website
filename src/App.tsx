import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';

import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import ProtectedRoute from './components/routes/ProtectedRoute';

import { Toaster } from 'react-hot-toast';
import { ToastContainer } from './components/ui/Toast';

// Pages
import { Home } from './pages/Home';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Syllabus } from './pages/Syllabus';
import { Notes } from './pages/Notes/Notes';
import { PastPapers } from './pages/PastPapers';
import { Colleges } from './pages/Colleges';
import PUNotices from './pages/PUNotices';
import SemesterSubjects from './pages/Notes/SemesterSubjects';
import { SubjectNotes } from './pages/Notes/SubjectNotes';

// Dashboards
import AdminDashboard from './dashboard/admin/AdminDashboard';
import StudentProfile from './dashboard/student/StudentProfile';

// Email Verification Page
import OTPVerification from './pages/auth/OTPVerification';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/syllabus" element={<Syllabus />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/semester/:semesterId" element={<SemesterSubjects />} />
                <Route path="/notes/:semesterId/subject/:subjectId" element={<SubjectNotes />} />
                
                {/* Past Papers route without requiring email verification */}
                <Route
                  path="/past-papers"
                  element={
                    <ProtectedRoute requireEmailVerified={false}>
                      <PastPapers />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="/colleges" element={<Colleges />} />
                <Route path="/pu-notices" element={<PUNotices />} />

                {/* Email Verification Page */}
                <Route path="/verify" element={<OTPVerification />} />

                {/* Protected Routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast container for custom styling */}
            <ToastContainer />
          </div>

          {/* Global Toaster for feedback messages */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4BB543',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff3333',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
