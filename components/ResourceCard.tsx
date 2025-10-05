



import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Resource } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ResourceCardProps {
  resource: Resource;
  likesCount?: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, likesCount = 0 }) => {
  const { currentUser, reportContent, reports, bookmarks, toggleBookmark } = useAuth();
  const isPendingReview = resource.status === 'pending_review';

  const isReported = useMemo(() => {
    if (!currentUser) return false;
    return reports.some(r => r.resourceId === resource.id && r.reporterId === currentUser.uid);
  }, [reports, currentUser, resource.id]);

  const isBookmarked = useMemo(() => {
    if (!currentUser) return false;
    return bookmarks.includes(resource.id);
  }, [bookmarks, currentUser, resource.id]);

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to resource page
    e.stopPropagation();
    if (!currentUser) {
      alert("Please log in to report content.");
      return;
    }
    if (isReported) {
      alert("You have already reported this content.");
      return;
    }
    const confirmReport = window.confirm(`Are you sure you want to report "${resource.title}"?`);
    if (confirmReport) {
      reportContent(resource.id, resource.title);
      alert("Content reported. Thank you for your feedback.");
    }
  };
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      alert("Please log in to bookmark content.");
      return;
    }
    toggleBookmark(resource.id);
  };


  return (
    <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col hover:-translate-y-1">
      {currentUser && (
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-brand-blue/20 text-slate-500 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
          title={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
          aria-label={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
        >
          {isBookmarked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      )}

      {currentUser && !isPendingReview && resource.status === 'published' && (
        <button
          onClick={handleReportClick}
          disabled={isReported}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
          title={isReported ? "Content Reported" : "Report Content"}
          aria-label={isReported ? "Content Reported" : "Report Content"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 01-1-1V6z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      <img className="h-48 w-full object-cover" src={resource.imageUrl} alt={resource.title} loading="lazy" decoding="async" />
      <div className="p-6 flex flex-col flex-grow">
        <div>
          <div className="flex justify-between items-center text-sm">
            <span className="uppercase tracking-wide text-brand-blue font-semibold">{resource.category}</span>
             <div className="flex items-center gap-4">
                {resource.authorName && <span className="text-slate-500 dark:text-slate-400">by {resource.authorName}</span>}
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400" title={`${likesCount} likes`}>
                    <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{likesCount}</span>
                </div>
            </div>
          </div>
          <h3 className="block mt-1 text-lg leading-tight font-medium text-black dark:text-white">{resource.title}</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-base flex-grow">{resource.shortDescription}</p>
          {resource.tags && resource.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {resource.tags.slice(0, 3).map(tag => (
                <span key={tag} className="bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4">
            {isPendingReview ? (
                 <Link 
                    to={`/edit-story/${resource.id}`} 
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Edit & Publish
                  </Link>
            ) : (
                <Link 
                    to={`/resource/${resource.id}`} 
                    className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Read More
                </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;