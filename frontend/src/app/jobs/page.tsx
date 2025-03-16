"use client";

import { useState } from "react";
import { Button } from "@mantine/core";
import { JobSearch } from "@/components/JobSearch";
import { JobList } from "@/components/JobList";
import { Header } from "@/components/Header";

export default function JobsPage() {
  // Fix: Initialize searchResults as an empty array
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <Header />
      <Button
        component="a"
        href="/"
        className="bg-[#1E1E1E] text-[#8B5CF6] border-2 border-[#8B5CF6] hover:bg-opacity-90 hover:scale-105 transition-all duration-300 mt-10 mx-10"
        leftSection={<i className="fas fa-arrow-left" />}
      >
        Back to Home
      </Button>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-400">
          Find Your Dream Job
        </h1>
        <JobSearch
          setSearchResults={setSearchResults}
          setIsLoading={setIsLoading}
        />
        <JobList jobs={searchResults} isLoading={isLoading} />
      </div>
    </div>
  );
}
