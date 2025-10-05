

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RESOURCES } from '../constants';
import ResourceCard from '../components/ResourceCard';
import type { Resource } from '../types';
import { useAuth } from '../contexts/AuthContext';

const LibraryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { stories, likes } = useAuth();

  useEffect(() => {
    const authorQuery = searchParams.get('author');
    if (authorQuery) {
      setSearchQuery(authorQuery);
      setSelectedCategory('All');
      setSelectedTags([]);
    }
  }, [searchParams]);

  const allResources = useMemo(() => {
    const publishedStories = stories.filter(s => s.status === 'published');
    return [...RESOURCES, ...publishedStories];
  }, [stories]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(allResources.map(r => r.category)))], [allResources]);
  
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allResources.forEach(r => r.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allResources]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredResources = useMemo((): Resource[] => {
    return allResources.filter(resource => {
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const lowerCaseQuery = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery.trim() === '' ||
        resource.title.toLowerCase().includes(lowerCaseQuery) ||
        resource.shortDescription.toLowerCase().includes(lowerCaseQuery) ||
        (resource.authorName && resource.authorName.toLowerCase().includes(lowerCaseQuery)) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => resource.tags?.includes(tag));
      
      return matchesCategory && matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedCategory, selectedTags, allResources]);

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mb-8">
        <h1 className="text-3xl font-bold text-brand-blue mb-2">Resource Library</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">Search, filter, and explore our collection of articles and community stories.</p>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title, description, author, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue bg-slate-200 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
        </div>
         <div className="mt-4 flex flex-wrap gap-2">
            <p className="w-full text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Categories:</p>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-brand-blue text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {allTags.length > 0 && (
            <div className="mt-4 pt-4 border-t dark:border-slate-700 flex flex-wrap gap-2">
              <p className="w-full text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Filter by Tags:</p>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-brand-orange text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              likesCount={(likes[resource.id] || []).length}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Resources Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search query or filters.</p>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;