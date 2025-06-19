
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from '@/components/dashboard-header';
import LoadingSpinner from '@/components/ui/loading-spinner';
import QuizInterface from '@/components/quiz-interface';
import { 
  Brain, 
  Clock, 
  Target, 
  PlayCircle,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Trophy
} from 'lucide-react';
import { WeeklyQuiz, QuizAttempt } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function QuizPage() {
  const { user, selectedChild } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<WeeklyQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);

  const weekNumber = parseInt(params.weekNumber as string);

  useEffect(() => {
    if (!user || !selectedChild) {
      router.push('/dashboard');
      return;
    }
    
    loadQuiz();
  }, [user, selectedChild, router, weekNumber]);

  const loadQuiz = async () => {
    if (!selectedChild) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/quiz/${selectedChild.id}/${weekNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
        setPreviousAttempts(data.quiz.attempts || []);
      } else if (response.status === 404) {
        // Quiz doesn't exist yet, we'll need to generate it
        setQuiz(null);
      } else {
        throw new Error('Failed to load quiz');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async (mathConcept: string) => {
    if (!selectedChild) return;

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: selectedChild.id,
          weekNumber,
          mathConcept
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuiz(data.quiz);
      
      toast({
        title: "Quiz Generated!",
        description: "Your weekly quiz is ready. Good luck!",
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizComplete = (attempt: QuizAttempt, newBadges: any[]) => {
    setPreviousAttempts(prev => [attempt, ...prev]);
    
    toast({
      title: "Quiz Completed!",
      description: `You scored ${Math.round(attempt.score)}%. ${newBadges.length > 0 ? `Earned ${newBadges.length} new badge(s)!` : ''}`,
    });
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const getBestScore = () => {
    if (previousAttempts.length === 0) return null;
    return Math.max(...previousAttempts.map(a => a.score));
  };

  const getAttemptCount = () => {
    return previousAttempts.length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading quiz...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quiz Not Available</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={() => router.push('/growth-plan')}>
                  Back to Growth Plan
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader />
      
      <main className="container-width section-padding">
        {!quiz ? (
          <QuizGenerationPrompt 
            weekNumber={weekNumber}
            onGenerate={generateQuiz}
            isGenerating={isGenerating}
            onBack={() => router.push('/growth-plan')}
          />
        ) : quizStarted ? (
          <QuizInterface 
            quiz={quiz}
            childId={selectedChild?.id || ''}
            onComplete={handleQuizComplete}
          />
        ) : (
          <QuizPreview 
            quiz={quiz}
            weekNumber={weekNumber}
            bestScore={getBestScore()}
            attemptCount={getAttemptCount()}
            onStart={startQuiz}
            onBack={() => router.push('/growth-plan')}
          />
        )}
      </main>
    </div>
  );
}

function QuizGenerationPrompt({ 
  weekNumber, 
  onGenerate, 
  isGenerating, 
  onBack 
}: { 
  weekNumber: number; 
  onGenerate: (concept: string) => void; 
  isGenerating: boolean;
  onBack: () => void;
}) {
  const [mathConcept, setMathConcept] = useState('');

  const commonConcepts = [
    'Addition and Subtraction',
    'Multiplication and Division',
    'Fractions',
    'Decimals',
    'Geometry',
    'Measurement',
    'Data and Graphs',
    'Patterns and Algebra'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Week {weekNumber} Quiz
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Generate a personalized quiz for this week's learning objectives
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Generation</CardTitle>
          <CardDescription>
            What math concept should this week's quiz focus on?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Math Concept for Week {weekNumber}
            </label>
            <input
              type="text"
              value={mathConcept}
              onChange={(e) => setMathConcept(e.target.value)}
              placeholder="Enter the math concept (e.g., Addition and Subtraction)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Or choose from common concepts:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {commonConcepts.map((concept) => (
                <Button
                  key={concept}
                  variant="outline"
                  size="sm"
                  onClick={() => setMathConcept(concept)}
                  className="text-left justify-start"
                >
                  {concept}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => onGenerate(mathConcept)}
              disabled={!mathConcept.trim() || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuizPreview({ 
  quiz, 
  weekNumber, 
  bestScore, 
  attemptCount, 
  onStart, 
  onBack 
}: { 
  quiz: WeeklyQuiz; 
  weekNumber: number; 
  bestScore: number | null; 
  attemptCount: number; 
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          Week {weekNumber} Quiz
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {quiz.mathConcept}
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Quiz Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{quiz.totalQuestions}</p>
              <p className="text-sm text-blue-700">Questions</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {bestScore ? `${Math.round(bestScore)}%` : 'N/A'}
              </p>
              <p className="text-sm text-green-700">Best Score</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{attemptCount}</p>
              <p className="text-sm text-purple-700">Attempts</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Quiz Instructions</h4>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Take your time to read each question carefully</li>
                  <li>• You can navigate between questions before submitting</li>
                  <li>• Your progress is automatically saved</li>
                  <li>• You can retake the quiz to improve your score</li>
                </ul>
              </div>
            </div>
          </div>

          {attemptCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Previous Attempts</h4>
              </div>
              <p className="text-sm text-blue-700">
                You've completed this quiz {attemptCount} time{attemptCount > 1 ? 's' : ''}. 
                {bestScore && ` Your best score is ${Math.round(bestScore)}%.`}
                {bestScore && bestScore < 80 && ' Keep practicing to improve!'}
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={onStart} className="flex-1 h-12">
              <PlayCircle className="w-5 h-5 mr-2" />
              {attemptCount > 0 ? 'Retake Quiz' : 'Start Quiz'}
            </Button>
            <Button variant="outline" onClick={onBack} className="h-12">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
