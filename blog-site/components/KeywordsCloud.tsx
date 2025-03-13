"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface KeywordsCloudProps {
  keywords: string[];
  title: string;
  type: 'lsi' | 'entity' | 'longTail';
  baseUrl?: string;
}

/**
 * Component to display a cloud of keywords with different sizes and colors
 * for better visual representation and SEO value
 */
const KeywordsCloud: React.FC<KeywordsCloudProps> = ({ 
  keywords, 
  title, 
  type,
  baseUrl = '' 
}) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  // Get a subset of keywords if there are too many
  const displayKeywords = keywords.slice(0, type === 'longTail' ? 8 : 12);
  
  // Different color schemes based on keyword type
  const getColorScheme = () => {
    switch (type) {
      case 'lsi':
        return 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600';
      case 'entity':
        return 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600';
      case 'longTail':
        return 'from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600';
      default:
        return 'from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800';
    }
  };

  // Function to determine font size based on keyword length and type
  const getFontSize = (keyword: string, index: number) => {
    const baseSize = type === 'longTail' ? 'text-sm' : 'text-base';
    
    // Vary sizes slightly for visual interest
    if (index % 5 === 0) return `${baseSize} md:text-lg`;
    if (index % 4 === 0) return `${baseSize} md:text-base`;
    if (index % 3 === 0) return `${baseSize} md:text-sm`;
    
    return baseSize;
  };

  // Generate search URL for the keyword
  const getKeywordUrl = (keyword: string) => {
    // For long-tail keywords, link to search results
    if (type === 'longTail') {
      return `/search?q=${encodeURIComponent(keyword)}`;
    }
    
    // For other types, link to category or tag pages
    return `/category/${encodeURIComponent(keyword.toLowerCase().replace(/\s+/g, '-'))}`;
  };

  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {displayKeywords.map((keyword, index) => {
          // Animation settings
          const animationProps = {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.1, duration: 0.5 }
          };
          
          return (
            <motion.div
              key={keyword}
              {...animationProps}
            >
              <Link 
                href={getKeywordUrl(keyword)}
                className={`inline-block px-3 py-1.5 rounded-full bg-gradient-to-r ${getColorScheme()} 
                  text-white font-medium ${getFontSize(keyword, index)} 
                  transition-all duration-300 hover:shadow-md`}
              >
                {keyword}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KeywordsCloud; 