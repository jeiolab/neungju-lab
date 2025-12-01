'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeGame, sendUserMessage } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { Message, Sender } from './types';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const MissingIPCaseApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setGameStarted(true);
    try {
      const initialText = await initializeGame();
      const newMessage: Message = {
        id: crypto.randomUUID(),
        role: Sender.MODEL,
        text: initialText,
        timestamp: Date.now(),
      };
      setMessages([newMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add User Message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: Sender.USER,
      text: userText,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI Response
      const responseText = await sendUserMessage(userText);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: Sender.MODEL,
        text: responseText,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
      // Keep focus on input for better UX
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Intro Screen
  if (!gameStarted) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 px-4 text-center py-12">
          <div className="max-w-md bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="mb-6 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl">
              🕵️
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">사라진 IP 주소 사건</h1>
            <p className="text-gray-600 mb-6">학교 서버가 다운됐다! 네트워크 수습반이 되어<br/>IP, 게이트웨이, DNS 문제를 해결하고 탈출하세요.</p>
            
            <button
              onClick={startGame}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-sm flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : '수사 시작하기'}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-[73px] z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg text-sm font-bold">NET</div>
          <h1 className="text-lg font-display font-bold text-gray-900">네트워크 수습반 본부</h1>
        </div>
        <div className="text-xs text-gray-500 font-mono-tech">SERVER_STATUS: CRITICAL</div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2 bg-background-light max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            isLast={idx === messages.length - 1} 
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full mb-6">
             <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                <span className="text-primary text-xs font-bold mr-2">시스템 분석 중...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <form onSubmit={handleSend} className="flex gap-2 relative max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="단서를 보고 답을 입력하세요 (예: IP는 192.168.1.10)"
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-900 placeholder-gray-400 outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors shadow-sm flex-shrink-0 w-14 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
        <div className="text-center mt-2 text-[10px] text-gray-400 max-w-4xl mx-auto">
          답변이 틀려도 괜찮아요. AI가 도와줍니다.
        </div>
      </footer>
      
      <Footer />
    </div>
  );
};

export default MissingIPCaseApp;

