
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900/50 shadow-inner dark:border-t dark:border-slate-800 mt-8">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Living Library 2.0. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;