
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Heart, 
  Target, 
  BookOpen, 
  Brain, 
  PenTool, 
  AlertTriangle, 
  Users, 
  Home, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  Play
} from 'lucide-react';
import { DailyLessonDetail } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface DailyLessonViewProps {
  lesson: DailyLessonDetail;
  onComplete?: (lessonId: string, completed: boolean) => void;
}

export default function DailyLessonView({ lesson, onComplete }: DailyLessonViewProps) {
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['devotional']));
  const [isCompleting, setIsCompleting] = useState(false);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleComplete = async () => {
    if (!onComplete) return;
    
    setIsCompleting(true);
    try {
      await onComplete(lesson.id, !lesson.isCompleted);
      toast({
        title: lesson.isCompleted ? "Lesson Unmarked" : "Lesson Completed!",
        description: lesson.isCompleted 
          ? "Lesson marked as incomplete" 
          : "Great job completing today's lesson!",
        variant: lesson.isCompleted ? "default" : "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lesson completion status",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const lessonComponents = [
    {
      id: 'devotional',
      icon: Heart,
      title: '✝️ Daily Devotional',
      description: 'Scripture and Reformed theological reflection',
      content: lesson.devotional,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    {
      id: 'objective',
      icon: Target,
      title: '🎯 Learning Objective',
      description: 'What we will learn today',
      content: lesson.learningObjective,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    {
      id: 'definition',
      icon: BookOpen,
      title: '📖 Definition',
      description: 'Key mathematical concept',
      content: lesson.definition,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      iconColor: 'text-purple-600'
    },
    {
      id: 'explanation',
      icon: Brain,
      title: '🧠 Explanation',
      description: 'Understanding the concept',
      content: lesson.explanation,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-800',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'examples',
      icon: PenTool,
      title: '📘 Guided Examples',
      description: 'Step-by-step demonstrations',
      content: lesson.guidedExamples,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-800',
      iconColor: 'text-teal-600'
    },
    {
      id: 'exercises',
      icon: Play,
      title: '✍️ Main Exercises',
      description: 'Practice problems',
      content: lesson.mainExercises,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600'
    },
    {
      id: 'mistakes',
      icon: AlertTriangle,
      title: '🚫 Common Mistakes',
      description: 'What to watch out for',
      content: lesson.commonMistakes,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    {
      id: 'discussion',
      icon: Users,
      title: '🙋 Parent Discussion',
      description: 'Conversation starters',
      content: lesson.parentDiscussion,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-600'
    },
    {
      id: 'homework',
      icon: Home,
      title: '🏠 Homework',
      description: 'Practice tasks',
      content: lesson.homework,
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-800',
      iconColor: 'text-slate-600'
    }
  ];

  const completedSections = expandedSections.size;
  const totalSections = lessonComponents.length;
  const progressPercentage = (completedSections / totalSections) * 100;

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">{lesson.dayNumber}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{lesson.dayTitle}</h2>
            <p className="text-gray-600">{lesson.learningObjective}</p>
          </div>
        </div>

        {/* Progress and Completion */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">~30 minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{completedSections}/{totalSections} sections viewed</span>
          </div>
          <Button
            onClick={handleComplete}
            disabled={isCompleting}
            variant={lesson.isCompleted ? "outline" : "default"}
            size="sm"
            className={lesson.isCompleted ? "border-green-500 text-green-700" : ""}
          >
            {lesson.isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
        </div>

        <Progress value={progressPercentage} className="h-2 mb-6" />
      </motion.div>

      {/* Lesson Components */}
      <div className="space-y-4">
        {lessonComponents.map((component, index) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Collapsible
              open={expandedSections.has(component.id)}
              onOpenChange={() => toggleSection(component.id)}
            >
              <CollapsibleTrigger asChild>
                <Card className={`cursor-pointer hover:shadow-md transition-all duration-200 ${component.borderColor}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${component.bgColor} rounded-lg flex items-center justify-center`}>
                          <component.icon className={`w-5 h-5 ${component.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{component.title}</h3>
                          <p className="text-sm text-gray-600">{component.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {expandedSections.has(component.id) && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Viewed
                          </Badge>
                        )}
                        {expandedSections.has(component.id) ? (
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
                    className="mt-2"
                  >
                    <Card className={`${component.bgColor} ${component.borderColor}`}>
                      <CardContent className="p-6">
                        <ComponentContent 
                          component={component} 
                          content={component.content}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        ))}
      </div>

      {/* Closing Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-800 mb-2">💬 Closing Encouragement</h3>
            <p className="text-green-700 italic">{lesson.closingEncouragement}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function ComponentContent({ component, content }: { component: any; content: any }) {
  switch (component.id) {
    case 'devotional':
      return (
        <div className="space-y-4">
          <div>
            <h4 className={`font-semibold ${component.textColor} mb-2`}>Scripture:</h4>
            <p className={`${component.textColor} italic text-lg leading-relaxed`}>
              {content.verse}
            </p>
          </div>
          <div>
            <h4 className={`font-semibold ${component.textColor} mb-2`}>Reflection:</h4>
            <p className={component.textColor}>
              {content.reflection}
            </p>
          </div>
        </div>
      );

    case 'objective':
    case 'definition':
    case 'explanation':
      return (
        <p className={`${component.textColor} leading-relaxed`}>
          {content}
        </p>
      );

    case 'examples':
      return (
        <div className="space-y-4">
          {content.map((example: any, index: number) => (
            <div key={index} className={`border-l-4 border-${component.iconColor.split('-')[1]}-500 pl-4`}>
              <h4 className={`font-semibold ${component.textColor} mb-2`}>
                {example.title}
              </h4>
              <ol className="list-decimal list-inside space-y-1">
                {example.steps.map((step: string, stepIndex: number) => (
                  <li key={stepIndex} className={component.textColor}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      );

    case 'exercises':
      return (
        <div className="space-y-3">
          {content.map((exercise: any, index: number) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="font-medium mb-1">{exercise.problem}</p>
              {exercise.answer && exercise.answer !== 'varies' && (
                <p className="text-sm text-gray-600">
                  <strong>Answer:</strong> {exercise.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case 'mistakes':
      return (
        <div className="space-y-3">
          {content.map((mistake: any, index: number) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="mb-2">
                <span className="font-semibold text-red-700">Mistake:</span>
                <p className="text-red-600">{mistake.mistake}</p>
              </div>
              <div>
                <span className="font-semibold text-green-700">Correction:</span>
                <p className="text-green-600">{mistake.correction}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'discussion':
      return (
        <ul className="space-y-2">
          {content.map((point: string, index: number) => (
            <li key={index} className="flex items-start space-x-3">
              <div className={`w-2 h-2 bg-${component.iconColor.split('-')[1]}-500 rounded-full mt-2 flex-shrink-0`}></div>
              <span className={component.textColor}>{point}</span>
            </li>
          ))}
        </ul>
      );

    case 'homework':
      return (
        <div className="space-y-3">
          {content.map((hw: any, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
              <Badge variant="outline" className="mt-0.5">
                {hw.type}
              </Badge>
              <span className={component.textColor}>{hw.description}</span>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <p className={component.textColor}>
          {typeof content === 'string' ? content : JSON.stringify(content)}
        </p>
      );
  }
}
