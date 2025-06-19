
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Brain, 
  Trophy, 
  Target, 
  TrendingUp,
  PlayCircle,
  BarChart3,
  Award,
  CheckCircle
} from 'lucide-react';
import { QuizAnalytics } from '@/lib/types';

interface QuizProgressCardProps {
  childId: string;
  onViewAnalytics: () => void;
}

export default function QuizProgressCard({ childId, onViewAnalytics }: QuizProgressCardProps) {
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuickAnalytics();
  }, [childId]);

  const loadQuickAnalytics = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/quiz/analytics/${childId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error loading quiz analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <LoadingSpinner size="md" />
          <p className="mt-2 text-gray-600">Loading quiz progress...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics || analytics.totalQuizzesCompleted === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Weekly Quizzes</span>
          </CardTitle>
          <CardDescription>
            Track learning progress with weekly assessments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">No Quizzes Completed Yet</h3>
            <p className="text-gray-600 text-sm mb-4">
              Complete weekly quizzes to track your learning progress and earn badges!
            </p>
          </div>
          
          <Button onClick={onViewAnalytics} variant="outline" className="w-full">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </CardContent>
      </Card>
    );
  }

  const recentWeeks = analytics.weeklyProgress.slice(-3);
  const hasRecentImprovement = analytics.improvementTrend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Quiz Progress</span>
          </CardTitle>
          <CardDescription>
            Weekly assessment performance and achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analytics.totalQuizzesCompleted}</p>
              <p className="text-xs text-blue-700">Completed</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analytics.averageScore}%</p>
              <p className="text-xs text-green-700">Avg Score</p>
            </div>
          </div>

          {/* Improvement Indicator */}
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            hasRecentImprovement ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
          }`}>
            <TrendingUp className={`w-4 h-4 ${hasRecentImprovement ? 'text-green-600' : 'text-orange-600'}`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${hasRecentImprovement ? 'text-green-800' : 'text-orange-800'}`}>
                {hasRecentImprovement ? 'Improving!' : 'Keep Practicing'}
              </p>
              <p className={`text-xs ${hasRecentImprovement ? 'text-green-700' : 'text-orange-700'}`}>
                {hasRecentImprovement 
                  ? `+${analytics.improvementTrend}% improvement trend`
                  : 'Focus on consistent practice'
                }
              </p>
            </div>
          </div>

          {/* Recent Performance */}
          {recentWeeks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Recent Weeks</h4>
              <div className="space-y-2">
                {recentWeeks.map((week) => (
                  <div key={week.weekNumber} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Week {week.weekNumber}</span>
                    </div>
                    <Badge variant={week.bestScore >= 80 ? 'default' : 'secondary'}>
                      {Math.round(week.bestScore)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Streak & Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">
                {analytics.streakCount > 0 
                  ? `${analytics.streakCount} quiz streak!`
                  : 'Start a streak!'
                }
              </span>
            </div>
            {analytics.badges.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {analytics.badges.length} badge{analytics.badges.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Consistency Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Consistency</span>
              <span className="text-sm text-gray-500">{analytics.consistencyScore}%</span>
            </div>
            <Progress value={analytics.consistencyScore} className="h-2" />
          </div>

          {/* Action Button */}
          <Button onClick={onViewAnalytics} className="w-full">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Detailed Analytics
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
