
import { GradePlacementTest } from './types';

export const grade1TestData: GradePlacementTest = {
  grade: "1st",
  sections: [
    {
      title: "Basic Addition and Subtraction Facts within 0-10",
      questions: [
        { id: 'g1s1q1_1', text: '2 + 3 = ?', type: 'fill-in-blank', answer: '5' },
        { id: 'g1s1q1_2', text: '7 + 3 = ?', type: 'fill-in-blank', answer: '10' },
        { id: 'g1s1q1_3', text: '6 + 2 = ?', type: 'fill-in-blank', answer: '8' },
        { id: 'g1s1q1_4', text: '5 + 5 = ?', type: 'fill-in-blank', answer: '10' },
        { id: 'g1s1q1_5', text: '4 + 4 = ?', type: 'fill-in-blank', answer: '8' },
        { id: 'g1s1q2_1', text: '8 - 3 = ?', type: 'fill-in-blank', answer: '5' },
        { id: 'g1s1q2_2', text: '5 - 3 = ?', type: 'fill-in-blank', answer: '2' },
        { id: 'g1s1q2_3', text: '7 - 3 = ?', type: 'fill-in-blank', answer: '4' },
        { id: 'g1s1q2_4', text: '10 - 3 = ?', type: 'fill-in-blank', answer: '7' },
        { id: 'g1s1q2_5', text: '6 - 4 = ?', type: 'fill-in-blank', answer: '2' },
      ]
    },
    {
      title: "Place Value and Two-Digit Numbers",
      questions: [
        { id: 'g1s2q5a', text: 'Fill in the missing parts: 20 + 7 = __', type: 'fill-in-blank', answer: '27' },
        { id: 'g1s2q5b', text: 'Fill in the missing parts: 6 + __ = 56', type: 'fill-in-blank', answer: '50' },
        { id: 'g1s2q6a', text: 'Put in order (smallest to largest): 16, 61, 26', type: 'fill-in-blank', answer: '16, 26, 61' },
        { id: 'g1s2q7a', text: 'Compare: 40 + 8 ___ 4 + 80 (use <, >, or =)', type: 'fill-in-blank', answer: '<' },
      ]
    },
    {
      title: "Basic Word Problems",
      questions: [
        { id: 'g1s4q12', text: 'Write a subtraction sentence for 6 + 8 = 14.', type: 'fill-in-blank', answer: '14-8=6' },
        { id: 'g1s4q13', text: 'How many more is 70 than 50?', type: 'fill-in-blank', answer: '20' },
      ]
    },
    {
      title: "Time and Money",
      questions: [
        { id: 'g1s5q19a', text: 'What time is it? (e.g., 3 o\'clock or 3:00)', type: 'fill-in-blank', imagePlaceholder: 'Clock showing 6:00', answer: '6:00' },
        { id: 'g1s7q23a', text: 'How much money? (e.g., 25 cents)', type: 'fill-in-blank', imagePlaceholder: '1 quarter coin', answer: '25 cents' },
      ]
    }
  ]
};

export const grade2TestData: GradePlacementTest = {
  grade: "2nd",
  sections: [
    {
      title: "Addition and Subtraction within 100",
      questions: [
        { id: 'g2s1q1', text: '45 + 27 = ?', type: 'fill-in-blank', answer: '72' },
        { id: 'g2s1q2', text: '83 - 36 = ?', type: 'fill-in-blank', answer: '47' },
        { id: 'g2s1q3', text: '29 + 48 = ?', type: 'fill-in-blank', answer: '77' },
        { id: 'g2s1q4', text: '64 - 29 = ?', type: 'fill-in-blank', answer: '35' },
      ]
    },
    {
      title: "Place Value to 1000",
      questions: [
        { id: 'g2s2q1', text: 'What is the value of 5 in 567?', type: 'multiple-choice', options: ['5', '50', '500'], answer: '500' },
        { id: 'g2s2q2', text: 'Write 400 + 30 + 7 in standard form', type: 'fill-in-blank', answer: '437' },
      ]
    }
  ]
};

export const allGradeTests: Record<string, GradePlacementTest> = {
  "1st": grade1TestData,
  "2nd": grade2TestData,
  "3rd": {
    grade: "3rd",
    sections: [
      {
        title: "Multiplication and Division",
        questions: [
          { id: 'g3s1q1', text: '7 × 8 = ?', type: 'fill-in-blank', answer: '56' },
          { id: 'g3s1q2', text: '63 ÷ 9 = ?', type: 'fill-in-blank', answer: '7' },
        ]
      }
    ]
  },
  "4th": {
    grade: "4th",
    sections: [
      {
        title: "Multi-digit Multiplication",
        questions: [
          { id: 'g4s1q1', text: '23 × 45 = ?', type: 'fill-in-blank', answer: '1035' },
        ]
      }
    ]
  },
  "5th": {
    grade: "5th",
    sections: [
      {
        title: "Fractions and Decimals",
        questions: [
          { id: 'g5s1q1', text: '1/2 + 1/4 = ?', type: 'fill-in-blank', answer: '3/4' },
        ]
      }
    ]
  },
  "6th": {
    grade: "6th",
    sections: [
      {
        title: "Ratios and Proportions",
        questions: [
          { id: 'g6s1q1', text: 'If 3:4 = x:12, what is x?', type: 'fill-in-blank', answer: '9' },
        ]
      }
    ]
  },
  "7th": {
    grade: "7th",
    sections: [
      {
        title: "Algebraic Expressions",
        questions: [
          { id: 'g7s1q1', text: 'Solve for x: 2x + 5 = 13', type: 'fill-in-blank', answer: '4' },
        ]
      }
    ]
  },
  "8th": {
    grade: "8th",
    sections: [
      {
        title: "Linear Equations",
        questions: [
          { id: 'g8s1q1', text: 'What is the slope of y = 3x + 2?', type: 'fill-in-blank', answer: '3' },
        ]
      }
    ]
  },
};
