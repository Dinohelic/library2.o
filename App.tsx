import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { isFirebaseConfigValid } from './services/firebase';
import FirebaseConfigWarning from './components/FirebaseConfigWarning';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const ResourcePage = lazy(() => import('./pages/ResourcePage'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const AddStoryPage = lazy(() => import('./pages/AddStoryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditStoryPage = lazy(() => import('./pages/EditStoryPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

const PageLoader: React.FC = () => (
  <div className="flex justify-center items-center py-20">
    <LoadingSpinner />
  </div>
);

const MainContent: React.FC = () => {
  const location = useLocation();
  return (
    <main key={location.pathname} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/resource/:id" element={<ResourcePage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/add-story" element={<AddStoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-story/:id" element={<EditStoryPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>
  );
};

const App: React.FC = () => {
  if (!isFirebaseConfigValid) {
    return <FirebaseConfigWarning />;
  }
  
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
