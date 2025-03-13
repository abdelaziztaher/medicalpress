'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategorySectionProps {
  categories: string[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  // Category icons and descriptions
  const categoryInfo = {
    'general-medicine': {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      ),
      description: 'Latest updates and news in general medicine',
      color: 'from-teal-500 to-teal-700',
    },
    'specialized-care': {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      description: 'Latest techniques and specialized treatments in medical care',
      color: 'from-blue-500 to-blue-700',
    },
    'medical-research': {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      description: 'New medical scientific research and discoveries',
      color: 'from-purple-500 to-purple-700',
    },
    'medical-technology': {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
          <polyline points="13 11 9 17 15 17 11 23"></polyline>
        </svg>
      ),
      description: 'Technological innovations changing the future of healthcare',
      color: 'from-cyan-500 to-cyan-700',
    },
    'public-health': {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      description: 'Public health initiatives and disease prevention',
      color: 'from-green-500 to-green-700',
    },
  };

  // Format category name
  const formatCategoryName = (category: string) => {
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
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Explore by Specialty
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/category/${category}`}>
                <div className={`rounded-xl overflow-hidden h-full bg-gradient-to-br ${categoryInfo[category as keyof typeof categoryInfo]?.color || 'from-gray-500 to-gray-700'} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="p-6 flex flex-col h-full">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      {categoryInfo[category as keyof typeof categoryInfo]?.icon || (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path>
                          <path d="M4 13a8 8 0 0 0 14.04 5.27"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                          <circle cx="8" cy="9" r="5"></circle>
                          <path d="M8 6v6"></path>
                          <path d="M5 9h6"></path>
                        </svg>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">
                      {formatCategoryName(category)}
                    </h3>
                    
                    <p className="text-white/80 mb-4 flex-grow">
                      {categoryInfo[category as keyof typeof categoryInfo]?.description || 'Explore articles in this specialty'}
                    </p>
                    
                    <div className="mt-auto">
                      <span className="inline-flex items-center text-sm font-medium">
                        Browse Articles
                        <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 