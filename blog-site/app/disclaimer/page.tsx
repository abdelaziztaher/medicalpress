'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Medical Disclaimer
          </h1>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Last updated: June 15, 2024
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Medical Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The content provided on MedBlog is for educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified physician or healthcare provider regarding any questions you may have about a medical condition or health concerns.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">No Medical Advice</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Use of information on this website does not establish a doctor-patient relationship. Never disregard professional medical advice or delay seeking professional advice because of something you have read on this website. If you think you may have a medical emergency, call your doctor or local emergency number immediately.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Accuracy of Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We strive to ensure that the information provided is accurate and up-to-date, but the medical field is constantly evolving. We cannot guarantee the completeness or accuracy or currency of any information on our website. Information on our website may change rapidly, especially in new research and emerging treatments.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Use of Content</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The information and resources on our website are intended for the general public and not intended to be comprehensive. You may encounter unique situations that are not covered by our content, and some situations may require specialized medical attention.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">External Links</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              MedBlog may contain links to external websites. We do not control the content or accuracy of these external websites and we assume no responsibility for any information or services provided through them.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg mt-8 border-l-4 border-yellow-500">
              <h3 className="text-xl font-semibold mb-2 text-yellow-800 dark:text-yellow-300">Important Note</h3>
              <p className="text-yellow-700 dark:text-yellow-200">
                By using this site, you acknowledge that you have read and understood this disclaimer. MedBlog and its authors, editors, employees, or contributors assume no responsibility for any damages arising from the use of information contained within this website.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/">
              <button className="px-8 py-3 bg-teal-500 text-white font-medium rounded-full hover:bg-teal-600 transition-colors shadow-lg hover:shadow-teal-500/30">
                Return to Home Page
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 