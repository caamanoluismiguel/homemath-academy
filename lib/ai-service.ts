import OpenAI from 'openai';
import { QuizQuestion, Language } from './types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI service for generating growth plans
export async function generateGrowthPlan(
  insightReport: any,
  childGrade: string,
  language: Language = 'en'
): Promise<any[]> {
  try {
    const prompt = `
Create a 24-week math growth plan for a ${childGrade} grade student based on this insight report:

Strengths: ${insightReport.strengths?.join(', ') || 'General math understanding'}
Weaknesses: ${insightReport.weaknesses?.join(', ') || 'Areas for improvement'}
Grade Equivalence: ${insightReport.gradeEquivalence || childGrade}
Common Errors: ${insightReport.commonErrors?.join(', ') || 'Basic calculation errors'}

Requirements:
- 24 weeks of progressive math concepts
- Each week should build on previous concepts
- Include Reformed Christian theological connections
- Focus on addressing identified weaknesses
- Language: ${language === 'es' ? 'Spanish' : 'English'}

Return a JSON array of 24 objects with this structure:
{
  "weekNumber": 1,
  "mathConcept": "Addition and Subtraction Basics",
  "theology": "God's perfect order in creation reflects mathematical principles",
  "isGenerated": false
}

Focus on these math progression areas:
- Weeks 1-6: Number sense and basic operations
- Weeks 7-12: Place value and multi-digit operations  
- Weeks 13-18: Fractions and decimals
- Weeks 19-24: Geometry and measurement

Make sure each concept builds logically on the previous week.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Christian homeschool math curriculum designer. Create detailed, age-appropriate math learning plans that integrate Reformed theological principles. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const growthPlan = JSON.parse(response);
    return Array.isArray(growthPlan) ? growthPlan : [];

  } catch (error) {
    console.error('Error generating growth plan:', error);
    // Fallback to basic structure if AI fails
    const weeks = [];
    for (let i = 1; i <= 24; i++) {
      weeks.push({
        weekNumber: i,
        mathConcept: `Week ${i} Math Concept`,
        theology: `Week ${i} theological connection`,
        isGenerated: false
      });
    }
    return weeks;
  }
}

// AI service for generating week details
export async function generateWeekDetails(
  weekNumber: number,
  mathConcept: string,
  theology: string,
  childGrade: string,
  language: Language = 'en'
): Promise<any> {
  try {
    const prompt = `
Create detailed daily lessons for Week ${weekNumber} focusing on "${mathConcept}" for a ${childGrade} grade student.

Theological Theme: ${theology}
Language: ${language === 'es' ? 'Spanish' : 'English'}

Create 5 daily lessons (Monday-Friday) with this structure for each day:
{
  "dayNumber": 1,
  "dayTitle": "Day 1: Introduction to [Concept]",
  "devotional": {
    "verse": "Bible verse",
    "reflection": "How this math concept reflects God's character"
  },
  "learningObjective": "Clear, measurable learning goal",
  "definition": "Simple definition of the math concept",
  "conceptExplanation": "Age-appropriate explanation with examples",
  "guidedExamples": [
    {
      "title": "Example 1",
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "mainExercises": [
    {
      "problem": "Math problem",
      "answer": "Correct answer"
    }
  ],
  "commonMistakes": [
    {
      "mistake": "Common error students make",
      "correction": "How to fix it"
    }
  ],
  "parentDiscussion": ["Discussion point 1", "Discussion point 2"],
  "homework": [
    {
      "type": "practice",
      "description": "Practice problems to complete"
    }
  ],
  "closingEncouragement": "Encouraging message connecting math to faith"
}

Return a JSON object with:
{
  "weekNumber": ${weekNumber},
  "weekTheme": "${mathConcept} - Week ${weekNumber}",
  "mathConcept": "${mathConcept}",
  "theology": "${theology}",
  "dailyLessons": [array of 5 daily lessons],
  "isGenerated": true
}

Make sure content is appropriate for ${childGrade} grade level and includes Reformed Christian worldview integration.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Christian homeschool math curriculum designer specializing in Reformed theology integration. Create detailed, engaging daily math lessons that connect mathematical concepts to biblical truths. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);

  } catch (error) {
    console.error('Error generating week details:', error);
    // Fallback to basic structure
    return {
      weekNumber,
      weekTheme: `${mathConcept} - Week ${weekNumber}`,
      mathConcept,
      theology: theology || 'Mathematics reflects God\'s perfect order',
      dailyLessons: [],
      isGenerated: true
    };
  }
}

// Generate detailed daily lesson
export async function generateDailyLesson(
  weekNumber: number,
  dayNumber: number,
  mathConcept: string,
  theology: string,
  childGrade: string,
  language: Language = 'en'
): Promise<any> {
  try {
    const prompt = `
Create a detailed daily math lesson for Day ${dayNumber} of Week ${weekNumber}.

Math Concept: ${mathConcept}
Grade Level: ${childGrade}
Theological Theme: ${theology}
Language: ${language === 'es' ? 'Spanish' : 'English'}

Create a comprehensive lesson with this exact structure:
{
  "dayNumber": ${dayNumber},
  "dayTitle": "Day ${dayNumber}: [Specific topic for this day]",
  "devotional": {
    "verse": "Relevant Bible verse",
    "reflection": "2-3 sentences connecting the verse to today's math concept"
  },
  "learningObjective": "Students will be able to [specific, measurable goal]",
  "definition": "Clear, age-appropriate definition of today's concept",
  "conceptExplanation": "Detailed explanation with real-world examples",
  "guidedExamples": [
    {
      "title": "Example 1: [Title]",
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4"]
    },
    {
      "title": "Example 2: [Title]", 
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "mainExercises": [
    {"problem": "Problem 1", "answer": "Answer 1"},
    {"problem": "Problem 2", "answer": "Answer 2"},
    {"problem": "Problem 3", "answer": "Answer 3"},
    {"problem": "Problem 4", "answer": "Answer 4"},
    {"problem": "Problem 5", "answer": "Answer 5"}
  ],
  "commonMistakes": [
    {
      "mistake": "Common error students make",
      "correction": "How to identify and fix this error"
    },
    {
      "mistake": "Another common error",
      "correction": "Prevention strategy"
    }
  ],
  "parentDiscussion": [
    "Discussion question 1 for parent and child",
    "Discussion question 2 about real-world applications",
    "Discussion question 3 connecting to faith"
  ],
  "homework": [
    {
      "type": "practice",
      "description": "5-10 practice problems similar to today's exercises"
    },
    {
      "type": "application", 
      "description": "Real-world problem to solve with family"
    }
  ],
  "closingEncouragement": "Encouraging message that connects today's learning to God's character and the student's growth"
}

Make sure all content is developmentally appropriate for ${childGrade} grade and integrates Reformed Christian worldview naturally.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Christian homeschool educator specializing in math curriculum with Reformed theological integration. Create engaging, age-appropriate daily lessons that help students see God's character through mathematics. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);

  } catch (error) {
    console.error('Error generating daily lesson:', error);
    // Fallback to basic structure
    return {
      dayNumber,
      dayTitle: `Day ${dayNumber}: ${mathConcept}`,
      devotional: {
        verse: "Psalm 19:1 - The heavens declare the glory of God; the skies proclaim the work of his hands.",
        reflection: "Just as God created the universe with perfect mathematical order, we can trust His design in our learning journey."
      },
      learningObjective: `Students will understand basic concepts of ${mathConcept}`,
      definition: `${mathConcept} is an important mathematical concept.`,
      conceptExplanation: `Today we explore ${mathConcept} and how it helps us understand God's orderly creation.`,
      guidedExamples: [],
      mainExercises: [],
      commonMistakes: [],
      parentDiscussion: [],
      homework: [],
      closingEncouragement: "God has given you a wonderful mind capable of learning. Keep practicing and trust in His plan for your growth!"
    };
  }
}

