import React, { useState } from 'react';

interface EmpathyMeterProps {
  averageRating: number;
  ratingCount: number;
  userRating: number | null;
  onRate: (rating: number) => void;
  disabled: boolean;
}

const faces = [
    { rating: 1, color: '#ef4444', label: 'Terrible', path: <><path strokeLinecap="round" strokeLinejoin="round" d="M8 10l-2 2m0-2l2 2m8-2l-2 2m0-2l2 2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 16c-2-1.5-6-1.5-8 0" /></> },
    { rating: 2, color: '#f97316', label: 'Bad', path: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5h.01M15 10.5h.01" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 16c-2-1.5-6-1.5-8 0" /></> },
    { rating: 3, color: '#eab308', label: 'Okay', path: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5h.01M15 10.5h.01" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 15h8" /></> },
    { rating: 4, color: '#3b82f6', label: 'Good', path: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5h.01M15 10.5h.01" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 14s1.5 2 4 2 4-2 4-2" /></> },
    { rating: 5, color: '#22c55e', label: 'Great', path: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.5a.5.5 0 11-1 0 .5.5 0 011 0zm6 0a.5.5 0 11-1 0 .5.5 0 011 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 14s1.5 3 4 3 4-3 4-3" /></> },
];


const EmpathyMeter: React.FC<EmpathyMeterProps> = ({ userRating, onRate, disabled, averageRating, ratingCount }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || userRating || Math.round(averageRating) || 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border dark:border-slate-700 space-y-4">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center">How did this story make you feel?</h3>
      <div 
        className="flex items-center justify-center space-x-2 sm:space-x-4"
        onMouseLeave={() => setHoverRating(0)}
        role="radiogroup"
        aria-label="Story rating"
      >
        {faces.map(({ rating, color, label, path }) => {
          const isActive = rating <= displayRating;
          const isUserSelected = rating === userRating;

          return (
            <button
              key={rating}
              disabled={disabled}
              className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed transform hover:scale-110"
              style={{ '--tw-ring-color': color } as React.CSSProperties}
              onMouseEnter={() => !disabled && setHoverRating(rating)}
              onClick={() => onRate(rating)}
              aria-label={label}
              role="radio"
              aria-checked={isUserSelected}
            >
              <span 
                className={`absolute inset-0 rounded-full transition-colors ${isActive ? '' : 'bg-slate-200 dark:bg-slate-700'}`}
                style={{ backgroundColor: isActive ? `${color}20` : undefined }}
              ></span>
              <svg 
                className="relative w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200" 
                style={{ color: isActive ? color : '#94A3B8' }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {path}
              </svg>
            </button>
          )
        })}
      </div>
      
      <div className="w-full max-w-sm mx-auto h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-4 overflow-hidden relative">
        <div 
          className="h-full rounded-full transition-all duration-300" 
          style={{ 
            width: `${(displayRating / 5) * 100}%`,
            background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #3b82f6, #22c55e)'
          }}
        />
      </div>
      
      <div className="text-center text-slate-600 dark:text-slate-400">
        {hoverRating > 0 ? (
          <p className="font-semibold text-lg" style={{ color: faces[hoverRating-1].color }}>{faces[hoverRating-1].label}</p>
        ) : userRating ? (
          <p>Your rating: <span className="font-semibold" style={{ color: faces[userRating-1].color }}>{faces[userRating-1].label}</span></p>
        ) : ratingCount > 0 ? (
          <p>Community average from {ratingCount} vote{ratingCount !== 1 ? 's' : ''}</p>
        ) : (
          <p>Be the first to rate!</p>
        )}
      </div>
    </div>
  );
};

export default EmpathyMeter;