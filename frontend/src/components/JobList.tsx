// components/JobList.tsx
"use client";

import { Card, Badge, Loader } from "@mantine/core";

interface Job {
  title: string;
  company: string;
  description: string;
  email: string;
  similarity_score: number;
}

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
}

export function JobList({ jobs, isLoading }: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader color="purple" size="lg" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-8">
        <p>No jobs found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-8">
      {jobs.map((job, index) => (
        <Card
          key={index}
          className="bg-[#1E1E1E] border border-gray-700 hover:border-purple-500 transition-all duration-300"
          padding="lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-white">{job.title}</h2>
            <Badge color="grape" variant="light" title="Similarity Score">
              {Math.round(job.similarity_score * 100)}% Match
            </Badge>
          </div>

          <p className="text-purple-300 font-medium mb-4">{job.company}</p>

          <div className="mb-4">
            <p className="text-gray-300 line-clamp-3">{job.description}</p>
          </div>

          <div className="text-sm text-gray-400">
            <p>Contact: {job.email}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
