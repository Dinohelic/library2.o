import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RESOURCES } from '../constants';
import type { Resource } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EmpathyMeter from '../components/EmpathyMeter';
import { useAuth } from '../contexts/AuthContext';

const ResourcePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string>('');
  const { stories, currentUser, loading: authLoading, comments, likes, reports, addComment, toggleLike, reportContent, bookmarks, toggleBookmark, empathyRatings, rateEmpathy } = useAuth();
  const [newComment, setNewComment] = useState('');

  const allResources = useMemo(() => {
    return [...RESOURCES, ...stories];
  }, [stories]);

  useEffect(() => {
    if (authLoading) return; // Wait for authentication to resolve

    const foundResource = allResources.find(r => r.id === id);
    if (foundResource) {
      // Authorization check
      if (foundResource.status !== 'published' && foundResource.authorId !== currentUser?.uid) {
        setError('This resource is not yet published or you do not have permission to view it.');
        setResource(null);
      } else {
        setResource(foundResource);
        setError('');
      }
    } else {
      setError('Resource not found.');
      setResource(null);
    }
  }, [id, allResources, currentUser, authLoading]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !resource) return;
    addComment(resource.id, newComment);
    setNewComment('');
  };
  
  const isReported = useMemo(() => {
    if (!currentUser || !resource) return false;
    return reports.some(r => r.resourceId === resource.id && r.reporterId === currentUser.uid);
  }, [reports, currentUser, resource]);

  const handleReport = () => {
      if (!currentUser || !resource) return;
      if (isReported) {
          alert("You have already reported this content.");
          return;
      }
      const confirmReport = window.confirm(`Are you sure you want to report "${resource.title}" for inappropriate content?`);
      if (confirmReport) {
          reportContent(resource.id, resource.title);
          alert("Content reported. Thank you for your feedback.");
      }
  };


  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error && !resource) {
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">{error}</p>
            <Link to="/library" className="mt-4 inline-block bg-brand-blue text-white px-4 py-2 rounded-lg">
                Back to Library
            </Link>
        </div>
    );
  }

  if (!resource) {
    return (
       <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const resourceLikes = likes[resource.id] || [];
  const hasLiked = currentUser ? resourceLikes.includes(currentUser.uid) : false;
  const isBookmarked = currentUser ? bookmarks.includes(resource.id) : false;
  const resourceEmpathyRatings = empathyRatings[resource.id] || [];
  const averageEmpathyRating = resourceEmpathyRatings.length > 0
      ? resourceEmpathyRatings.reduce((sum, r) => sum + r.rating, 0) / resourceEmpathyRatings.length
      : 0;
  const userEmpathyRating = resourceEmpathyRatings.find(r => r.userId === currentUser?.uid)?.rating || null;
  

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue text-sm font-semibold px-3 py-1 rounded-full mb-4">
          {resource.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">{resource.title}</h1>
        {resource.authorName && <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">By {resource.authorName}</p>}
        <img src={resource.imageUrl} alt={resource.title} className="w-full h-64 object-cover rounded-lg mb-6 shadow-md" loading="lazy" decoding="async"/>
        
        {resource.tags && resource.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {resource.tags.map(tag => (
              <span key={tag} className="bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue text-sm font-semibold px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 my-6">
            <button 
                onClick={() => toggleLike(resource.id)}
                disabled={!currentUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 ${
                    hasLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                } disabled:cursor-not-allowed disabled:opacity-60`}
                aria-label={hasLiked ? 'Unlike this resource' : 'Like this resource'}
            >
                  <svg className={`h-5 w-5 ${hasLiked ? 'text-white' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                <span>{hasLiked ? 'Liked' : 'Like'}</span>
            </button>
             <button
                onClick={() => toggleBookmark(resource.id)}
                disabled={!currentUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 ${
                    isBookmarked
                    ? 'bg-brand-blue text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                } disabled:cursor-not-allowed disabled:opacity-60`}
                aria-label={isBookmarked ? 'Remove from Bookmarks' : 'Add to Bookmarks'}
            >
                {isBookmarked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                )}
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            <span className="text-slate-500 dark:text-slate-400 font-medium">{resourceLikes.length} {resourceLikes.length === 1 ? 'Like' : 'Likes'}</span>
            <button
                onClick={handleReport}
                disabled={!currentUser || isReported}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Report this content"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 01-1-1V6z" clipRule="evenodd" />
                </svg>
                <span>{isReported ? 'Reported' : 'Report'}</span>
            </button>
        </div>

        <div className="prose prose-lg max-w-none text-slate-700 dark:text-slate-300">
          <h2 className="text-2xl font-bold border-b dark:border-slate-600 pb-2 mb-4 text-slate-800 dark:text-slate-200">Full Text</h2>
          {resource.status === 'processing' && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-lg">
              <p className="text-yellow-800 dark:text-yellow-300">This story is currently being processed. The transcript will be available shortly.</p>
            </div>
          )}
           {resource.status === 'pending_review' && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg">
              <p className="text-blue-800 dark:text-blue-300">This story is pending your review. You can edit and publish it from your profile page.</p>
            </div>
          )}
          <p>{resource.content}</p>
        </div>

        <div className="mt-10 border-t dark:border-slate-700 pt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">AI-Powered Summary</h2>
          {resource.summary && resource.summary.trim() !== '' && resource.status === 'published' ? (
            <div className="mt-6 p-6 bg-blue-50 dark:bg-slate-800/50 border-l-4 border-brand-blue rounded-r-lg animate-fade-in">
              <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{resource.summary}</p>
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 mt-2">A summary is not yet available for this resource. It will appear here once the story is published.</p>
          )}
        </div>

        <div className="mt-10 border-t dark:border-slate-700 pt-8">
            <EmpathyMeter
                averageRating={averageEmpathyRating}
                ratingCount={resourceEmpathyRatings.length}
                userRating={userEmpathyRating}
                onRate={(rating) => rateEmpathy(resource.id, rating)}
                disabled={!currentUser}
            />
            {!currentUser && (
                 <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                    <Link to="/auth" className="font-semibold text-brand-orange hover:underline">Log in</Link> to share how this story made you feel.
                </p>
            )}
        </div>

        <div className="mt-10 border-t dark:border-slate-700 pt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Community Discussion</h2>
            
            {currentUser ? (
                <form onSubmit={handlePostComment} className="mb-8">
                    <div className="flex items-start space-x-4">
                        <img src={currentUser.imageUrl} alt={currentUser.name || 'user'} className="h-10 w-10 rounded-full object-cover"/>
                        <div className="min-w-0 flex-1">
                            <textarea
                                rows={3}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm p-3 focus:ring-brand-blue focus:border-brand-blue dark:placeholder-slate-400"
                                placeholder="Add to the discussion..."
                                required
                            />
                            <div className="mt-2 flex justify-end">
                                <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-300">
                        <Link to="/auth" className="font-semibold text-brand-orange hover:underline">Log in or sign up</Link> to join the discussion.
                    </p>
                </div>
            )}
            
            <div className="space-y-6">
                {comments.filter(c => c.resourceId === resource.id).sort((a, b) => b.timestamp - a.timestamp).map(comment => (
                      <div key={comment.id} className="flex items-start space-x-4 animate-fade-in">
                        <img src={comment.authorImageUrl} alt={comment.authorName} className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                        <div className="min-w-0 flex-1">
                            <div className="text-sm">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{comment.authorName}</span>
                                <span className="text-slate-500 dark:text-slate-400 ml-2">· {new Date(comment.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                ))}
                  {comments.filter(c => c.resourceId === resource.id).length === 0 && (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">No comments yet. Be the first to start the discussion!</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;