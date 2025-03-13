'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            About MedBlog
          </h1>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              At MedBlog, our mission is to provide the latest reliable medical content on general medicine, medical specialties, 
              scientific research, and advanced medical technology. We believe in making complex medical concepts easy to understand for everyone, 
              and fostering a community of health enthusiasts and medical professionals alike.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              // English text about the blog's story
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We provide high-quality content in the following areas:
            </p>
            <ul className="list-disc pr-6 mt-2 mb-6 text-gray-600 dark:text-gray-300">
              <li>Latest medical news and trends</li>
              <li>Advanced medical treatments and techniques</li>
              <li>Specialized healthcare and medical specialties</li>
              <li>Scientific discoveries and breakthroughs in healthcare</li>
              <li>In-depth medical studies and research</li>
              <li>Analysis and insights for the healthcare sector</li>
            </ul>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Do you have questions or want to collaborate with us?
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-3 bg-teal-500 text-white font-medium rounded-full hover:bg-teal-600 transition-colors shadow-lg hover:shadow-teal-500/30"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 