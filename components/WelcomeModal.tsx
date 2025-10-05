
import React from 'react';
import { Link } from 'react-router-dom';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative transform transition-all duration-300 scale-95 motion-safe:hover:scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Close welcome message"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-blue/10 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1ZM5 20h14V4H5v16Z"/><path d="M8 6h8v2H8V6Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z"/>
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Welcome to Living Library 2.0!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Create an account or log in to contribute your own stories, comment on articles, and save your favorites.
        </p>
        <div className="flex">
          <Link
            to="/auth"
            onClick={onClose}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
        <button
          onClick={onClose}
          className="mt-6 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;