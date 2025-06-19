
'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/ui/loading-spinner';
import DashboardHeader from '@/components/dashboard-header';
import ChildSelector from '@/components/child-selector';
import QuizProgressCard from '@/components/quiz-progress-card';
import DailyProgressCard from '@/components/daily-progress-card';
import { 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Clock, 
  Award, 
  Target,
  PlayCircle,
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, selectedChild, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (selectedChild) {
      loadDashboardData();
    }
  }, [selectedChild]);

  const loadDashboardData = async () => {
    if (!selectedChild) return;

    setLoadingData(true);
    try {
      // Load insight report
      const reportResponse = await fetch(`/api/insight-report/${selectedChild.id}`);
      const reportData = reportResponse.ok ? await reportResponse.json() : null;

      // Load growth plan
      const planResponse = await fetch(`/api/growth-plan/${selectedChild.id}`);
      const planData = planResponse.ok ? await planResponse.json() : null;

      setDashboardData({
        hasReport: !!reportData?.insightReport,
        hasPlan: !!planData?.growthPlan,
        report: reportData?.insightReport,
        plan: planData?.growthPlan,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleStartPlacementTest = () => {
    if (!selectedChild) {
      toast({
        title: "No Child Selected",
        description: "Please select a child to take the placement test.",
        variant: "destructive",
      });
      return;
    }
    router.push('/placement-test');
  };

  const handleViewReport = () => {
    if (!dashboardData?.hasReport) {
      toast({
        title: "No Report Available",
        description: "Please complete the placement test first.",
        variant: "destructive",
      });
      return;
    }
    router.push('/insight-report');
  };

  const handleViewGrowthPlan = () => {
    if (!dashboardData?.hasPlan) {
      toast({
        title: "No Growth Plan Available",
        description: "Please complete the placement test and view your report first.",
        variant: "destructive",
      });
      return;
    }
    router.push('/growth-plan');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader />
      
      <main className="container-width section-padding">
        <div className="space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Let's continue your child's math learning journey
              </p>
            </div>
          </motion.div>

          {/* Child Selector */}
          <ChildSelector />

          {selectedChild ? (
            <>
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Grade</p>
                        <p className="text-2xl font-bold">{selectedChild.preferredGrade}</p>
                      </div>
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Assessment</p>
                        <p className="text-2xl font-bold">
                          {dashboardData?.hasReport ? 'Complete' : 'Pending'}
                        </p>
                      </div>
                      <Brain className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Growth Plan</p>
                        <p className="text-2xl font-bold">
                          {dashboardData?.hasPlan ? 'Ready' : 'Not Started'}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Progress</p>
                        <p className="text-2xl font-bold">
                          {dashboardData?.hasPlan ? '0%' : 'N/A'}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Action Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Placement Test Card */}
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Placement Test</CardTitle>
                        <CardDescription>
                          Assess {selectedChild.name}'s math readiness
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Take a comprehensive assessment to identify your child's current math level 
                      and areas for growth.
                    </p>
                    
                    {dashboardData?.hasReport ? (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Completed
                        </Badge>
                        <p className="text-xs text-gray-500">
                          Last completed: {new Date(dashboardData.report?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline">Not Started</Badge>
                    )}

                    <Button 
                      onClick={handleStartPlacementTest}
                      className="w-full"
                      variant={dashboardData?.hasReport ? "outline" : "default"}
                    >
                      {dashboardData?.hasReport ? 'Retake Test' : 'Start Test'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Insight Report Card */}
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle>Insight Report</CardTitle>
                        <CardDescription>
                          Detailed analysis and recommendations
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Get AI-powered insights about your child's strengths, areas for growth, 
                      and specific improvement strategies.
                    </p>
                    
                    {dashboardData?.hasReport ? (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Available
                        </Badge>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Strengths: {dashboardData.report?.strengths?.length || 0} identified</p>
                          <p>Growth areas: {dashboardData.report?.weaknesses?.length || 0} identified</p>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Complete test first</Badge>
                    )}

                    <Button 
                      onClick={handleViewReport}
                      className="w-full"
                      disabled={!dashboardData?.hasReport}
                    >
                      View Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Growth Plan Card */}
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>Growth Plan</CardTitle>
                        <CardDescription>
                          24-week personalized learning path
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Access your child's personalized 24-week growth plan with daily lessons, 
                      activities, and progress tracking.
                    </p>
                    
                    {dashboardData?.hasPlan ? (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          ✓ Ready
                        </Badge>
                        <div className="text-xs text-gray-500">
                          <p>24 weeks of structured learning</p>
                          <p>Daily lessons and activities</p>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Generate report first</Badge>
                    )}

                    <Button 
                      onClick={handleViewGrowthPlan}
                      className="w-full"
                      disabled={!dashboardData?.hasPlan}
                    >
                      View Growth Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Progress Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <DailyProgressCard />
                <QuizProgressCard 
                  childId={selectedChild.id}
                  onViewAnalytics={() => router.push('/quiz-analytics')}
                />
              </motion.div>

              {/* Recent Activity */}
              {dashboardData?.hasReport && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5" />
                        <span>Learning Overview for {selectedChild.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-green-600">Strengths</h4>
                          {dashboardData.report?.strengths?.length > 0 ? (
                            <ul className="space-y-2">
                              {dashboardData.report.strengths.slice(0, 3).map((strength: string, index: number) => (
                                <li key={index} className="flex items-center text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No specific strengths identified yet.</p>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold text-orange-600">Focus Areas</h4>
                          {dashboardData.report?.weaknesses?.length > 0 ? (
                            <ul className="space-y-2">
                              {dashboardData.report.weaknesses.slice(0, 3).map((weakness: string, index: number) => (
                                <li key={index} className="flex items-center text-sm">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No specific areas for improvement identified.</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Next Steps */}
              {!dashboardData?.hasReport && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800">Get Started with {selectedChild.name}</CardTitle>
                      <CardDescription className="text-blue-600">
                        Take the first step in your child's personalized math journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <p className="text-sm">Take the placement test to assess current math level</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                            2
                          </div>
                          <p className="text-sm text-gray-600">Review detailed insights and recommendations</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                            3
                          </div>
                          <p className="text-sm text-gray-600">Follow your personalized 24-week growth plan</p>
                        </div>
                        
                        <Button onClick={handleStartPlacementTest} className="w-full mt-6">
                          Start Placement Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Child Selected</h3>
                  <p className="text-gray-600 mb-6">
                    Please select or add a child to get started with their math learning journey.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
