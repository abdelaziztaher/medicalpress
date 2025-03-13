'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Last updated: January 1, 2024
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">1. Introduction</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome to FutureBlog. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">2. The Data We Collect</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">3. How We Use Your Data</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">4. Data Security</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">5. Your Legal Rights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">6. Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
              <br />
              Email: privacy@futureblog.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 