// Generate quiz questions
export async function generateQuizQuestions(
  mathConcept: string,
  childGrade: string,
  weekNumber: number,
  language: Language = 'en'
): Promise<QuizQuestion[]> {
  try {
    const prompt = `
Create 5 quiz questions for Week ${weekNumber} focusing on "${mathConcept}" for a ${childGrade} grade student.

Language: ${language === 'es' ? 'Spanish' : 'English'}

Create questions with varying difficulty levels and question types. Return a JSON array of 5 questions with this structure:
{
  "id": "q1",
  "question": "Question text",
  "type": "multiple-choice", // or "true-false" or "short-answer"
  "options": ["Option A", "Option B", "Option C", "Option D"], // for multiple choice
  "correctAnswer": "B", // or the correct answer text
  "explanation": "Why this is the correct answer",
  "difficulty": "easy" // "easy", "medium", or "hard"
}

Make sure questions:
- Are age-appropriate for ${childGrade} grade
- Test understanding of ${mathConcept}
- Include a mix of computational and conceptual questions
- Have clear, unambiguous correct answers
- Include helpful explanations
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert math educator who creates fair, age-appropriate assessment questions. Focus on testing both computational skills and conceptual understanding. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const questions = JSON.parse(response);
    return Array.isArray(questions) ? questions : [];

  } catch (error) {
    console.error('Error generating quiz questions:', error);
    // Fallback to basic questions
    return [
      {
        id: 'q1',
        question: `What is an important concept in ${mathConcept}?`,
        type: 'multiple-choice',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'A',
        explanation: 'This tests basic understanding.',
        difficulty: 'easy'
      }
    ];
  }
}

// Generate insight report
export async function generateInsightReport(
  placementTestResults: any,
  childGrade: string,
  language: Language = 'en'
): Promise<any> {
  try {
    const prompt = `
Analyze this placement test result and create a comprehensive insight report for a ${childGrade} grade student.

Test Results: ${JSON.stringify(placementTestResults)}
Language: ${language === 'es' ? 'Spanish' : 'English'}

Create a detailed analysis with this structure:
{
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "gradeEquivalence": "Grade level based on performance",
  "commonErrors": ["Error pattern 1", "Error pattern 2"],
  "theologyNote": "How this student's mathematical journey reflects God's design for learning",
  "aiSummary": "Comprehensive summary of the student's mathematical abilities and recommended next steps",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2", 
    "Specific recommendation 3"
  ]
}

Base your analysis on:
- Correct vs incorrect answers
- Types of problems missed
- Patterns in errors
- Grade-level expectations
- Individual learning needs

Provide encouraging, constructive feedback that helps parents understand their child's mathematical development.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational psychologist and math assessment specialist with experience in Christian education. Provide thorough, encouraging analysis that helps parents understand their child's learning needs while maintaining a biblical worldview. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(response);

  } catch (error) {
    console.error('Error generating insight report:', error);
    // Fallback to basic report
    return {
      strengths: ['Shows mathematical thinking', 'Willing to learn', 'Demonstrates effort'],
      weaknesses: ['Areas for continued practice', 'Concepts needing reinforcement'],
      gradeEquivalence: childGrade,
      commonErrors: ['Calculation errors', 'Conceptual misunderstandings'],
      theologyNote: 'God has given this student unique gifts and abilities that will flourish with proper nurturing and practice.',
      aiSummary: 'This student shows promise in mathematics and will benefit from continued practice and encouragement.',
      recommendations: [
        'Continue regular practice',
        'Focus on foundational concepts',
        'Celebrate progress and effort'
      ]
    };
  }
}


