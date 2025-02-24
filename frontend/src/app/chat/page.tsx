'use client';

import { useState, useRef, useEffect } from 'react';
import { Text, Button } from '@mantine/core';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function getFormattedTime() {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date());
}

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello! 👋 I'm your career assistant, ready to help you navigate your professional journey. Feel free to ask me about:\n• Your career roadmap\n• Skill development\n• Job opportunities\n• Industry insights\n• Professional growth",
    timestamp: getFormattedTime()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: getFormattedTime()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chatbot', {
        message: userMessage.content
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: getFormattedTime()
      }]);
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to get response';
        console.error('API Error:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="h-screen flex flex-col">
      {/* Main Chat Area */}
      <motion.div
        className="flex-1 flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-xl m-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-purple-900 border-b border-gray-700/50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Career Chat Assistant</h1>
              <p className="text-sm text-gray-300">Your personal career guide and mentor</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-300">Online</span>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-xl shadow-lg break-words ${
                message.role === 'user' 
                  ? 'bg-blue-900 text-gray-100 border border-blue-700/50' 
                  : 'bg-gray-800 text-gray-100 border border-gray-700/50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <i className={`fas ${message.role === 'user' ? 'fa-user' : 'fa-robot'} text-gray-300`}></i>
                  <span className="font-semibold text-gray-300">
                    {message.role === 'user' ? 'You' : 'Career Assistant'}
                  </span>
                </div>
                <Text className="whitespace-pre-wrap text-gray-100">{message.content}</Text>
                <Text size="xs" className="mt-2 text-gray-400 text-right">
                  {message.timestamp}
                </Text>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700/50">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800/50 border-t border-gray-700/50 rounded-b-2xl">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message..."
                className="flex-grow p-3 bg-gray-900/80 text-gray-200 rounded-xl resize-none border border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                rows={2}
                style={{ minHeight: "60px", maxHeight: "120px" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2
                  ${isLoading || !input.trim() 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <span>Send</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>

            {/* Back to Home Button */}
            <Button
              component="a"
              href="/"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all duration-300 w-full py-2 rounded-xl flex items-center justify-center gap-2"
            >
              <i className="fas fa-home"></i>
              Back to Home
            </Button>
          </div>
        </form>
      </motion.div>
    </Container>
  );
} 