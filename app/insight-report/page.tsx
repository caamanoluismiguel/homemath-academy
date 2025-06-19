
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardHeader from '@/components/dashboard-header';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Heart, 
  FileText,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Award,
  Lightbulb
} from 'lucide-react';
import { InsightReport } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function InsightReportPage() {
  const { user, selectedChild } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [report, setReport] = useState<InsightReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !selectedChild) {
      router.push('/dashboard');
      return;
    }
    
    loadInsightReport();
  }, [user, selectedChild, router]);

  const loadInsightReport = async () => {
    if (!selectedChild) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/insight-report/${selectedChild.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No insight report found. Please complete the placement test first.');
        } else {
          throw new Error('Failed to load insight report');
        }
        return;
      }

      const data = await response.json();
      setReport(data.insightReport);
    } catch (error) {
      console.error('Error loading insight report:', error);
      setError('Failed to load insight report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewGrowthPlan = () => {
    router.push('/growth-plan');
  };

  const handleRetakeTest = () => {
    router.push('/placement-test');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your insight report...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <DashboardHeader />
        <main className="container-width section-padding">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Report Not Available</h2>
              <p className="text-gray-600 mb-6">
                {error || 'No insight report found for this child.'}
              </p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={() => router.push('/placement-test')}>
                  Take Placement Test
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

  const strengthsCount = report.strengths.length;
  const weaknessesCount = report.weaknesses.length;
  const totalAreas = strengthsCount + weaknessesCount;
  const strengthPercentage = totalAreas > 0 ? (strengthsCount / totalAreas) * 100 : 0;

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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Insight Report for {selectedChild?.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              AI-powered analysis of your child's math abilities and personalized recommendations
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Generated on {new Date(report.createdAt || '').toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                Grade Level: {report.gradeEquivalence}
              </div>
            </div>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <span>AI Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-gray-700">
                  {report.aiSummary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance Overview</span>
                </CardTitle>
                <CardDescription>
                  Overall assessment of your child's mathematical abilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-600">Strengths</h3>
                    <p className="text-2xl font-bold text-green-700">{strengthsCount}</p>
                    <p className="text-sm text-gray-500">Areas of proficiency</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-orange-600">Focus Areas</h3>
                    <p className="text-2xl font-bold text-orange-700">{weaknessesCount}</p>
                    <p className="text-sm text-gray-500">Areas for growth</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-600">Grade Level</h3>
                    <p className="text-lg font-bold text-blue-700">{report.gradeEquivalence}</p>
                    <p className="text-sm text-gray-500">Current assessment</p>
                  </div>
                </div>

                {totalAreas > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Proficiency Score</span>
                      <span>{Math.round(strengthPercentage)}%</span>
                    </div>
                    <Progress value={strengthPercentage} className="h-3" />
                    <p className="text-xs text-gray-500 text-center">
                      Based on assessed areas of strength vs. areas needing focus
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Strengths & Proficiencies</span>
                  </CardTitle>
                  <CardDescription>
                    Areas where {selectedChild?.name} demonstrates strong understanding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {strengthsCount > 0 ? (
                    <ul className="space-y-3">
                      {report.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No specific strengths identified from this assessment. 
                        {selectedChild?.name} demonstrates solid understanding across evaluated areas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Areas for Growth */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600">
                    <Target className="w-5 h-5" />
                    <span>Areas for Growth</span>
                  </CardTitle>
                  <CardDescription>
                    Concepts that would benefit from additional focus and practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {weaknessesCount > 0 ? (
                    <ul className="space-y-3">
                      {report.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No specific areas for growth identified from this assessment. 
                        Well done! Consider enrichment activities or exploring advanced topics.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Common Errors & Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Common Patterns & Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Specific observations and actionable strategies for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.commonErrors.length > 0 ? (
                    <ul className="space-y-3">
                      {report.commonErrors.map((error, index) => (
                        <li key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{error}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 bg-green-50 p-4 rounded-lg">
                      No significant error patterns identified. Continue with regular practice 
                      and review to maintain strong mathematical foundations.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theological Reflection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-600">
                  <Heart className="w-5 h-5" />
                  <span>Theological Reflection</span>
                </CardTitle>
                <CardDescription>
                  Connecting mathematical learning with Christian faith and values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed italic">
                  "{report.theologyNote}"
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              onClick={handleViewGrowthPlan}
              className="flex-1 h-12 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View 24-Week Growth Plan
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRetakeTest}
              className="flex-1 h-12"
            >
              <FileText className="w-5 h-5 mr-2" />
              Retake Assessment
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="flex-1 h-12"
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
