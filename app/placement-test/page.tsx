
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/dashboard-header';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { allGradeTests } from '@/lib/test-data';
import { PlacementTestQuestion, PlacementTestResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function PlacementTestPage() {
  const { user, selectedChild } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<PlacementTestResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!user || !selectedChild) {
      router.push('/dashboard');
    }
  }, [user, selectedChild, router]);

  if (!selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const testData = allGradeTests[selectedChild.preferredGrade];
  
  if (!testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Test Not Available</h2>
              <p className="text-gray-600 mb-6">
                The placement test for {selectedChild.preferredGrade} grade is not available yet.
              </p>
              <Button onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentSection = testData.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalQuestions = testData.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = responses.length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleStartTest = () => {
    setTestStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerChange = (answer: string) => {
    const questionId = currentQuestion.id;
    const existingResponseIndex = responses.findIndex(r => r.questionId === questionId);
    
    if (existingResponseIndex >= 0) {
      const newResponses = [...responses];
      newResponses[existingResponseIndex] = { questionId, answer };
      setResponses(newResponses);
    } else {
      setResponses([...responses, { questionId, answer }]);
    }
  };

  const getCurrentAnswer = () => {
    const response = responses.find(r => r.questionId === currentQuestion.id);
    return response?.answer || '';
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < testData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(testData.sections[currentSectionIndex - 1].questions.length - 1);
    }
  };

  const isLastQuestion = () => {
    return currentSectionIndex === testData.sections.length - 1 && 
           currentQuestionIndex === currentSection.questions.length - 1;
  };

  const isFirstQuestion = () => {
    return currentSectionIndex === 0 && currentQuestionIndex === 0;
  };

  const handleSubmitTest = async () => {
    if (responses.length === 0) {
      toast({
        title: "No Answers Provided",
        description: "Please answer at least one question before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const testResult = {
        childId: selectedChild.id,
        gradeLevel: selectedChild.preferredGrade,
        responses,
      };

      const response = await fetch('/api/placement-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testResult),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test');
      }

      toast({
        title: "Test Submitted Successfully!",
        description: "Your insight report is being generated. Redirecting...",
      });

      setTimeout(() => {
        router.push('/insight-report');
      }, 2000);
    } catch (error) {
      console.error('Submit test error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getElapsedTime = () => {
    if (!startTime) return '0:00';
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">
                  Placement Test for {selectedChild.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {selectedChild.preferredGrade} Grade Math Assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">What to Expect:</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{totalQuestions} questions across {testData.sections.length} sections</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Estimated time: {Math.ceil(totalQuestions * 1.5)} minutes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>You can go back and change answers</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Detailed insights will be generated after completion</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Test Sections:</h3>
                  <div className="grid gap-3">
                    {testData.sections.map((section, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{section.title}</span>
                        <Badge variant="secondary">
                          {section.questions.length} questions
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-yellow-800">
                      <p className="font-medium">Important:</p>
                      <p className="text-sm">
                        This assessment helps us understand your child's current math level. 
                        There's no pressure to get everything right - we use the results to 
                        create a personalized learning plan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleStartTest}
                    className="flex-1 h-12 text-lg"
                  >
                    Start Assessment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 h-12"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader />
      
      {/* Progress Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container-width py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Section {currentSectionIndex + 1} of {testData.sections.length}
              </Badge>
              <span className="text-sm text-gray-600">
                Question {answeredQuestions + 1} of {totalQuestions}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{getElapsedTime()}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <main className="container-width py-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSectionIndex}-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {currentSection.title}
                      </CardTitle>
                      <CardDescription>
                        Question {currentQuestionIndex + 1} of {currentSection.questions.length}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {currentQuestion.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">
                      {currentQuestion.text}
                    </h3>
                    
                    {/* Image Placeholder */}
                    {currentQuestion.imagePlaceholder && (
                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">Image Description:</p>
                        <p className="text-gray-700">{currentQuestion.imagePlaceholder}</p>
                      </div>
                    )}
                  </div>

                  {/* Answer Input */}
                  <div className="space-y-4">
                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <label
                            key={index}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                              getCurrentAnswer() === option
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              value={option}
                              checked={getCurrentAnswer() === option}
                              onChange={(e) => handleAnswerChange(e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              getCurrentAnswer() === option
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {getCurrentAnswer() === option && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                              )}
                            </div>
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="answer">Your Answer:</Label>
                        <Input
                          id="answer"
                          placeholder="Enter your answer here..."
                          value={getCurrentAnswer()}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          className="text-lg h-12"
                        />
                        {currentQuestion.type === 'image_description' && (
                          <p className="text-sm text-gray-500">
                            Parent/Teacher: Please evaluate the child's response based on the image description above.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={isFirstQuestion()}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="text-sm text-gray-500">
                      {answeredQuestions} of {totalQuestions} answered
                    </div>

                    {isLastQuestion() ? (
                      <Button
                        onClick={handleSubmitTest}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Test
                            <CheckCircle className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button onClick={goToNextQuestion}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
