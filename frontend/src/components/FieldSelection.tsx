'use client';

import { useState } from 'react';
import { Card, Text, SimpleGrid } from '@mantine/core';
import { NavigationButtons } from './NavigationButtons';

interface FieldCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  field: string;
  onSelect: (field: string) => void;
  selected: boolean;
}

// Custom icons components
const ComputerIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M24 12h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="#8B5CF6"/>
    <rect x="8" y="8" width="32" height="24" rx="2" stroke="#8B5CF6" strokeWidth="2"/>
  </svg>
);

const ElectricalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M24 4L8 28h16l-8 16L40 20H24l8-16H24z" stroke="#8B5CF6" strokeWidth="2"/>
  </svg>
);

const CivilIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="32" height="32" stroke="#8B5CF6" strokeWidth="2"/>
    <path d="M24 4L40 12H8L24 4z" stroke="#8B5CF6" strokeWidth="2"/>
  </svg>
);

const ProgrammingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path d="M16 16l-8 8 8 8M32 16l8 8-8 8" stroke="#8B5CF6" strokeWidth="2"/>
  </svg>
);

function FieldCard({ icon, title, description, field, onSelect, selected }: FieldCardProps) {
  return (
    <Card
      padding="xl"
      radius="md"
      className={`cursor-pointer transition-all duration-300 bg-[#1E1E1E] ${
        selected ? 'border-2 border-[#8B5CF6]' : 'border border-[#333333]'
      }`}
      onClick={() => onSelect(field)}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="mb-2">{icon}</div>
        <Text size="lg" fw={600} className="text-white">
          {title}
        </Text>
        <Text size="sm" className="text-gray-400">
          {description}
        </Text>
      </div>
    </Card>
  );
}

interface FieldSelectionProps {
  selectedField: string;
  setSelectedField: (field: string) => void;
  onNext: () => void;
}

export function FieldSelection({ selectedField, setSelectedField, onNext }: FieldSelectionProps) {
  const handleNext = () => {
    if (!selectedField) {
      alert('Please select a field to continue');
      return;
    }
    onNext();
  };

  const fields = [
    {
      icon: <ComputerIcon />,
      title: "Computer Engineering",
      description: "Software development, hardware design, and system architecture",
      field: "computer",
    },
    {
      icon: <ElectricalIcon />,
      title: "Electrical Engineering",
      description: "Power systems, electronics, and control systems",
      field: "electrical",
    },
    {
      icon: <CivilIcon />,
      title: "Civil Engineering",
      description: "Structural design, construction, and infrastructure",
      field: "civil",
    },
    {
      icon: <ProgrammingIcon />,
      title: "Programming",
      description: "Software development and application programming",
      field: "programmer",
    }
  ];

  return (
    <div className="space-y-8">
      <Text size="xl" fw={700} className="text-white text-center px-4">
        Choose Your Field
      </Text>
      <SimpleGrid 
        cols={1} 
        breakpoints={[
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 4 }
        ]} 
        spacing="lg"
      >
        {fields.map((fieldData) => (
          <FieldCard 
            key={fieldData.field}
            {...fieldData}
            onSelect={setSelectedField}
            selected={selectedField === fieldData.field}
          />
        ))}
      </SimpleGrid>
      
      <NavigationButtons
        currentStep={1}
        totalSteps={3}
        selectedField={selectedField}
        onNext={handleNext}
        onPrev={() => {}}
      />
    </div>
  );
} 