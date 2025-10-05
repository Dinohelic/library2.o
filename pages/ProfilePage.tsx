import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ResourceCard from '../components/ResourceCard';
import { RESOURCES } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { currentUser, stories, comments, likes, reports, updateUserProfile, bookmarks } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const allResources = useMemo(() => {
    return [...RESOURCES, ...stories];
  }, [stories]);
  
  const bookmarkedResources = useMemo(() => {
    return allResources.filter(r => bookmarks.includes(r.id));
  }, [allResources, bookmarks]);
  
  const userStories = useMemo(() => {
    if (!currentUser) return [];
    return stories.filter(story => story.authorId === currentUser.uid);
  }, [stories, currentUser]);

  const userComments = useMemo(() => {
    if (!currentUser) return [];
    return comments
      .filter(comment => comment.authorId === currentUser.uid)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [comments, currentUser]);

  const userReports = useMemo(() => {
    if (!currentUser) return [];
    return reports
      .filter(report => report.reporterId === currentUser.uid)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [reports, currentUser]);

  useEffect(() => {
    if (currentUser) {
        setName(currentUser.name || '');
        setImagePreview(null);
        setImageFile(null);
        setError('');
    }
  }, [currentUser, isEditing]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
        setError("Name cannot be empty.");
        return;
    }
    setIsSaving(true);
    setError('');
    try {
        await updateUserProfile(name, imageFile);
        setIsEditing(false);
    } catch (err) {
        setError("Failed to update profile. Please try again.");
        console.error(err);
    } finally {
        setIsSaving(false);
    }
  };


  if (!currentUser) {
    return (
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-brand-blue">Login Required</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 mb-4">You need to be logged in to view your profile.</p>
        <Link 
          to="/auth"
          className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: 'processing' | 'pending_review' | 'published' | undefined) => {
    switch (status) {
      case 'processing':
        return <div className="absolute top-2 right-2 bg-blue-400 text-white text-xs font-semibold px-2 py-1 rounded-full z-10 animate-pulse">Processing...</div>;
      case 'pending_review':
        return <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full z-10">Pending Review</div>;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {isEditing ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group flex-shrink-0">
              <label htmlFor="profile-image-upload" className="cursor-pointer">
                <img className="w-24 h-24 rounded-full object-cover group-hover:opacity-75 transition-opacity" src={imagePreview || currentUser.imageUrl} alt="Profile preview" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </label>
              <input id="profile-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <div className="flex-grow w-full">
              <label htmlFor="name-input" className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <input id="name-input" type="text" value={name} onChange={(e) => setName(e.target.value)} className="text-3xl font-bold text-brand-blue bg-transparent border-b-2 border-slate-200 dark:border-slate-600 focus:border-brand-blue focus:outline-none w-full pb-1" />
              <p className="text-slate-600 dark:text-slate-400 mt-1">{currentUser.email}</p>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mt-4 text-center sm:text-left">{error}</p>}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2">
              {isSaving ? <LoadingSpinner /> : 'Save Changes'}
            </button>
            <button onClick={() => setIsEditing(false)} disabled={isSaving} className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors duration-300">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                <img className="w-24 h-24 rounded-full object-cover" src={currentUser.imageUrl} alt={currentUser.name || 'User'} loading="lazy" decoding="async" />
                <div>
                    <h1 className="text-3xl font-bold text-brand-blue">{currentUser.name}</h1>
                    <p className="text-slate-600 dark:text-slate-400">{currentUser.email}</p>
                </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 self-start sm:self-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                Edit Profile
            </button>
        </div>
      )}
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">My Stories</h2>
            <Link to="/add-story" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                Add New Story
            </Link>
        </div>
        
        {userStories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userStories.map(story => (
              <div key={story.id} className="relative">
                {getStatusBadge(story.status)}
                <ResourceCard resource={story} likesCount={(likes[story.id] || []).length} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">You haven't added any stories yet.</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Why not share your first one?</p>
          </div>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">My Bookmarks</h2>
        {bookmarkedResources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarkedResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                likesCount={(likes[resource.id] || []).length}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">You haven't bookmarked any resources yet.</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Click the bookmark icon on any resource to save it here.</p>
          </div>
        )}
      </div>
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">My Reported Content</h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          {userReports.length > 0 ? (
            <ul className="space-y-4">
              {userReports.map(report => (
                <li key={report.resourceId} className="border-b last:border-b-0 dark:border-slate-700 pb-4 last:pb-0 flex justify-between items-center">
                  <div>
                    <p className="text-slate-700 dark:text-slate-300">You reported <Link to={`/resource/${report.resourceId}`} className="font-semibold text-brand-blue hover:underline">{report.resourceTitle}</Link></p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">on {new Date(report.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">Pending Review</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center">You haven't reported any content.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">My Recent Activity</h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            {userComments.length > 0 ? (
                <ul className="space-y-4">
                    {userComments.slice(0, 5).map(comment => {
                      const commentedResource = allResources.find(r => r.id === comment.resourceId);
                      return (
                        <li key={comment.id} className="border-b last:border-b-0 dark:border-slate-700 pb-4 last:pb-0">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">You commented on <Link to={`/resource/${comment.resourceId}`} className="font-semibold text-brand-blue hover:underline">{commentedResource?.title || 'a resource'}</Link> on {new Date(comment.timestamp).toLocaleDateString()}</p>
                            <blockquote className="mt-2 pl-4 border-l-4 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 italic">
                                "{comment.text}"
                            </blockquote>
                        </li>
                      );
                    })}
                </ul>
            ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center">You haven't made any comments yet.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
