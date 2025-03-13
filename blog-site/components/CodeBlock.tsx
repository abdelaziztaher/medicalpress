'use client';

import { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Load languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map common language shortcuts to Prism's supported languages
  const getLanguageClass = (lang: string): string => {
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      sh: 'bash',
      bash: 'bash',
      cs: 'csharp',
      yml: 'yaml',
    };
    
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  return (
    <div className="relative rounded-lg overflow-hidden my-6 code-block">
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 py-2 px-4 text-white">
        <span className="text-xs font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-gray-300 hover:text-white focus:outline-none transition-colors"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-xs">Copied!</span>
            </div>
          ) : (
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span className="text-xs">Copy</span>
            </div>
          )}
        </button>
      </div>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 overflow-x-auto text-sm m-0">
        <code
          ref={codeRef}
          className={`language-${getLanguageClass(language)}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock; 