
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  Brain,
  Star,
  Trophy,
  Zap,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { QuizAnalytics as QuizAnalyticsType } from '@/lib/types';

// Simplified chart placeholder for now
const ChartPlaceholder = ({ title, data }: { title: string; data: any[] }) => (
  <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <BarChart3 className="w-12 h-12 text-gray-400 mb-3" />
    <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 text-center">
      {data.length > 0 ? `${data.length} data points available` : 'No data available yet'}
    </p>
    <p className="text-xs text-gray-400 mt-2">Charts will be enhanced in future updates</p>
  </div>
);

interface QuizAnalyticsProps {
  childId: string;
}

export default function QuizAnalytics({ childId }: QuizAnalyticsProps) {
  const [analytics, setAnalytics] = useState<QuizAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [childId]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/quiz/analytics/${childId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load quiz analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading quiz analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Quiz Data Yet</h3>
          <p className="text-gray-600">
            Complete some weekly quizzes to see your progress analytics here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = analytics.weeklyProgress.map(week => ({
    week: `Week ${week.weekNumber}`,
    score: week.bestScore,
    average: week.averageScore,
    concept: week.mathConcept
  }));

  const conceptData = analytics.weeklyProgress.reduce((acc: any[], week) => {
    const existing = acc.find(item => item.concept === week.mathConcept);
    if (existing) {
      existing.averageScore = (existing.averageScore + week.averageScore) / 2;
      existing.count++;
    } else {
      acc.push({
        concept: week.mathConcept.substring(0, 15) + (week.mathConcept.length > 15 ? '...' : ''),
        averageScore: week.averageScore,
        count: 1
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalQuizzesCompleted}</p>
              <p className="text-sm text-gray-500">Quizzes Completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{analytics.averageScore}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {analytics.improvementTrend >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${analytics.improvementTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.improvementTrend >= 0 ? '+' : ''}{analytics.improvementTrend}%
              </p>
              <p className="text-sm text-gray-500">Improvement</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{analytics.streakCount}</p>
              <p className="text-sm text-gray-500">Current Streak</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Weekly Quiz Progress</span>
              </CardTitle>
              <CardDescription>
                Track your quiz scores over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title="Weekly Progress Chart" data={chartData} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Concept Performance */}
      {conceptData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Performance by Math Concept</span>
              </CardTitle>
              <CardDescription>
                See how you're doing in different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartPlaceholder title="Concept Performance Chart" data={conceptData} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Trophy className="w-5 h-5" />
                <span>Strong Areas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.strongAreas.length > 0 ? (
                  analytics.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700">{area}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Complete more quizzes to identify strong areas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-700">
                <Target className="w-5 h-5" />
                <span>Areas for Improvement</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.weakAreas.length > 0 ? (
                  analytics.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-700">{area}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Complete more quizzes to identify improvement areas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges */}
      {analytics.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span>Earned Badges</span>
              </CardTitle>
              <CardDescription>
                Celebrate your achievements!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-800">{badge.badgeName}</h4>
                      <p className="text-sm text-yellow-700">{badge.description}</p>
                      {badge.weekNumber && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Week {badge.weekNumber}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Consistency Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Consistency Score</span>
            </CardTitle>
            <CardDescription>
              How consistent are your quiz performances?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Consistency</span>
                <span className="text-sm text-gray-500">{analytics.consistencyScore}%</span>
              </div>
              <Progress value={analytics.consistencyScore} className="h-3" />
              <p className="text-sm text-gray-600">
                {analytics.consistencyScore >= 80 
                  ? "Excellent! Your performance is very consistent."
                  : analytics.consistencyScore >= 60
                  ? "Good consistency. Keep up the steady progress!"
                  : "Work on maintaining consistent performance across quizzes."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
