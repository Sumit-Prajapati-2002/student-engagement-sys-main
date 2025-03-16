// components/JSabcehor.tsx;
"use client";

import { useState } from "react";
import { Input, Button } from "@mantine/core";
import axios from "axios";

interface JobSearchProps {
  setSearchResults: (results: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function JobSearch({ setSearchResults, setIsLoading }: JobSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/search_jobs", {
        query: searchQuery, // This matches the expected parameter in your API route
      });

      setSearchResults(response.data.recommendations || []);
    } catch (err) {
      console.error("Error searching jobs:", err);
      setError("Failed to search jobs. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Enter job title, skills, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="lg"
          className="bg-[#1E1E1E] text-white border-purple-500"
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />

        <Button
          onClick={handleSearch}
          className="bg-purple-600 hover:bg-purple-700 transition-colors"
          size="lg"
        >
          Search Jobs
        </Button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
