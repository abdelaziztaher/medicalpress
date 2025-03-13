'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Removiendo la importación directa
// import { getArticlesByCategory } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import { ArticleIndex } from '@/lib/articles';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const [articles, setArticles] = useState<ArticleIndex[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Obtener artículos desde la API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/category/${category}`);
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [category]);
  
  // Format category name
  const categoryName = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Get category description
  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'tech-news':
        return 'Latest news and updates from the tech world';
      case 'programming':
        return 'Insights and best practices for developers';
      case 'ai':
        return 'Artificial intelligence breakthroughs and applications';
      case 'inventions':
        return 'Revolutionary inventions changing our world';
      default:
        return 'Explore articles in this category';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-primary hover:text-blue-700 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </Link>
        
        {/* Category header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {getCategoryDescription(category)}
          </p>
        </div>
        
        {/* Loading indicator */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : 
        /* Articles grid */
        articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 