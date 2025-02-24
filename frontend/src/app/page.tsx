'use client';

import { useState } from 'react';
import { Container } from '@mantine/core';
import { Header } from '@/components/Header';
import { FieldSelection } from '@/components/FieldSelection';
import { QuestionnaireForm } from '@/components/QuestionnaireForm';
import { ResumeUpload } from '@/components/ResumeUpload';

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
    </Container>
  );
}
