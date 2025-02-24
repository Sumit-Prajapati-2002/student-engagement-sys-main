'use client';

import { useState } from 'react';
import { Container, Button } from '@mantine/core';
import { Header } from '@/components/Header';
import { FieldSelection } from '@/components/FieldSelection';
import { QuestionnaireForm } from '@/components/QuestionnaireForm';
import { ResumeUpload } from '@/components/ResumeUpload';
import Link from 'next/link';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedField, setSelectedField] = useState('');

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <Container size="lg" py="xl">
      <Header />
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }} 
        />
      </div>

      {currentStep === 1 && (
        <FieldSelection 
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <QuestionnaireForm
          selectedField={selectedField}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {currentStep === 3 && (
        <ResumeUpload
          selectedField={selectedField}
          onPrev={handlePrev}
        />
      )}

      {/* Chat Assistant Button */}
      <div className="flex justify-center mt-6">
        <Link href="/chat" passHref>
          <Button
            component="div"
            className='bg-[#1E1E1E] text-[#8B5CF6] border-2 border-[#8B5CF6] hover:bg-opacity-90 hover:scale-105 transition-all duration-300'
            leftSection={<i className="fas fa-comments" />}
          >
            Chat Assistant
          </Button>
        </Link>
      </div>
    </Container>
  );
}
