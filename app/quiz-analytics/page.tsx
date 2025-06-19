
'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard-header';
import QuizAnalytics from '@/components/quiz-analytics';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';

export default function QuizAnalyticsPage() {
  const { user, selectedChild } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !selectedChild) {
      router.push('/dashboard');
    }
  }, [user, selectedChild, router]);

  if (!selectedChild) {
    return null;
  }

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
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Quiz Analytics for {selectedChild.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Track progress, identify strengths, and celebrate achievements
            </p>
          </motion.div>

          {/* Analytics Component */}
          <QuizAnalytics childId={selectedChild.id} />

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="h-12"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
