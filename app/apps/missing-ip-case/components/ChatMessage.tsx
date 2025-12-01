'use client'

import React, { useMemo } from 'react';
import { Message, Sender } from '../types';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.role === Sender.USER;

  // Simple Markdown formatting for static messages (history)
  const formattedText = useMemo(() => {
    const parts = message.text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-primary font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-200 px-1 rounded text-sm font-mono-tech text-primary">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  }, [message.text]);

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-5 py-4 shadow-sm ${
          isUser
            ? 'bg-primary text-white rounded-tr-none'
            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
        }`}
      >
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-bold mb-1 ${isUser ? 'text-white/80' : 'text-primary'}`}>
            {isUser ? '수습반원 (나)' : '시스템 관리자 (AI)'}
          </span>
          <div className={`text-sm md:text-base whitespace-pre-wrap leading-relaxed ${isUser ? 'text-white' : 'text-gray-700'}`}>
            {formattedText}
          </div>
        </div>
      </div>
    </div>
  );
};

