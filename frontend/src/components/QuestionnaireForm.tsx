'use client';

import { useState } from 'react';
import { Text, Card } from '@mantine/core';
import { NavigationButtons } from './NavigationButtons';

interface Question {
  question: string;
  options: string[];
}

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
}

function QuestionCard({ question, index, selectedAnswer, onSelect }: QuestionCardProps) {
  return (
    <Card 
      className={`question-card mb-6 bg-[#1E1E1E] relative ${
        selectedAnswer ? 'border-2 border-[#8B5CF6]' : 'border border-[#333333]'
      }`}
      padding="lg"
    >
      <div className="question-number text-4xl sm:text-6xl font-bold opacity-20 absolute top-4 right-4 sm:right-6 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] bg-clip-text text-transparent">
        {index + 1}
      </div>
      
      <Text size="lg" fw={600} className="text-white mb-6 pr-12 sm:pr-16">
        {question.question}
      </Text>

      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            onClick={() => onSelect(option)}
            className={`option-card cursor-pointer p-4 sm:p-6 rounded-xl transition-all duration-300 ${
              selectedAnswer === option 
                ? 'bg-[#252525] border-2 border-[#8B5CF6]' 
                : 'bg-[#1E1E1E] border border-[#333333]'
            } hover:border-[#8B5CF6] hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                selectedAnswer === option ? 'border-[#8B5CF6]' : 'border-[#333333]'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                )}
              </div>
              <Text className={`text-sm sm:text-base transition-colors duration-300 ${
                selectedAnswer === option ? 'text-[#8B5CF6]' : 'text-gray-300'
              }`}>
                {option}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const questions: Record<string, Question[]> = {
  computer: [
    {
      question: 'What programming languages are you most proficient in?',
      options: ['Python', 'Java', 'C++', 'JavaScript', 'Other']
    },
    {
      question: 'How would you rate your hardware knowledge?',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      question: 'What area of computer engineering interests you most?',
      options: ['Software Development', 'Hardware Design', 'Networking', 'AI/ML', 'Cybersecurity']
    },
    {
      question: 'What is your preferred learning style?',
      options: ['Self-paced', 'Structured', 'Project-based', 'Mentorship']
    },
    {
      question: 'What type of projects have you worked on?',
      options: ['Web Applications', 'Mobile Apps', 'Desktop Software', 'Embedded Systems', 'None yet']
    }
  ],
  electrical: [
    {
      question: 'How experienced are you with circuit design?',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      question: 'Which area interests you most?',
      options: ['Power Systems', 'Electronics', 'Control Systems', 'Communications']
    },
    {
      question: 'Have you worked with microcontrollers?',
      options: ['Yes, extensively', 'Some experience', 'Very little', 'No experience']
    },
    {
      question: 'What design tools are you familiar with?',
      options: ['AutoCAD', 'MATLAB', 'PSpice', 'Multiple Tools']
    },
    {
      question: 'What type of projects interest you?',
      options: ['Industrial', 'Consumer Electronics', 'Renewable Energy', 'Robotics']
    }
  ],
  civil: [
    {
      question: 'Which design software are you proficient in?',
      options: ['AutoCAD', 'Revit', 'SketchUp', 'Multiple Tools']
    },
    {
      question: 'How much practical experience do you have?',
      options: ['< 1 Year', '1-3 Years', '3+ Years', 'No experience']
    },
    {
      question: 'Which area interests you most?',
      options: ['Structural', 'Transportation', 'Environmental', 'Construction Management']
    },
    {
      question: 'Have you worked on any construction projects?',
      options: ['Yes, multiple', 'One project', 'As an intern', 'No experience']
    },
    {
      question: 'What type of engineering interests you?',
      options: ['Building Design', 'Infrastructure', 'Environmental', 'Urban Planning']
    }
  ],
  programmer: [
    {
      question: 'What is your primary programming language?',
      options: ['Python', 'Java', 'JavaScript', 'C++', 'Other']
    },
    {
      question: 'What type of development interests you?',
      options: ['Web', 'Mobile', 'Desktop', 'Game', 'AI/ML']
    },
    {
      question: 'What kind of applications do you want to build?',
      options: ['Enterprise', 'Consumer', 'Scientific', 'Creative']
    },
    {
      question: 'How do you prefer to work?',
      options: ['Solo', 'Small Team', 'Large Team', 'Open Source']
    },
    {
      question: 'What is your current level?',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Senior']
    }
  ]
};

interface QuestionnaireFormProps {
  selectedField: string;
  onNext: () => void;
  onPrev: () => void;
}

export function QuestionnaireForm({ selectedField, onNext, onPrev }: QuestionnaireFormProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const currentQuestions = questions[selectedField] || [];

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const allQuestionsAnswered = currentQuestions.length === Object.keys(answers).length;

  const handleNext = () => {
    if (!allQuestionsAnswered) {
      alert('Please answer all questions to continue');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      <Text size="xl" fw={700} className="text-white">
        Tell Us About Yourself
      </Text>

      <div className="space-y-6">
        {currentQuestions.map((question, index) => (
          <QuestionCard
            key={index}
            question={question}
            index={index}
            selectedAnswer={answers[index]}
            onSelect={(answer) => handleAnswerSelect(index, answer)}
          />
        ))}
      </div>

      <NavigationButtons
        currentStep={2}
        totalSteps={3}
        selectedField={selectedField}
        onNext={handleNext}
        onPrev={onPrev}
      />
    </div>
  );
} 