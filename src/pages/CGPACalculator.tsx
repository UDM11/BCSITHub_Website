import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Download, BookOpen, Award, TrendingUp, GraduationCap, FileText, BarChart3, Target, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { semesterData, specializationData } from '../data/syllabusData';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import jsPDF from 'jspdf';



interface SubjectGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  marks: number;
  grade: string;
  gradePoints: number;
}

interface SemesterResult {
  semesterId: number;
  semesterName: string;
  subjects: SubjectGrade[];
  sgpa: number;
  totalCredits: number;
}

// Convert syllabusData to match the expected format
const convertSyllabusData = () => {
  return Object.entries(semesterData).map(([id, data]) => ({
    id: parseInt(id),
    name: data.title,
    subjects: data.courses.map(course => ({
      courseCode: course.code || '',
      courseName: course.name,
      credits: course.credits
    }))
  }));
};

const semestersData = convertSyllabusData();

// Get specialization options
const getSpecializationOptions = () => {
  return Object.entries(specializationData).map(([key, data]) => ({
    value: key,
    label: data.title,
    courses: data.courses
  }));
};

export function CGPACalculator() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
  const [semesterResults, setSemesterResults] = useState<SemesterResult[]>([]);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);
  const [concentrationChoices, setConcentrationChoices] = useState<{ [key: string]: string }>({});
  const [guestName, setGuestName] = useState('');
  const [guestCollege, setGuestCollege] = useState('');

  const getGradeFromMarks = (marks: number): { grade: string; gradePoints: number } => {
    if (marks >= 90) return { grade: 'A', gradePoints: 4.0 };
    if (marks >= 85) return { grade: 'A-', gradePoints: 3.7 };
    if (marks >= 80) return { grade: 'B+', gradePoints: 3.3 };
    if (marks >= 75) return { grade: 'B', gradePoints: 3.0 };
    if (marks >= 70) return { grade: 'B-', gradePoints: 2.7 };
    if (marks >= 65) return { grade: 'C+', gradePoints: 2.3 };
    if (marks >= 60) return { grade: 'C', gradePoints: 2.0 };
    if (marks >= 55) return { grade: 'C-', gradePoints: 1.7 };
    if (marks >= 50) return { grade: 'D+', gradePoints: 1.3 };
    if (marks >= 45) return { grade: 'D', gradePoints: 1.0 };
    return { grade: 'F', gradePoints: 0.0 };
  };

  const initializeSemesterGrades = (semesterId: number) => {
    const semester = semestersData.find(s => s.id === semesterId);
    if (!semester) return [];

    return semester.subjects.map(subject => ({
      courseCode: subject.courseCode,
      courseName: subject.courseName === 'Specialization Course' || subject.courseName.includes('Concentration') 
        ? concentrationChoices[`${semesterId}-${subject.courseName}`] || subject.courseName
        : subject.courseName,
      credits: subject.credits,
      marks: 0,
      grade: 'F',
      gradePoints: 0.0
    }));
  };

  const handleSemesterToggle = (semesterId: number) => {
    if (selectedSemesters.includes(semesterId)) {
      setSelectedSemesters(selectedSemesters.filter(id => id !== semesterId));
      setSemesterResults(semesterResults.filter(result => result.semesterId !== semesterId));
    } else {
      setSelectedSemesters([...selectedSemesters, semesterId]);
      const semester = semestersData.find(s => s.id === semesterId);
      if (semester) {
        const newResult: SemesterResult = {
          semesterId,
          semesterName: semester.name,
          subjects: initializeSemesterGrades(semesterId),
          sgpa: 0,
          totalCredits: semester.subjects.reduce((sum, s) => sum + s.credits, 0)
        };
        setSemesterResults([...semesterResults, newResult]);
      }
    }
  };

  const updateSubjectMarks = (semesterId: number, subjectIndex: number, marks: number) => {
    const { grade, gradePoints: points } = getGradeFromMarks(marks);
    
    setSemesterResults(semesterResults.map(result => {
      if (result.semesterId === semesterId) {
        const updatedSubjects = result.subjects.map((subject, index) => 
          index === subjectIndex 
            ? { ...subject, marks, grade, gradePoints: points }
            : subject
        );
        return { ...result, subjects: updatedSubjects };
      }
      return result;
    }));
  };

  const updateConcentrationSubject = (key: string, value: string) => {
    setConcentrationChoices({ ...concentrationChoices, [key]: value });
    
    // Update existing semester results if they contain this concentration
    setSemesterResults(semesterResults.map(result => {
      const updatedSubjects = result.subjects.map(subject => {
        if (subject.courseName.includes('Concentration') || subject.courseName === 'Specialization') {
          const subjectKey = `${result.semesterId}-${subject.courseName}`;
          if (key === subjectKey) {
            return { ...subject, courseName: value };
          }
        }
        return subject;
      });
      return { ...result, subjects: updatedSubjects };
    }));
  };

  const calculateResults = () => {
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    const updatedResults = semesterResults.map(result => {
      let semesterGradePoints = 0;
      let semesterCredits = 0;

      result.subjects.forEach(subject => {
        const points = subject.gradePoints * subject.credits;
        semesterGradePoints += points;
        semesterCredits += subject.credits;
        totalGradePoints += points;
        totalCreditHours += subject.credits;
      });

      const sgpa = semesterCredits > 0 ? semesterGradePoints / semesterCredits : 0;
      return { ...result, sgpa: Math.round(sgpa * 100) / 100 };
    });

    setSemesterResults(updatedResults);
    const calculatedCGPA = totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;
    setCgpa(Math.round(calculatedCGPA * 100) / 100);
    setTotalCredits(totalCreditHours);
    setShowResults(true);
  };

  const downloadResults = () => {
    try {
      generatePDFReport();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download
      downloadTextReport();
    }
  };

  const downloadTextReport = () => {
    const content = generateResultsContent();
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BCSIT_Report_${user?.name?.replace(/\s+/g, '_') || 'Student'}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const generatePDFReport = () => {
    if (!cgpa || semesterResults.length === 0) {
      alert('Please calculate CGPA first before downloading the report.');
      return;
    }
    
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Header
      doc.setFontSize(18);
      doc.text('BCSIT ACADEMIC TRANSCRIPT', 105, yPos, { align: 'center' });
      yPos += 10;
      doc.setFontSize(12);
      doc.text('Pokhara University', 105, yPos, { align: 'center' });
      yPos += 20;

      // Student Information
      doc.setFontSize(12);
      doc.text('Student Information:', 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.text(`Name: ${user?.name || guestName || 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`College: ${profile?.college || guestCollege || 'N/A'}`, 20, yPos);
      yPos += 8;
      doc.text(`Program: Bachelor of Computer Science and Information Technology (BCSIT)`, 20, yPos);
      yPos += 8;
      doc.text(`Overall CGPA: ${cgpa?.toFixed(2) || '0.00'}`, 20, yPos);
      yPos += 8;
      doc.text(`Total Credits: ${totalCredits}`, 20, yPos);
      yPos += 20;

      // Semester Results
      semesterResults.forEach((result) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(14);
        doc.text(`${result.semesterName} - SGPA: ${result.sgpa.toFixed(2)}`, 20, yPos);
        yPos += 15;

        // Table headers
        doc.setFontSize(8);
        doc.text('S.N.', 20, yPos);
        doc.text('Code', 35, yPos);
        doc.text('Subject Name', 60, yPos);
        doc.text('Credits', 130, yPos);
        doc.text('Marks', 150, yPos);
        doc.text('Grade', 170, yPos);
        doc.text('Points', 185, yPos);
        yPos += 8;

        // Draw line
        doc.line(20, yPos - 2, 200, yPos - 2);

        // Subject data
        result.subjects.forEach((subject, idx) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.text((idx + 1).toString(), 20, yPos);
          doc.text(subject.courseCode || 'N/A', 35, yPos);
          doc.text(subject.courseName.substring(0, 25), 60, yPos);
          doc.text(subject.credits.toString(), 130, yPos);
          doc.text(subject.marks.toString(), 150, yPos);
          doc.text(subject.grade, 170, yPos);
          doc.text(subject.gradePoints.toFixed(1), 185, yPos);
          yPos += 6;
        });

        yPos += 10;
      });

      // Footer
      doc.setFontSize(8);
      doc.text('Generated by BCSITHub CGPA Calculator', 105, 280, { align: 'center' });

      // Save PDF
      const fileName = `BCSIT_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('PDF Error:', error);
      alert('PDF generation failed. Please try again.');
    }
  };

  const getGradeFromGPA = (gpa: number): string => {
    if (gpa >= 3.7) return 'A';
    if (gpa >= 3.3) return 'B+';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.7) return 'B-';
    if (gpa >= 2.3) return 'C+';
    if (gpa >= 2.0) return 'C';
    if (gpa >= 1.7) return 'C-';
    if (gpa >= 1.3) return 'D+';
    if (gpa >= 1.0) return 'D';
    return 'F';
  };

  const getRemarks = (gradePoints: number): string => {
    if (gradePoints >= 3.7) return 'Excellent';
    if (gradePoints >= 3.0) return 'Good';
    if (gradePoints >= 2.0) return 'Satisfactory';
    if (gradePoints >= 1.0) return 'Pass';
    return 'Fail';
  };

  const generateResultsContent = () => {
    if (!cgpa || semesterResults.length === 0) {
      alert('Please calculate CGPA first before downloading the report.');
      return '';
    }
    
    let content = `BCSIT CGPA CALCULATION REPORT\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `===========================================\n\n`;
    
    semesterResults.forEach(result => {
      content += `${result.semesterName}\n`;
      content += `SGPA: ${result.sgpa}\n`;
      content += `Credits: ${result.totalCredits}\n`;
      content += `Subjects:\n`;
      result.subjects.forEach(subject => {
        content += `  ${subject.courseCode} - ${subject.courseName}: ${subject.marks}% (${subject.grade}) - ${subject.credits} credits\n`;
      });
      content += `\n`;
    });
    
    content += `===========================================\n`;
    content += `OVERALL CGPA: ${cgpa}\n`;
    content += `Total Credits: ${totalCredits}\n`;
    content += `Total Subjects: ${semesterResults.reduce((sum, result) => sum + result.subjects.length, 0)}\n`;
    content += `Performance: ${getPerformanceText(cgpa || 0)}\n`;
    
    return content;
  };

  const getGradeColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-emerald-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.0) return 'text-amber-600';
    return 'text-red-600';
  };

  const getPerformanceText = (gpa: number) => {
    if (gpa >= 3.7) return 'Excellent Performance';
    if (gpa >= 3.0) return 'Good Performance';
    if (gpa >= 2.0) return 'Satisfactory Performance';
    return 'Needs Improvement';
  };

  const getGradientColor = (gpa: number) => {
    if (gpa >= 3.7) return 'from-emerald-500 to-green-600';
    if (gpa >= 3.0) return 'from-blue-500 to-indigo-600';
    if (gpa >= 2.0) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Header */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300/10 rounded-full blur-xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6"
            >
              <Calculator className="w-10 h-10 text-yellow-300" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Advanced CGPA Calculator
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Professional BCSIT grade calculation with semester-wise analysis and detailed reporting
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <GraduationCap className="w-6 h-6 mr-3 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Student Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  {user ? (
                    <div className="px-4 py-3 bg-white rounded-lg border border-gray-300 text-gray-900 font-medium">
                      {user.name}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College Name
                  </label>
                  {user ? (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300 text-gray-900 font-medium">
                      {profile?.college || 'Please update your profile'}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={guestCollege}
                      onChange={(e) => setGuestCollege(e.target.value)}
                      placeholder="Enter your college name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Semester Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Select Semesters</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {semestersData.map((semester) => (
                  <motion.div
                    key={semester.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label className="flex items-center p-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border-2 border-transparent hover:border-indigo-200 cursor-pointer transition-all duration-300">
                      <input
                        type="checkbox"
                        checked={selectedSemesters.includes(semester.id)}
                        onChange={() => handleSemesterToggle(semester.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 font-medium text-gray-900">{semester.name}</span>
                    </label>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Specialization Subjects Selection */}
        {selectedSemesters.some(id => {
          const semester = semestersData.find(s => s.id === id);
          return semester?.subjects.some(s => s.courseName === 'Specialization Course' || s.courseName.includes('Concentration'));
        }) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="w-6 h-6 mr-3 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Choose Specialization Subjects</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedSemesters.map(semesterId => {
                    const semester = semestersData.find(s => s.id === semesterId);
                    return semester?.subjects.filter(s => s.courseName === 'Specialization Course' || s.courseName.includes('Concentration')).map((subject, index) => {
                      const key = `${semesterId}-${subject.courseName}`;
                      const isSpecialization = subject.courseName === 'Specialization Course';
                      
                      return (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {semester.name} - {subject.courseName}
                          </label>
                          
                          {isSpecialization ? (
                            <select
                              value={concentrationChoices[key] || ''}
                              onChange={(e) => updateConcentrationSubject(key, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                              <option value="">Select a specialization</option>
                              {getSpecializationOptions().map(spec => (
                                <option key={spec.value} value={spec.label}>{spec.label}</option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={concentrationChoices[key] || ''}
                              onChange={(e) => updateConcentrationSubject(key, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                              <option value="">Select a concentration course</option>
                              {getSpecializationOptions().map(spec => 
                                spec.courses.map(course => (
                                  <option key={course.name} value={course.name}>{course.name}</option>
                                ))
                              )}
                            </select>
                          )}
                        </div>
                      );
                    });
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Grade Input for Selected Semesters */}
        <AnimatePresence>
          {semesterResults.map((result, index) => (
            <motion.div
              key={result.semesterId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-6"
            >
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div 
                    className="flex items-center justify-between cursor-pointer mb-6"
                    onClick={() => setExpandedSemester(expandedSemester === result.semesterId ? null : result.semesterId)}
                  >
                    <div className="flex items-center">
                      <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">{result.semesterName}</h3>
                      <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {result.totalCredits} Credits
                      </span>
                    </div>
                    {expandedSemester === result.semesterId ? 
                      <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                  
                  <AnimatePresence>
                    {expandedSemester === result.semesterId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {result.subjects.map((subject, subjectIndex) => (
                          <motion.div
                            key={subjectIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: subjectIndex * 0.05 }}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
                          >
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                              </label>
                              <div className="text-sm font-semibold text-gray-900">
                                {subject.courseCode && `${subject.courseCode} - `}{subject.courseName}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Credits
                              </label>
                              <div className="px-3 py-2 bg-gray-100 rounded-md text-center font-medium">
                                {subject.credits}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marks (0-100)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={subject.marks || ''}
                                onChange={(e) => updateSubjectMarks(result.semesterId, subjectIndex, parseInt(e.target.value) || 0)}
                                placeholder="Enter marks"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grade
                              </label>
                              <div className={`px-3 py-2 rounded-md text-center font-bold text-white ${
                                subject.gradePoints >= 3.7 ? 'bg-green-500' :
                                subject.gradePoints >= 3.0 ? 'bg-blue-500' :
                                subject.gradePoints >= 2.0 ? 'bg-yellow-500' :
                                subject.gradePoints >= 1.0 ? 'bg-orange-500' : 'bg-red-500'
                              }`}>
                                {subject.grade}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Calculate Button */}
        {semesterResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Button
              onClick={calculateResults}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold shadow-xl"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Calculate CGPA
            </Button>
          </motion.div>
        )}

        {/* Results Display */}
        <AnimatePresence>
          {showResults && cgpa !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Card className={`shadow-2xl border-0 bg-gradient-to-br ${getGradientColor(cgpa)} text-white overflow-hidden`}>
                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Award className="w-20 h-20 mx-auto mb-6 text-yellow-300" />
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold mb-4">Your CGPA Results</h3>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-8xl font-bold mb-4 text-yellow-300"
                    >
                      {cgpa.toFixed(2)}
                    </motion.div>
                    
                    <p className="text-2xl font-semibold mb-6 text-yellow-100">
                      {getPerformanceText(cgpa)}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-300">{totalCredits}</div>
                        <div className="text-sm text-white/80">Total Credits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-300">{semesterResults.length}</div>
                        <div className="text-sm text-white/80">Semesters</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-300">
                          {semesterResults.reduce((sum, result) => sum + result.subjects.length, 0)}
                        </div>
                        <div className="text-sm text-white/80">Total Subjects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-300">
                          {semesterResults.reduce((sum, result) => 
                            sum + result.subjects.filter(subject => subject.gradePoints >= 1.0).length, 0
                          )}
                        </div>
                        <div className="text-sm text-white/80">Passed Subjects</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button
                        onClick={downloadResults}
                        disabled={!cgpa || semesterResults.length === 0}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        variant="outline"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download PDF Report
                      </Button>
                      
                      <Button
                        onClick={downloadTextReport}
                        disabled={!cgpa || semesterResults.length === 0}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Text Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Semester-wise Results */}
        <AnimatePresence>
          {showResults && semesterResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <BarChart3 className="w-6 h-6 mr-3 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Semester-wise Performance</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {semesterResults.map((result, index) => (
                      <motion.div
                        key={result.semesterId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border border-gray-200"
                      >
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{result.semesterName}</h4>
                        <div className={`text-3xl font-bold mb-2 ${getGradeColor(result.sgpa)}`}>
                          {result.sgpa.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          SGPA • {result.totalCredits} Credits
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Official BCSIT Grading System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Official BCSIT Grading System
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Letter Grade</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Percentage Range</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Honor Point</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-green-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-green-700">A</td>
                      <td className="border border-gray-300 px-4 py-3">90 and above</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">4.0</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-green-700">Excellent</td>
                    </tr>
                    <tr className="bg-green-25">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-green-600">A-</td>
                      <td className="border border-gray-300 px-4 py-3">85 to below 90</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">3.7</td>
                      <td className="border border-gray-300 px-4 py-3"></td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-blue-700">B+</td>
                      <td className="border border-gray-300 px-4 py-3">80 to below 85</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">3.3</td>
                      <td className="border border-gray-300 px-4 py-3"></td>
                    </tr>
                    <tr className="bg-blue-25">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-blue-600">B</td>
                      <td className="border border-gray-300 px-4 py-3">75 to below 80</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">3.0</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-blue-700">Good</td>
                    </tr>
                    <tr className="bg-blue-25">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-blue-500">B-</td>
                      <td className="border border-gray-300 px-4 py-3">70 to below 75</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">2.7</td>
                      <td className="border border-gray-300 px-4 py-3"></td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-yellow-700">C+</td>
                      <td className="border border-gray-300 px-4 py-3">65 to below 70</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">2.3</td>
                      <td className="border border-gray-300 px-4 py-3"></td>
                    </tr>
                    <tr className="bg-yellow-25">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-yellow-600">C</td>
                      <td className="border border-gray-300 px-4 py-3">60 to below 65</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">2.0</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-yellow-700">Fair / Minimum requirement for credit</td>
                    </tr>
                    <tr className="bg-yellow-25">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-yellow-500">C-</td>
                      <td className="border border-gray-300 px-4 py-3">55 to below 60</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">1.7</td>
                      <td className="border border-gray-300 px-4 py-3"></td>
                    </tr>
                    <tr className="bg-orange-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-orange-600">D+</td>
                      <td className="border border-gray-300 px-4 py-3">50 to below 55</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">1.3</td>
                      <td className="border border-gray-300 px-4 py-3"></td>
                    </tr>
                    <tr className="bg-orange-25">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-orange-500">D</td>
                      <td className="border border-gray-300 px-4 py-3">45 to below 50</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">1.0</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-orange-700">Work satisfying minimum requirement</td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="border border-gray-300 px-4 py-3 font-bold text-red-600">F</td>
                      <td className="border border-gray-300 px-4 py-3">Below 45</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">0.0</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-red-700">Fail</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Graduation Requirements</h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Students must obtain a minimum of a 'D' grade in each course and maintain a minimum CGPA of 2.0 for graduation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}