
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Star,
  Target,
  Brain,
  Award
} from 'lucide-react';
import { QuizQuestion, QuizResponse, QuizAttempt } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface QuizInterfaceProps {
  quiz: any;
  childId: string;
  onComplete: (attempt: QuizAttempt, newBadges: any[]) => void;
}

export default function QuizInterface({ quiz, childId, onComplete }: QuizInterfaceProps) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const questions = quiz.questions as QuizQuestion[];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerChange = (answer: string) => {
    const newResponses = [...responses];
    const existingIndex = newResponses.findIndex(r => r.questionId === currentQuestion.id);
    
    const response: QuizResponse = {
      questionId: currentQuestion.id,
      answer,
      isCorrect: false, // Will be calculated on server
      timeSpent: timeSpent
    };

    if (existingIndex >= 0) {
      newResponses[existingIndex] = response;
    } else {
      newResponses.push(response);
    }

    setResponses(newResponses);
  };

  const getCurrentAnswer = () => {
    const response = responses.find(r => r.questionId === currentQuestion.id);
    return response?.answer || '';
  };

  const canProceed = () => {
    return getCurrentAnswer().trim() !== '';
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (responses.length !== questions.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          childId,
          responses,
          timeSpent: Math.floor(timeSpent / 60) // Convert to minutes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      setResults(data);
      setShowResults(true);
      
      // Show new badges if any
      if (data.newBadges && data.newBadges.length > 0) {
        toast({
          title: "New Badge Earned!",
          description: `You earned ${data.newBadges.length} new badge(s)!`,
        });
      }

      onComplete(data.attempt, data.newBadges);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults && results) {
    return <QuizResults results={results} quiz={quiz} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Week {quiz.weekNumber} Quiz</span>
              </CardTitle>
              <CardDescription>{quiz.mathConcept}</CardDescription>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {currentQuestion.question}
              </CardTitle>
              {currentQuestion.difficulty && (
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      currentQuestion.difficulty === 'easy' ? 'secondary' :
                      currentQuestion.difficulty === 'medium' ? 'default' : 'destructive'
                    }
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === 'multiple-choice' && (
                <RadioGroup
                  value={getCurrentAnswer()}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`}
                        className="cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'true-false' && (
                <RadioGroup
                  value={getCurrentAnswer()}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="True" id="true" />
                    <Label 
                      htmlFor="true"
                      className="cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="False" id="false" />
                    <Label 
                      htmlFor="false"
                      className="cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {currentQuestion.type === 'fill-in-blank' && (
                <div className="space-y-2">
                  <Label htmlFor="answer">Your Answer:</Label>
                  <Input
                    id="answer"
                    value={getCurrentAnswer()}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Enter your answer..."
                    className="text-lg p-4"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestionIndex
                  ? 'bg-blue-600'
                  : responses.find(r => r.questionId === questions[index].id)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Submit Quiz
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

function QuizResults({ results, quiz }: { results: any; quiz: any }) {
  const { score, correctAnswers, totalQuestions, attempt, newBadges } = results;
  const percentage = Math.round(score);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent work!';
    if (score >= 70) return 'Good job!';
    if (score >= 50) return 'Keep practicing!';
    return 'Need more review';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Results Header */}
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 mb-6">Week {quiz.weekNumber} - {quiz.mathConcept}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
              </p>
              <p className="text-gray-500">Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                {correctAnswers}/{totalQuestions}
              </p>
              <p className="text-gray-500">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600">
                #{attempt.attemptNumber}
              </p>
              <p className="text-gray-500">Attempt</p>
            </div>
          </div>
          
          <p className={`text-xl font-semibold mt-6 ${getScoreColor(percentage)}`}>
            {getScoreMessage(percentage)}
          </p>
        </CardContent>
      </Card>

      {/* New Badges */}
      {newBadges && newBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>New Badges Earned!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newBadges.map((badge: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">{badge.badgeName}</h4>
                    <p className="text-sm text-yellow-700">{badge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {attempt.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>Personalized Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{attempt.feedback}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="flex-1"
        >
          Retake Quiz
        </Button>
        <Button 
          onClick={() => window.location.href = '/growth-plan'}
          className="flex-1"
        >
          Continue Learning
        </Button>
      </div>
    </motion.div>
  );
}
