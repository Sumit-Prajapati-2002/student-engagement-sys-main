import { AppShell, Container, Button } from '@mantine/core';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding="md"
      header={{ height: 70 }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-[70px] shadow-lg">
        <Container size="lg" className="h-full px-4">
          <div className="flex items-center justify-between h-full">
            <div className="text-white font-bold text-lg sm:text-xl">Career Roadmap</div>
            <nav className="flex gap-3 sm:gap-6">
              <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm sm:text-base">Home</Link>
              <Link href="/chat" className="text-white/80 hover:text-white transition-colors text-sm sm:text-base">Chat</Link>
              <Link href="/jobs" className="text-white/80 hover:text-white transition-colors text-sm sm:text-base">Jobs</Link>
            </nav>
          </div>
        </Container>
      </div>

      <main className="min-h-screen pt-[70px] bg-[#121212] text-white">
        <Container size="lg" className="py-4 sm:py-8 px-4">
          {children}
        </Container>
      </main>

      {/* Chat Button */}
      <div className="fixed bottom-8 right-8">
        <Link href="/chat">
          <Button variant="filled" color="blue">
            Chat
          </Button>
        </Link>
      </div>
    </AppShell>
  );
} 