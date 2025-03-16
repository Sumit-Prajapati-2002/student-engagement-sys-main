"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Container, Text, Button } from "@mantine/core";
import { Header } from "@/components/Header";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";


interface RoadmapData {
  roadmap: string;
  field: string;
  timestamp: number;
}

interface WeekContent {
  focus: string;
  learningGoals: string[];
  practicalTasks: string[];
  resources: string[];
}

export default function RoadmapPage() {
  const briefcaseIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-purple-400"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
  const router = useRouter();
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [parsedRoadmap, setParsedRoadmap] = useState<{
    overview: string;
    skills: string[];
    weeks: WeekContent[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoadmapData = () => {
      try {
        const storedData = localStorage.getItem("roadmapData");
        if (!storedData) {
          router.push("/");
          return;
        }

        const parsedData = JSON.parse(storedData);
        setRoadmapData(parsedData);

        // Parse the roadmap content
        const sections = parsedData.roadmap.split("[");

        if (!sections || sections.length < 4) {
          throw new Error("Invalid roadmap format");
        }

        const parsedContent = {
          overview: sections[1]?.split("]")[1]?.trim() || "",
          skills:
            sections[2]
              ?.split("]")[1]
              ?.split("•")
              .filter((skill: string) => skill.trim().length > 0)
              .map((s: string) => s.trim()) || [],
          weeks:
            sections[3]
              ?.split(/Week \d+:/g)
              .slice(1) // Skip the first empty element
              .map((weekContent: string, index: number) => {
                const weekNumber = `${index + 1}`;

                const goals =
                  weekContent
                    .match(/📚 Learning Goals:([\s\S]*?)(?=🛠️|📖|$)/)?.[1]
                    ?.split("•")
                    .filter((goal: string) => goal.trim().length > 0)
                    .map((g: string) => g.trim()) || [];

                const tasks =
                  weekContent
                    .match(/🛠️ Practical Tasks:([\s\S]*?)(?=📖|$)/)?.[1]
                    ?.split("•")
                    .filter((task: string) => task.trim().length > 0)
                    .map((t: string) => t.trim()) || [];

                const resources =
                  weekContent
                    .match(/📖 Resources:([\s\S]*?)(?=Week|$)/)?.[1]
                    ?.split("•")
                    .filter((resource: string) => resource.trim().length > 0)
                    .map((r: string) => r.trim()) || [];

                return {
                  focus: weekNumber,
                  learningGoals: goals,
                  practicalTasks: tasks,
                  resources: resources,
                };
              }) || [],
        };

        setParsedRoadmap(parsedContent);
      } catch (error) {
        console.error("Error loading roadmap:", error);
        setError("Failed to load roadmap data");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmapData();
  }, [router]);

  const handleDownload = () => {
    if (!roadmapRef.current) return;

    const element = roadmapRef.current;
    const opt = {
      margin: 1,
      filename: `${roadmapData?.field}-roadmap.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Text color="red">{error}</Text>
      </div>
    );
  }

  if (isLoading || !parsedRoadmap || !roadmapData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Text>Loading...</Text>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Container size="lg" py="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                component="a"
                href="/"
                className="bg-[#1E1E1E] text-[#8B5CF6] border-2 border-[#8B5CF6] hover:bg-opacity-90 hover:scale-105 transition-all duration-300"
                leftSection={<i className="fas fa-arrow-left" />}
              >
                Back to Home
              </Button>
              <Button
                component="a"
                href="/chat"
                className="bg-[#1E1E1E] text-[#8B5CF6] border-2 border-[#8B5CF6] hover:bg-opacity-90 hover:scale-105 transition-all duration-300"
                leftSection={<i className="fas fa-comments" />}
              >
                Chat Assistant
              </Button>
              <Button
                component="a"
                href="/jobs"
                className="bg-[#1E1E1E] text-[#8B5CF6] border-2 border-[#8B5CF6] hover:bg-opacity-90 hover:scale-105 transition-all duration-300"
                leftSection={briefcaseIcon}
              >
                Find jobs
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleDownload}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white hover:scale-105 transition-all duration-300"
                leftSection={<i className="fas fa-download" />}
              >
                Download Roadmap
              </Button>
            </motion.div>
          </div>

          <motion.div
            ref={roadmapRef}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <Text
                size="xl"
                fw={700}
                className="text-white mb-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent"
              >
                Your Personalized Career Roadmap
              </Text>
              <Text size="md" className="text-gray-400">
                12-week plan for {roadmapData.field} career path
              </Text>
            </div>

            {/* Overview section */}
            <motion.div
              className="p-6 rounded-xl bg-[#1E1E1E]"
              whileHover={{ scale: 1.01 }}
            >
              <Text
                size="lg"
                fw={600}
                className="text-[#8B5CF6] mb-4 flex items-center gap-2"
              >
                <i className="fas fa-info-circle" />
                Overview
              </Text>
              <Text className="text-gray-300">{parsedRoadmap.overview}</Text>
            </motion.div>

            {/* Skills section */}
            <motion.div
              className="p-6 rounded-xl bg-[#1E1E1E]"
              whileHover={{ scale: 1.01 }}
            >
              <Text
                size="lg"
                fw={600}
                className="text-[#8B5CF6] mb-6 flex items-center gap-2"
              >
                <i className="fas fa-star" />
                Skills to Master
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedRoadmap.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 rounded-lg bg-[#252525] hover:bg-[#2A2A2A] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      <Text className="text-gray-300">{skill}</Text>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Weekly breakdown section */}
            <motion.div
              className="p-6 rounded-xl bg-[#1E1E1E]"
              whileHover={{ scale: 1.01 }}
            >
              <Text
                size="lg"
                fw={600}
                className="text-[#8B5CF6] mb-6 flex items-center gap-2"
              >
                <i className="fas fa-calendar-alt" />
                Weekly Breakdown
              </Text>
              <div className="space-y-8">
                {parsedRoadmap.weeks.map((week, index) => (
                  <motion.div
                    key={index}
                    className="relative pl-8 border-l-2 border-[#2A2A2A] last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-xs">
                      {week.focus}
                    </div>

                    <div className="bg-[#252525] rounded-lg p-6 hover:bg-[#2A2A2A] transition-colors">
                      <Text className="text-white font-semibold text-lg mb-4">
                        Week {week.focus}
                      </Text>

                      {week.learningGoals.length > 0 && (
                        <div className="mb-4">
                          <Text size="sm" className="text-[#8B5CF6] mb-2">
                            📚 Learning Goals
                          </Text>
                          <div className="space-y-2">
                            {week.learningGoals.map((goal, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 group"
                                whileHover={{ x: 4 }}
                              >
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#8B5CF6] group-hover:scale-110 transition-transform" />
                                <Text className="text-gray-300 group-hover:text-white transition-colors">
                                  {goal}
                                </Text>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {week.practicalTasks.length > 0 && (
                        <div className="mb-4">
                          <Text size="sm" className="text-[#8B5CF6] mb-2">
                            🛠️ Practical Tasks
                          </Text>
                          <div className="space-y-2">
                            {week.practicalTasks.map((task, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 group"
                                whileHover={{ x: 4 }}
                              >
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#8B5CF6] group-hover:scale-110 transition-transform" />
                                <Text className="text-gray-300 group-hover:text-white transition-colors">
                                  {task}
                                </Text>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {week.resources.length > 0 && (
                        <div>
                          <Text size="sm" className="text-[#8B5CF6] mb-2">
                            📖 Resources
                          </Text>
                          <div className="space-y-2">
                            {week.resources.map((resource, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 group"
                                whileHover={{ x: 4 }}
                              >
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#8B5CF6] group-hover:scale-110 transition-transform" />
                                <Text className="text-gray-300 group-hover:text-white transition-colors">
                                  {resource}
                                </Text>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
