import { Button } from "@mantine/core";
import Link from "next/link";
export default function ChatButton() {
  return (
    <Link href="/chat" passHref>
      <Button
        component="div"
        className="bg-[#1E1E1E] text-[#8B5CF6] border-2 border-[#8B5CF6] hover:bg-opacity-90 hover:scale-105 transition-all duration-300"
        leftSection={<i className="fas fa-comments" />}
      >
        Chat Assistant
      </Button>
    </Link>
  );
}
