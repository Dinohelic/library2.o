
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { MessageAuthor } from '../types';
import { getChatResponse } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        author: MessageAuthor.AI,
        text: "Hello! I'm the Living Library's AI Assistant. How can I help you today? You can ask me about our resources or any general knowledge questions.",
      },
    ]);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: ChatMessage = { author: MessageAuthor.USER, text: userInput };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setUserInput('');
    setIsLoading(true);

    const history = currentMessages
      .slice(0, -1) // Exclude the user's latest message
      .filter(m => m.author === MessageAuthor.AI || m.author === MessageAuthor.USER)
      .map(m => ({
        role: m.author === MessageAuthor.USER ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

    try {
      const aiResponseText = await getChatResponse(history, userInput);
      const newAiMessage: ChatMessage = { author: MessageAuthor.AI, text: aiResponseText };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        author: MessageAuthor.AI,
        text: "I'm sorry, but I encountered an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, messages]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col h-[75vh]">
      <div className="p-4 border-b dark:border-slate-700">
        <h1 className="text-xl font-bold text-brand-blue">AI Assistant</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Your personal guide to knowledge</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.author === MessageAuthor.USER ? 'bg-brand-blue text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-lg px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <LoadingSpinner />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-grow w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-brand-blue focus:border-brand-blue disabled:bg-slate-200 dark:disabled:bg-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;