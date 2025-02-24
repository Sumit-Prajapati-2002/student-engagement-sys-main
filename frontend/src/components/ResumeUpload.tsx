'use client';

import { useState, useRef } from 'react';
import { Text, Card } from '@mantine/core';
import { NavigationButtons } from './NavigationButtons';
import { useRouter } from 'next/navigation';

interface ResumeUploadProps {
  selectedField: string;
  onPrev: () => void;
}

export function ResumeUpload({ selectedField, onPrev }: ResumeUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload your resume');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('selectedField', selectedField);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate_roadmap', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.success || !data.roadmap || !data.field) {
        throw new Error('Invalid response from server');
      }

      const roadmapData = {
        roadmap: data.roadmap,
        field: data.field,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem('roadmapData', JSON.stringify(roadmapData));
      router.push('/roadmap');
      
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          alert('Could not connect to server. Please make sure the backend is running.');
        } else {
          alert(`Error: ${error.message}`);
        }
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Text size="xl" fw={700} className="text-white text-center">
        Upload Your Resume
      </Text>

      <Card 
        className="bg-[#1E1E1E]/60 backdrop-blur-lg border-2 border-dashed border-[#333333] hover:border-[#8B5CF6] transition-all duration-300"
        padding="xl"
      >
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''} cursor-pointer rounded-xl
            ${file ? 'bg-[#2A2A2A]' : 'bg-[#1E1E1E]'} 
            transition-all duration-300 hover:bg-[#2A2A2A]`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-6 py-12 px-4 sm:px-6 md:px-8">
            <div className={`text-6xl ${file ? 'text-[#8B5CF6]' : 'text-gray-400'} transition-colors duration-300`}>
              {file ? (
                <i className="fas fa-check-circle animate-bounce"></i>
              ) : (
                <i className="fas fa-cloud-upload-alt"></i>
              )}
            </div>
            
            <Text size="lg" className="text-white text-center">
              {file ? (
                <>
                  <span className="text-[#8B5CF6] text-xl font-semibold">{file.name}</span>
                  <br />
                  <span className="text-sm text-gray-400 mt-2 block">
                    Click or drag to upload a different file
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl font-semibold">Drop your resume here</span>
                  <br />
                  <span className="text-sm text-gray-400 mt-2 block">
                    or click to browse (PDF only)
                  </span>
                </>
              )}
            </Text>
          </div>
        </div>
      </Card>

      <NavigationButtons
        currentStep={3}
        totalSteps={3}
        selectedField={selectedField}
        onNext={handleSubmit}
        onPrev={onPrev}
        isLoading={isLoading}
      />
    </div>
  );
} 