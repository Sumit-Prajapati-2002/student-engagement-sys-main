import { Button } from "@mantine/core";
import Link from "next/link";
export default function JobButton() {
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
  return (
    
    <Link href="/jobs" passHref>
      <Button
        component="div"
        className="bg-[#1E1E1E] text-[#8B5CF6] border-2 border-[#8B5CF6] hover:bg-opacity-90 hover:scale-105 transition-all duration-300"
        leftSection={briefcaseIcon}
      >
        Job Finder
      </Button>
    </Link>
  );
}
