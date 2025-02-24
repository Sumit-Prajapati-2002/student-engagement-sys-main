'use client';

import { useState } from 'react';
import { JobSearch } from '@/components/JobSearch';
import { JobList } from '@/components/JobList';
import { Header } from '@/components/Header';

interface Job {
  title: string;
  company: string;
  description: string;
  email: string;
  similarity_score: number;
}

export default function JobsPage() {
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <JobSearch setSearchResults={setSearchResults} setIsLoading={setIsLoading} />
      <JobList jobs={searchResults} isLoading={isLoading} />
    </div>
  );
} 