import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOST_VIEWED_AUTHORS } from '../constants';
import WelcomeModal from '../components/WelcomeModal';
import { useAuth } from '../contexts/AuthContext';


const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Show modal on load if user is not logged in.
    if (!currentUser) {
      // Use a timeout to make it feel less abrupt
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Ensure modal is hidden if user is logged in
      setShowWelcomeModal(false);
    }
  }, [currentUser]);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <>
      {showWelcomeModal && <WelcomeModal onClose={handleCloseModal} />}
      <div className="text-center py-16">
        <div 
          className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0),#fff)] -z-10" 
          style={{ backgroundSize: '32px 32px' }}>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-blue mb-4">
          Welcome to Living Library 2.0
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
          Discover a new way to interact with knowledge. Explore resources, get instant AI-powered summaries, and chat with our intelligent assistant to deepen your understanding.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link 
            to="/library" 
            className="bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Explore the Library
          </Link>
          <Link 
            to="/assistant" 
            className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Talk to AI Assistant
          </Link>
        </div>
         <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-brand-blue mb-2">Search & Discover</h3>
            <p className="text-slate-600 dark:text-slate-300">Effortlessly find resources across various categories with our intuitive search and filtering tools.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-brand-blue mb-2">Instant Summaries</h3>
            <p className="text-slate-600 dark:text-slate-300">Leverage the power of Gemini to get concise summaries of long documents in seconds.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-brand-blue mb-2">Interactive Learning</h3>
            <p className="text-slate-600 dark:text-slate-300">Engage with our AI Assistant to ask questions, clarify concepts, and explore topics further.</p>
          </div>
        </div>
        
        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-12">Weekly Most Viewed Authors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12">
            {MOST_VIEWED_AUTHORS.map((author) => (
              <Link 
                key={author.name} 
                to={`/library?author=${encodeURIComponent(author.name)}`} 
                className="flex flex-col items-center group" 
                title={author.bio}
              >
                <div className="relative">
                  <img
                    className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-800 group-hover:border-brand-orange transition-all duration-300"
                    src={author.imageUrl}
                    alt={author.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300 group-hover:text-brand-orange transition-colors">{author.name}</h3>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default HomePage;