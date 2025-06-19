
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Target,
  TrendingUp,
  Star
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface DailyProgressData {
  weekNumber: number;
  mathConcept: string;
  dailyLessons: Array<{
    dayNumber: number;
    dayTitle: string;
    isCompleted: boolean;
    completedAt?: string;
  }>;
}

export default function DailyProgressCard() {
  const { selectedChild } = useAuth();
  const [progressData, setProgressData] = useState<DailyProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedChild) {
      loadDailyProgress();
    }
  }, [selectedChild]);

  const loadDailyProgress = async () => {
    if (!selectedChild) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/growth-plan/daily-progress?childId=${selectedChild.id}`);
      if (response.ok) {
        const data = await response.json();
        setProgressData(data.dailyProgress || []);
      }
    } catch (error) {
      console.error('Error loading daily progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Daily Lesson Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall progress
  const totalLessons = progressData.reduce((sum, week) => sum + week.dailyLessons.length, 0);
  const completedLessons = progressData.reduce(
    (sum, week) => sum + week.dailyLessons.filter(lesson => lesson.isCompleted).length, 
    0
  );
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Find current week (first week with incomplete lessons)
  const currentWeek = progressData.find(week => 
    week.dailyLessons.some(lesson => !lesson.isCompleted)
  ) || progressData[progressData.length - 1];

  // Calculate streak (consecutive completed lessons)
  let streak = 0;
  for (const week of progressData) {
    for (const lesson of week.dailyLessons) {
      if (lesson.isCompleted) {
        streak++;
      } else {
        break;
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Daily Lesson Progress</span>
          </CardTitle>
          <CardDescription>
            Track your daily learning journey through the growth plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{Math.round(overallProgress)}% Complete</span>
              {streak > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Star className="w-3 h-3 mr-1" />
                  {streak} day streak
                </Badge>
              )}
            </div>
          </div>

          {/* Current Week Focus */}
          {currentWeek && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Week {currentWeek.weekNumber}
                  </h4>
                  <p className="text-sm text-blue-600">{currentWeek.mathConcept}</p>
                </div>
                <Badge variant="outline" className="bg-white">
                  <Target className="w-3 h-3 mr-1" />
                  Current
                </Badge>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-3">
                {currentWeek.dailyLessons.map((lesson) => (
                  <div
                    key={lesson.dayNumber}
                    className={`text-center p-2 rounded-lg border ${
                      lesson.isCompleted
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="text-xs font-medium">Day {lesson.dayNumber}</div>
                    {lesson.isCompleted && (
                      <CheckCircle className="w-3 h-3 mx-auto mt-1" />
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => window.location.href = '/growth-plan'}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedLessons}</div>
              <div className="text-xs text-gray-500">Lessons Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progressData.length}</div>
              <div className="text-xs text-gray-500">Weeks Started</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{streak}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
          </div>

          {/* Recent Activity */}
          {progressData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Recent Activity</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {progressData
                  .flatMap(week => 
                    week.dailyLessons
                      .filter(lesson => lesson.isCompleted && lesson.completedAt)
                      .map(lesson => ({ ...lesson, weekNumber: week.weekNumber, mathConcept: week.mathConcept }))
                  )
                  .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                  .slice(0, 3)
                  .map((lesson, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium">Week {lesson.weekNumber}, Day {lesson.dayNumber}</span>
                        <span className="text-gray-500 ml-2">
                          {new Date(lesson.completedAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
