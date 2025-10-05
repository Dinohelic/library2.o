import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import type { User, Resource, Comment, Report, EmpathyRating } from '../types';
import { processFileContent } from '../services/geminiService';
import { auth } from '../services/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  stories: Resource[];
  comments: Comment[];
  likes: Record<string, string[]>;
  reports: Report[];
  bookmarks: string[];
  empathyRatings: Record<string, EmpathyRating[]>;
  login: (email:string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  signup: (email:string, pass: string) => Promise<any>;
  addStory: (storyData: Pick<Resource, 'title' | 'category' | 'shortDescription' | 'content' | 'summary' | 'tags' | 'fileName'>) => Promise<void>;
  updateStory: (storyId: string, updates: Partial<Omit<Resource, 'id'>>) => void;
  addComment: (resourceId: string, text: string) => void;
  toggleLike: (resourceId: string) => void;
  reportContent: (resourceId: string, resourceTitle: string) => void;
  updateUserProfile: (name: string, imageFile: File | null) => Promise<void>;
  toggleBookmark: (resourceId: string) => void;
  rateEmpathy: (resourceId: string, rating: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Resource[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Record<string, string[]>>({});
  const [reports, setReports] = useState<Report[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [empathyRatings, setEmpathyRatings] = useState<Record<string, EmpathyRating[]>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const storedProfile = localStorage.getItem(`profile_${user.uid}`);
        let name = user.displayName || user.email?.split('@')[0] || 'User';
        let imageUrl = `https://picsum.photos/seed/${user.uid}/200/200`;

        if (storedProfile) {
            try {
                const customProfile = JSON.parse(storedProfile);
                name = customProfile.name || name;
                imageUrl = customProfile.imageUrl || imageUrl;
            } catch (e) {
                console.error("Failed to parse stored profile", e);
            }
        }

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: name,
          imageUrl: imageUrl,
        });

        // Load user's bookmarks from localStorage
        const storedBookmarks = localStorage.getItem(`bookmarks_${user.uid}`);
        if (storedBookmarks) {
            try {
                setBookmarks(JSON.parse(storedBookmarks));
            } catch (e) {
                console.error("Failed to parse bookmarks from localStorage", e);
                setBookmarks([]);
            }
        } else {
            setBookmarks([]);
        }

      } else {
        setCurrentUser(null);
        setBookmarks([]); // Clear bookmarks when user logs out
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Load global community data from localStorage on startup
  useEffect(() => {
    try {
      const storedCommunityData = localStorage.getItem('community_data');
      if (storedCommunityData) {
        const { stories: storedStories, comments: storedComments, likes: storedLikes, reports: storedReports, empathyRatings: storedEmpathyRatings } = JSON.parse(storedCommunityData);
        setStories(storedStories || []);
        setComments(storedComments || []);
        setLikes(storedLikes || {});
        setReports(storedReports || []);
        setEmpathyRatings(storedEmpathyRatings || {});
      }
    } catch (e) {
      console.error("Failed to parse community data from localStorage", e);
    }
  }, []);

  // Persist global community data to localStorage whenever it changes
  useEffect(() => {
    try {
      const communityData = { stories, comments, likes, reports, empathyRatings };
      localStorage.setItem('community_data', JSON.stringify(communityData));
    } catch (error) {
      console.error("Could not save community data to localStorage:", error);
    }
  }, [stories, comments, likes, reports, empathyRatings]);

  
  // Persist user-specific bookmarks to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !loading) {
      try {
        localStorage.setItem(`bookmarks_${currentUser.uid}`, JSON.stringify(bookmarks));
      } catch (error) {
        console.error("Could not save bookmarks to localStorage:", error);
      }
    }
  }, [bookmarks, currentUser, loading]);


  const login = useCallback((email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(() => {
    if (currentUser) {
      // Clear localStorage for the user on logout.
      localStorage.removeItem(`bookmarks_${currentUser.uid}`);
    }
    setBookmarks([]); // Clear bookmarks from state immediately
    return signOut(auth);
  }, [currentUser]);
  
  const signup = useCallback((email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, [])

  const addStory = useCallback(async (storyData: Pick<Resource, 'title' | 'category' | 'shortDescription' | 'content' | 'summary' | 'tags' | 'fileName'>) => {
    const user = auth.currentUser;
    if (!user || !currentUser) throw new Error("User not authenticated");

    const newStory: Resource = {
      ...storyData,
      id: `story-${Date.now()}`,
      authorId: user.uid,
      authorName: currentUser.name || user.displayName || user.email?.split('@')[0] || 'User',
      status: 'pending_review',
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
    };

    setStories(prev => [...prev, newStory]);
  }, [currentUser]);
  
  const updateStory = useCallback((storyId: string, updates: Partial<Omit<Resource, 'id'>>) => {
    setStories(prevStories => prevStories.map(s => 
      s.id === storyId ? { ...s, ...updates } : s
    ));
  }, []);
  
  const addComment = useCallback((resourceId: string, text: string) => {
    if (!currentUser) {
      console.error("User must be logged in to comment.");
      return;
    }
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      resourceId,
      authorId: currentUser.uid,
      authorName: currentUser.name || 'Anonymous',
      authorImageUrl: currentUser.imageUrl,
      text,
      timestamp: Date.now(),
    };
    setComments(prev => [...prev, newComment]);
  }, [currentUser]);

  const toggleLike = useCallback((resourceId: string) => {
    if (!currentUser) {
      console.error("User must be logged in to like.");
      return;
    }
    setLikes(prev => {
      const currentLikes = prev[resourceId] || [];
      const userHasLiked = currentLikes.includes(currentUser.uid);
      
      const newLikes = userHasLiked
        ? currentLikes.filter(uid => uid !== currentUser.uid)
        : [...currentLikes, currentUser.uid];
      
      return {
        ...prev,
        [resourceId]: newLikes,
      };
    });
  }, [currentUser]);

  const toggleBookmark = useCallback((resourceId: string) => {
    if (!currentUser) {
        console.error("User must be logged in to bookmark.");
        return;
    }
    setBookmarks(prev => {
        const isBookmarked = prev.includes(resourceId);
        return isBookmarked
            ? prev.filter(id => id !== resourceId)
            : [...prev, resourceId];
    });
  }, [currentUser]);

  const reportContent = useCallback((resourceId: string, resourceTitle: string) => {
    if (!currentUser) {
      console.error("User must be logged in to report content.");
      return;
    }
    // Prevent duplicate reports by the same user for the same resource
    if (reports.some(r => r.resourceId === resourceId && r.reporterId === currentUser.uid)) {
      console.log("Content already reported by this user.");
      return;
    }

    const newReport: Report = {
      resourceId,
      reporterId: currentUser.uid,
      timestamp: Date.now(),
      resourceTitle,
    };
    setReports(prev => [...prev, newReport]);
  }, [currentUser, reports]);

  const rateEmpathy = useCallback((resourceId: string, rating: number) => {
    if (!currentUser) {
      console.error("User must be logged in to rate.");
      return;
    }
    if (rating < 1 || rating > 5) {
      console.error("Invalid rating value.");
      return;
    }

    setEmpathyRatings(prev => {
      const currentRatings = prev[resourceId] || [];
      const userRatingIndex = currentRatings.findIndex(r => r.userId === currentUser.uid);
      
      let newRatings;
      if (userRatingIndex > -1) {
        // User is changing their rating
        newRatings = [...currentRatings];
        newRatings[userRatingIndex] = { ...newRatings[userRatingIndex], rating };
      } else {
        // User is rating for the first time
        newRatings = [...currentRatings, { userId: currentUser.uid, rating }];
      }
      
      return { ...prev, [resourceId]: newRatings };
    });
  }, [currentUser]);

  const updateUserProfile = useCallback(async (name: string, imageFile: File | null) => {
    const user = auth.currentUser;
    if (!user || !currentUser) throw new Error("User not authenticated");

    let newImageUrl = currentUser.imageUrl;
    
    if (imageFile) {
        newImageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile!);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }
    
    // Update Firebase Auth displayName
    await updateProfile(user, { displayName: name });

    const updatedUser = {
        ...currentUser,
        name: name,
        imageUrl: newImageUrl,
    };

    setCurrentUser(updatedUser);
    localStorage.setItem(`profile_${user.uid}`, JSON.stringify({ name: name, imageUrl: newImageUrl }));
  }, [currentUser]);


  const value = useMemo(() => ({
    currentUser,
    loading,
    stories,
    comments,
    likes,
    reports,
    bookmarks,
    empathyRatings,
    login,
    logout,
    signup,
    addStory, 
    updateStory,
    addComment,
    toggleLike,
    reportContent,
    updateUserProfile,
    toggleBookmark,
    rateEmpathy,
  }), [
    currentUser, loading, stories, comments, likes, reports, bookmarks, empathyRatings,
    login, logout, signup, addStory, updateStory, addComment, toggleLike,
    reportContent, updateUserProfile, toggleBookmark, rateEmpathy
  ]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner/>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};