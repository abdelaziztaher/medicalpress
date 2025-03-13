'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArticleIndex } from '@/lib/articles';

interface ArticleCardProps {
  article: ArticleIndex;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date from timestamp
  const date = new Date(article.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general-medicine':
        return 'bg-teal-500';
      case 'specialized-care':
        return 'bg-blue-500';
      case 'medical-research':
        return 'bg-purple-500';
      case 'medical-technology':
        return 'bg-cyan-500';
      case 'public-health':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get category name
  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'general-medicine': 'General Medicine',
      'specialized-care': 'Specialized Care',
      'medical-research': 'Medical Research',
      'medical-technology': 'Medical Technology',
      'public-health': 'Public Health'
    };
    
    return categoryNames[category] || category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/articles/${article.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={`/articles/${article.id}/image.jpg`}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className={`absolute top-4 left-4 ${getCategoryColor(article.category)} text-white text-xs font-medium py-1 px-2 rounded-full`}>
            {getCategoryName(article.category)}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-teal-500 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="mr-4">{date}</span>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium text-teal-500 flex items-center">
              Read Article
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard; 