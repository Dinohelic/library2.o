import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Resource } from '../types';

const EditStoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, stories, updateStory, loading: authLoading } = useAuth();
  
  const story = useMemo(() => stories.find(s => s.id === id), [stories, id]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return; // Wait for auth to resolve

    if (story) {
      if (story.authorId !== currentUser?.uid) {
        setError("You don't have permission to edit this story.");
      } else {
        setTitle(story.title);
        setContent(story.content);
        setSummary(story.summary || '');
        setTags(story.tags?.join(', ') || '');
        setError('');
      }
    } else if (id) {
        // If auth is done and we have an ID but still no story, it's not found.
        setError("Story not found.");
    }
  }, [story, currentUser, authLoading, id]);

  const handleSave = (publish: boolean) => {
    if (!story) return;
    setIsLoading(true);
    const updatedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    const updates: Partial<Omit<Resource, 'id'>> = {
      title,
      content,
      summary,
      tags: updatedTags,
      status: publish ? 'published' : 'pending_review',
    };
    
    updateStory(story.id, updates);
    
    setTimeout(() => { // Simulate async operation
        setIsLoading(false);
        if(publish) {
            navigate('/profile');
        }
    }, 500);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
     return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">{error}</p>
            <Link to="/profile" className="mt-4 inline-block bg-brand-blue text-white px-4 py-2 rounded-lg">
                Back to My Profile
            </Link>
        </div>
    );
  }

  if (!story) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Review & Publish Your Story</h1>
          <p className="text-slate-600 dark:text-slate-300">Review the AI-generated content below. You can make any edits needed before publishing your story to the library.</p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Story Content</label>
          <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={15} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>
        
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-slate-700 dark:text-slate-300">AI-Generated Summary</label>
          <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows={5} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tags (comma-separated)</label>
          <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t dark:border-slate-700">
            <button onClick={() => handleSave(false)} disabled={isLoading} className="flex-1 justify-center py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none disabled:bg-slate-200 dark:disabled:bg-slate-500">
                {isLoading ? <LoadingSpinner/> : 'Save Draft'}
            </button>
            <button onClick={() => handleSave(true)} disabled={isLoading} className="flex-1 justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-orange hover:bg-orange-600 focus:outline-none disabled:bg-slate-400">
                {isLoading ? <LoadingSpinner/> : 'Approve & Publish'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditStoryPage;