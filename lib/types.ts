
export type Language = "en" | "es";

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'active' | 'inactive' | 'trial' | 'free' | 'basic' | 'family';
  createdAt: string;
}

export interface Child {
  id: string;
  userId: string;
  name: string;
  birthDate?: string | null;
  preferredGrade: string;
  preferredLang: Language;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlacementTestQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'image_description';
  options?: string[];
  imagePlaceholder?: string;
  answer?: string;
}

export interface PlacementTestSection {
  title: string;
  questions: PlacementTestQuestion[];
}

export interface GradePlacementTest {
  grade: string;
  sections: PlacementTestSection[];
}

export interface PlacementTestResponse {
  questionId: string;
  answer: string | string[];
}

export interface PlacementTestResult {
  id: string;
  childId: string;
  gradeLevel: string;
  responses: PlacementTestResponse[];
  score?: number;
  completed: boolean;
  dateCompleted: string;
}

export interface InsightReport {
  id: string;
  childId: string;
  testId: string;
  strengths: string[];
  weaknesses: string[];
  gradeEquivalence: string;
  commonErrors: string[];
  theologyNote: string;
  aiSummary: string;
  pdfUrl?: string;
  createdAt?: string;
}

export interface DailyLesson {
  dayNumber: number;
  dayTitle: string;
  devotional: {
    verse: string;
    reflection: string;
  };
  learningObjective: string;
  definition: string;
  conceptExplanation: string;
  guidedExamples: Array<{ title: string; steps: string[] }>;
  mainExercises: Array<{ problem: string; answer?: string }>;
  commonMistakes: Array<{ mistake: string; correction: string }>;
  parentDiscussion: string[];
  homework: Array<{ type: string; description: string }>;
  closingEncouragement: string;
}

export interface DailyLessonDetail {
  id: string;
  weekDetailId: string;
  dayNumber: number;
  dayTitle: string;
  devotional: {
    verse: string;
    reflection: string;
  };
  learningObjective: string;
  definition: string;
  explanation: string;
  guidedExamples: Array<{ title: string; steps: string[] }>;
  mainExercises: Array<{ problem: string; answer?: string }>;
  commonMistakes: Array<{ mistake: string; correction: string }>;
  parentDiscussion: string[];
  homework: Array<{ type: string; description: string }>;
  closingEncouragement: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyLessonComponent {
  icon: string;
  title: string;
  description: string;
  content: any;
}

export interface WeekDetailWithLessons {
  id: string;
  planId: string;
  weekNumber: number;
  weekTheme?: string;
  mathConcept: string;
  theology?: string;
  dailyLessons?: DailyLesson[];
  dailyLessonDetails?: DailyLessonDetail[];
  isGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPlan {
  weekNumber: number;
  weekTheme?: string;
  mathConcept: string;
  theology?: string;
  dailyLessons?: DailyLesson[];
  isGenerated?: boolean;
}

export interface GrowthPlan {
  id: string;
  childId: string;
  reportId?: string;
  planStructure: WeeklyPlan[];
  createdAt: string;
  updatedAt?: string;
}

export interface ProgressLog {
  id: string;
  childId: string;
  weekNumber: number;
  dayNumber: number;
  activity: string;
  timeSpent?: number;
  mastery: 'struggling' | 'developing' | 'proficient' | 'advanced';
  notes?: string;
  completedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  formType?: string;
}

export const GRADE_LEVELS: string[] = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Basic placement test', 'Simple progress tracking', 'Limited insights'],
    maxChildren: 1,
  },
  trial: {
    name: '14-Day Trial',
    price: 0,
    features: ['Full placement test', 'Detailed insights', 'Basic growth plan', 'Progress tracking'],
    maxChildren: 3,
  },
  basic: {
    name: 'Basic',
    price: 19.99,
    features: ['Full placement test', 'Detailed insights', 'Complete growth plan', 'Progress tracking'],
    maxChildren: 3,
  },
  family: {
    name: 'Family',
    price: 29.99,
    features: ['Everything in Basic', 'AI-powered recommendations', 'Advanced analytics', 'Priority support'],
    maxChildren: 8,
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Quiz-related types
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'true-false';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResponse {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent?: number; // seconds
}

export interface WeeklyQuiz {
  id: string;
  childId: string;
  weekNumber: number;
  mathConcept: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  childId: string;
  responses: QuizResponse[];
  score: number; // 0-100 percentage
  timeSpent?: number; // minutes
  completed: boolean;
  attemptNumber: number;
  feedback?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Badge {
  id: string;
  childId: string;
  badgeType: 'quiz_streak' | 'perfect_score' | 'improvement' | 'weekly_completion' | 'consistency' | 'mastery';
  badgeName: string;
  description: string;
  iconName: string; // Lucide icon name
  colorScheme: string;
  weekNumber?: number;
  earnedAt: string;
}

export interface QuizProgress {
  weekNumber: number;
  mathConcept: string;
  attempts: number;
  bestScore: number;
  averageScore: number;
  completed: boolean;
  lastAttemptDate?: string;
  improvement: number; // percentage improvement from first to last attempt
}

export interface QuizAnalytics {
  totalQuizzesCompleted: number;
  averageScore: number;
  improvementTrend: number; // positive/negative percentage
  strongAreas: string[];
  weakAreas: string[];
  consistencyScore: number; // 0-100
  streakCount: number;
  badges: Badge[];
  weeklyProgress: QuizProgress[];
}
