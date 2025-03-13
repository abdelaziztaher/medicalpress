import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticleById } from '@/lib/articles';
import CodeBlock from '@/components/CodeBlock';
import ArticleSchema from '@/components/ArticleSchema';
import KeywordsCloud from '@/components/KeywordsCloud';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

// Helper function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate metadata for the article page
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleById(params.id);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }
  
  // Get a random title from alternative titles if available
  const alternativeTitles = article.metadata.alternativeTitles || [article.title];
  const selectedTitle = getRandomItem(alternativeTitles);
  
  // Extract first paragraph for description
  const firstParagraph = article.content.split('\n\n')[0];
  const description = firstParagraph.substring(0, 160) + '...';
  
  // Get keywords from metadata
  const keywords = article.metadata.keywords || '';
  
  // Base URL for canonical link
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://medpress.online';
  
  // Prepare image URL
  const imageUrl = article.imageUrl.startsWith('http') 
    ? article.imageUrl 
    : `${baseUrl}${article.imageUrl}`;
  
  return {
    title: selectedTitle,
    description,
    keywords,
    openGraph: {
      title: selectedTitle,
      description,
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
      modifiedTime: article.metadata.modifiedDate,
      authors: ['Medical Press'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: selectedTitle,
      description,
      images: [imageUrl]
    },
    alternates: {
      canonical: `${baseUrl}${article.metadata.canonical}`
    }
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleById(params.id);
  
  if (!article) {
    notFound();
  }
  
  // Base URL for schema
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://medpress.online';
  
  // Process content to handle code blocks
  const processContent = (content: string) => {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBeforeCode = content.slice(lastIndex, match.index);
        parts.push(renderParagraphs(textBeforeCode));
      }
      
      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push(<CodeBlock key={match.index} language={language} code={code} />);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(renderParagraphs(content.slice(lastIndex)));
    }
    
    return parts;
  };
  
  // Render regular paragraphs
  const renderParagraphs = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => {
      // Skip empty paragraphs
      if (!paragraph.trim()) return null;
      
      // Check if it's a heading
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>;
      } else if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>;
      } else if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-5 mb-2">{paragraph.substring(4)}</h3>;
      }
      
      // Regular paragraph
      return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
    });
  };
  
  // Process the article content
  const processedContent = processContent(article.content);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Add Schema.org structured data */}
          <ArticleSchema article={article} baseUrl={baseUrl} />
          
          {/* Featured Image */}
          <div className="relative h-96 w-full">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          
          {/* Article Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="mr-4">{article.date}</span>
              <span className="mr-4">•</span>
              <Link href={`/category/${article.category}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {article.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {article.title}
            </h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {processedContent}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
} 