// Generate quiz feedback
export async function generateQuizFeedback(
  quizResponses: any[],
  score: number,
  mathConcept: string,
  childGrade: string,
  language: Language = 'en'
): Promise<string> {
  try {
    const prompt = `
Generate encouraging feedback for a ${childGrade} grade student who just completed a quiz on "${mathConcept}".

Quiz Score: ${score}%
Number of Questions: ${quizResponses.length}
Language: ${language === 'es' ? 'Spanish' : 'English'}

Create personalized feedback that:
- Celebrates their effort and progress
- Identifies specific strengths shown in their answers
- Provides gentle guidance for areas to improve
- Connects their learning to God's design for growth
- Encourages continued practice
- Is age-appropriate and positive

Keep the feedback to 2-3 sentences, warm and encouraging.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an encouraging Christian math tutor who provides positive, constructive feedback to young learners. Focus on effort, growth, and God's design for learning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    return response || "Great job on completing your quiz! Keep practicing and trusting in God's plan for your learning journey.";

  } catch (error) {
    console.error('Error generating quiz feedback:', error);
    return "Wonderful work on your quiz! God has given you a great mind for learning. Keep practicing and growing!";
  }
}

// Check for badges earned
export async function checkForBadges(
  childId: string,
  quizScore: number,
  weekNumber: number,
  consecutiveQuizzes: number = 1
): Promise<any[]> {
  try {
    const badges = [];

    // Perfect score badge
    if (quizScore >= 100) {
      badges.push({
        badgeType: 'perfect_score',
        badgeName: 'Perfect Score Star',
        description: 'Achieved a perfect score on a weekly quiz!',
        iconName: 'Star',
        colorScheme: 'gold',
        weekNumber
      });
    }

    // High score badge
    if (quizScore >= 90 && quizScore < 100) {
      badges.push({
        badgeType: 'high_score',
        badgeName: 'Excellence Award',
        description: 'Scored 90% or higher on a quiz!',
        iconName: 'Award',
        colorScheme: 'blue',
        weekNumber
      });
    }

    // Improvement badge (would need previous scores to determine)
    if (quizScore >= 80) {
      badges.push({
        badgeType: 'good_effort',
        badgeName: 'Steady Learner',
        description: 'Showing consistent effort and understanding!',
        iconName: 'TrendingUp',
        colorScheme: 'green',
        weekNumber
      });
    }

    // Quiz streak badge
    if (consecutiveQuizzes >= 3) {
      badges.push({
        badgeType: 'quiz_streak',
        badgeName: 'Consistent Learner',
        description: `Completed ${consecutiveQuizzes} quizzes in a row!`,
        iconName: 'Zap',
        colorScheme: 'purple',
        weekNumber
      });
    }

    // Weekly completion badge
    badges.push({
      badgeType: 'weekly_completion',
      badgeName: 'Week Complete',
      description: `Finished Week ${weekNumber} quiz!`,
      iconName: 'CheckCircle',
      colorScheme: 'emerald',
      weekNumber
    });

    return badges;

  } catch (error) {
    console.error('Error checking for badges:', error);
    return [];
  }
}

