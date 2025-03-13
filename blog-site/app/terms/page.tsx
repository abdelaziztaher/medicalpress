import { Metadata } from 'next';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Terms of Service | MedBlog',
  description: 'Terms and conditions for using the MedBlog platform',
};

// Remove the 'use client' directive and use a client component inside if needed
function TermsOfServicePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            Terms of Service
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Last updated: June 15, 2024
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              By accessing and using MedBlog, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">2. Description of Service</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              MedBlog provides an online platform for sharing medical information, research, and news. We do not provide medical advice or treatment recommendations, and our content should not be used as a substitute for professional medical care.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">3. Content Disclaimer</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The medical information on our website is provided as an information resource only, and is not to be used or relied on for any diagnostic or treatment purposes. This information should not be used as a substitute for professional diagnosis and treatment.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">4. User Accounts</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Some features of MedBlog may require registration. You agree to provide accurate information when registering and to keep your account information updated. You are responsible for maintaining the confidentiality of your account.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">5. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              All content published on MedBlog, including text, graphics, logos, and images, is the property of MedBlog or its content creators and protected by copyright and intellectual property laws.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">6. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              MedBlog and its owners, employees, and contributors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of our services.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">7. Changes to Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by posting the new Terms on the website. Your continued use of MedBlog after such changes constitutes your acceptance of the new terms.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">8. Governing Law</h2>
            <p className="text-gray-600 dark:text-gray-300">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which MedBlog operates, without regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfServicePage; 