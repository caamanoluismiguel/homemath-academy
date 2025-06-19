
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DashboardHeader from '@/components/dashboard-header';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Calendar, 
  BookOpen, 
  Target, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  Play,
  CheckCircle,
  Heart,
  Lightbulb,
  Users,
  Home,
  AlertTriangle,
  Sparkles,
  Brain,
  Trophy,
  PlayCircle,
  Star,
  Award
} from 'lucide-react';
import { GrowthPlan, WeeklyPlan, DailyLesson, DailyLessonDetail, WeekDetailWithLessons } from '@/lib/types';
import DailyLessonView from '@/components/daily-lesson-view';
import { useToast } from '@/hooks/use-toast';

export default function GrowthPlanPage() {
  const { user, selectedChild } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [growthPlan, setGrowthPlan] = useState<GrowthPlan | null>(null);
  const [weekDetails, setWeekDetails] = useState<Record<number, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingWeek, setLoadingWeek] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    if (!user || !selectedChild) {
      router.push('/dashboard');
      return;
    }
    
    loadGrowthPlan();
  }, [user, selectedChild, router]);

  const loadGrowthPlan = async () => {
    if (!selectedChild) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/growth-plan/${selectedChild.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No growth plan found. Please complete the placement test and view your insight report first.');
        } else {
          throw new Error('Failed to load growth plan');
        }
        return;
      }

      const data = await response.json();
      setGrowthPlan(data.growthPlan);
    } catch (error) {
      console.error('Error loading growth plan:', error);
      setError('Failed to load growth plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeekDetails = async (weekNumber: number) => {
    if (!growthPlan || weekDetails[weekNumber] || loadingWeek === weekNumber) return;

    setLoadingWeek(weekNumber);
    
    try {
      const response = await fetch('/api/growth-plan/week-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: growthPlan.id,
          weekNumber,
          childId: selectedChild?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load week details');
      }

      const data = await response.json();
      setWeekDetails(prev => ({
        ...prev,
        [weekNumber]: data.weekDetail,
      }));
    } catch (error) {
      console.error('Error loading week details:', error);
      toast({
        title: "Error Loading Week Details",
        description: "Failed to load detailed lesson plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingWeek(null);
    }
  };

  const toggleWeekExpansion = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
      loadWeekDetails(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const handleGenerateWeekDetails = (weekNumber: number) => {
    loadWeekDetails(weekNumber);
    if (!expandedWeeks.has(weekNumber)) {
      toggleWeekExpansion(weekNumber);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your growth plan...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !growthPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Growth Plan Not Available</h2>
              <p className="text-gray-600 mb-6">
                {error || 'No growth plan found for this child.'}
              </p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={() => router.push('/insight-report')}>
                  View Insight Report
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const planStructure = growthPlan.planStructure as WeeklyPlan[];
  const completedWeeks = 0; // This would come from progress tracking
  const progressPercentage = (completedWeeks / planStructure.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader />
      
      <main className="container-width section-padding">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              24-Week Growth Plan for {selectedChild?.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Personalized learning journey designed to build mathematical confidence and mastery
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Created on {new Date(growthPlan.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {planStructure.length} weeks planned
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                ~30 min/day
              </div>
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Learning Progress</span>
                </CardTitle>
                <CardDescription>
                  Track your child's journey through the 24-week program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{completedWeeks}</p>
                    <p className="text-sm text-gray-500">Weeks Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{planStructure.length - completedWeeks}</p>
                    <p className="text-sm text-gray-500">Weeks Remaining</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</p>
                    <p className="text-sm text-gray-500">Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">~{planStructure.length * 5}</p>
                    <p className="text-sm text-gray-500">Total Lessons</p>
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Plan Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Weekly Learning Plan</span>
                </CardTitle>
                <CardDescription>
                  Click on any week to view detailed daily lessons and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {planStructure.map((week, index) => (
                    <motion.div
                      key={week.weekNumber}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Collapsible
                        open={expandedWeeks.has(week.weekNumber)}
                        onOpenChange={() => toggleWeekExpansion(week.weekNumber)}
                      >
                        <CollapsibleTrigger asChild>
                          <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="font-bold text-blue-600">{week.weekNumber}</span>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">Week {week.weekNumber}</h3>
                                    <p className="text-gray-600">{week.mathConcept}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {weekDetails[week.weekNumber] ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Detailed
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">Overview</Badge>
                                  )}
                                  {expandedWeeks.has(week.weekNumber) ? (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 ml-4"
                            >
                              {loadingWeek === week.weekNumber ? (
                                <Card>
                                  <CardContent className="p-8 text-center">
                                    <LoadingSpinner size="md" />
                                    <p className="mt-4 text-gray-600">Generating detailed lesson plan...</p>
                                  </CardContent>
                                </Card>
                              ) : weekDetails[week.weekNumber] ? (
                                <WeekDetailView 
                                  weekDetail={weekDetails[week.weekNumber]} 
                                  weekPlan={week}
                                />
                              ) : (
                                <Card className="border-dashed border-2 border-gray-300">
                                  <CardContent className="p-6 text-center">
                                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <h3 className="font-semibold mb-2">Generate Detailed Lesson Plan</h3>
                                    <p className="text-gray-600 mb-4">
                                      Create a comprehensive daily lesson plan for Week {week.weekNumber}
                                    </p>
                                    <Button 
                                      onClick={() => handleGenerateWeekDetails(week.weekNumber)}
                                      disabled={loadingWeek === week.weekNumber}
                                    >
                                      <Play className="w-4 h-4 mr-2" />
                                      Generate Details
                                    </Button>
                                  </CardContent>
                                </Card>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </CollapsibleContent>
                      </Collapsible>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              onClick={() => router.push('/dashboard')}
              className="flex-1 h-12"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/insight-report')}
              className="flex-1 h-12"
            >
              View Insight Report
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function WeekDetailView({ weekDetail, weekPlan }: { weekDetail: WeekDetailWithLessons; weekPlan: WeeklyPlan }) {
  const [completingLesson, setCompletingLesson] = useState<string | null>(null);
  const { toast } = useToast();
  
  const dailyLessons = weekDetail.dailyLessons as DailyLesson[];
  const dailyLessonDetails = weekDetail.dailyLessonDetails || [];

  const handleLessonComplete = async (lessonId: string, completed: boolean) => {
    setCompletingLesson(lessonId);
    try {
      const response = await fetch('/api/growth-plan/daily-lesson', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyLessonId: lessonId,
          isCompleted: completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson completion');
      }

      toast({
        title: completed ? "Lesson Completed!" : "Lesson Unmarked",
        description: completed 
          ? "Great job completing today's lesson!" 
          : "Lesson marked as incomplete",
      });
    } catch (error) {
      console.error('Error updating lesson completion:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson completion status",
        variant: "destructive",
      });
    } finally {
      setCompletingLesson(null);
    }
  };

  // Calculate completion progress
  const completedLessons = dailyLessonDetails.filter(lesson => lesson.isCompleted).length;
  const totalLessons = dailyLessonDetails.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span>{weekDetail.weekTheme || `Week ${weekPlan.weekNumber}`}</span>
        </CardTitle>
        <CardDescription>
          Focus: {weekPlan.mathConcept}
        </CardDescription>
        {totalLessons > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Progress: {completedLessons}/{totalLessons} lessons completed
              </span>
              <span className="text-sm font-medium text-purple-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theological Focus */}
        {weekDetail.theology && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-purple-600" />
              <h4 className="font-semibold text-purple-800">Theological Focus</h4>
            </div>
            <p className="text-purple-700 italic">{weekDetail.theology}</p>
          </div>
        )}

        {/* Daily Lessons */}
        {dailyLessonDetails && dailyLessonDetails.length > 0 ? (
          <Tabs defaultValue="day1" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {dailyLessonDetails.map((lesson) => (
                <TabsTrigger 
                  key={lesson.dayNumber} 
                  value={`day${lesson.dayNumber}`}
                  className="relative"
                >
                  <div className="flex items-center space-x-1">
                    <span>Day {lesson.dayNumber}</span>
                    {lesson.isCompleted && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </TabsTrigger>
              ))}
              <TabsTrigger value="quiz" className="bg-blue-50 border-blue-200">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3" />
                  <span>Quiz</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            {dailyLessonDetails.map((lesson) => (
              <TabsContent key={lesson.dayNumber} value={`day${lesson.dayNumber}`} className="space-y-4">
                <DailyLessonView 
                  lesson={lesson} 
                  onComplete={handleLessonComplete}
                />
              </TabsContent>
            ))}

            {/* Weekly Quiz Tab */}
            <TabsContent value="quiz" className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Trophy className="w-6 h-6" />
                    <span>Week {weekPlan.weekNumber} Assessment Quiz</span>
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Test your understanding of {weekPlan.mathConcept} concepts learned this week
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                      <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <p className="text-sm font-medium">5 Questions</p>
                      <p className="text-xs text-gray-600">Mixed difficulty</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                      <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-sm font-medium">~10 Minutes</p>
                      <p className="text-xs text-gray-600">No time limit</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                      <Award className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                      <p className="text-sm font-medium">Earn Badges</p>
                      <p className="text-xs text-gray-600">Track progress</p>
                    </div>
                  </div>

                  <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Quiz Topics:</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Key definitions and concepts</li>
                      <li>• Problem-solving strategies</li>
                      <li>• Real-world applications</li>
                      <li>• Common mistake identification</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <p className="text-blue-600 mb-4 italic">
                      "Complete all 5 daily lessons before taking the quiz for the best results!"
                    </p>
                    <Button 
                      onClick={() => window.location.href = `/quiz/${weekPlan.weekNumber}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      size="lg"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Start Week {weekPlan.weekNumber} Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          /* Fallback for legacy daily lessons */
          dailyLessons && dailyLessons.length > 0 && (
            <Tabs defaultValue="day1" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {dailyLessons.map((lesson) => (
                  <TabsTrigger key={lesson.dayNumber} value={`day${lesson.dayNumber}`}>
                    Day {lesson.dayNumber}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {dailyLessons.map((lesson) => (
                <TabsContent key={lesson.dayNumber} value={`day${lesson.dayNumber}`} className="space-y-4">
                  <LegacyDailyLessonView lesson={lesson} />
                </TabsContent>
              ))}
            </Tabs>
          )
        )}
      </CardContent>
    </Card>
  );
}

function LegacyDailyLessonView({ lesson }: { lesson: DailyLesson }) {
  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">{lesson.dayTitle}</h3>
        <p className="text-gray-600">{lesson.learningObjective}</p>
      </div>

      {/* Devotional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Heart className="w-4 h-4" />
            <span>Daily Devotional</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-semibold text-blue-700">Scripture:</p>
            <p className="text-blue-600 italic">{lesson.devotional.verse}</p>
          </div>
          <div>
            <p className="font-semibold text-blue-700">Reflection:</p>
            <p className="text-blue-600">{lesson.devotional.reflection}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Concept */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Key Concept</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-semibold">Definition:</p>
            <p className="text-gray-700">{lesson.definition}</p>
          </div>
          <div>
            <p className="font-semibold">Explanation:</p>
            <p className="text-gray-700">{lesson.conceptExplanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Guided Examples */}
      {lesson.guidedExamples && lesson.guidedExamples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Guided Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lesson.guidedExamples.map((example, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-700">{example.title}</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  {example.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Practice Exercises */}
      {lesson.mainExercises && lesson.mainExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Practice Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lesson.mainExercises.map((exercise, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{exercise.problem}</p>
                  {exercise.answer && exercise.answer !== 'varies' && (
                    <p className="text-sm text-gray-600 mt-1">Answer: {exercise.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parent Discussion */}
      {lesson.parentDiscussion && lesson.parentDiscussion.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Users className="w-4 h-4" />
              <span>Parent Discussion Points</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.parentDiscussion.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-orange-700">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Homework */}
      {lesson.homework && lesson.homework.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Homework & Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lesson.homework.map((hw, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge variant="outline">{hw.type}</Badge>
                  <span className="text-gray-700">{hw.description}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Closing Encouragement */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <p className="text-green-700 italic">{lesson.closingEncouragement}</p>
        </CardContent>
      </Card>
    </div>
  );
}
