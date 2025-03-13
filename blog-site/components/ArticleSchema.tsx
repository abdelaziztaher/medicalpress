"use client";

import React from 'react';
import Script from 'next/script';

/**
 * Interface for Schema.org BlogPosting data
 */
interface SchemaData {
  '@context': string;
  '@type': string;
  headline: string;
  alternativeHeadline?: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
    url?: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    }
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  keywords?: string;
  articleSection?: string;
}

/**
 * Interface for the Article data required by the schema
 */
interface ArticleSchemaProps {
  article: {
    title: string;
    content: string;
    category: string;
    url: string;
    date: string;
    imageUrl: string;
    metadata: {
      canonical: string;
      modifiedDate: string;
      keywords: string;
      alternativeTitles?: string[];
    };
  };
  baseUrl: string;
}

/**
 * Component that adds structured data for an article using Schema.org BlogPosting schema
 */
const ArticleSchema: React.FC<ArticleSchemaProps> = ({ article, baseUrl }) => {
  // Generate a description from the first paragraph of content
  const description = article.content.split('\n\n')[0].substring(0, 200) + '...';
  
  // Format the absolute URL for the article
  const articleUrl = `${baseUrl}${article.url}`;
  
  // Format the absolute URL for the image
  const imageUrl = article.imageUrl.startsWith('http')
    ? article.imageUrl
    : `${baseUrl}${article.imageUrl}`;
  
  // Create the schema object
  const schema: SchemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: description,
    image: imageUrl,
    url: articleUrl,
    datePublished: new Date(article.date).toISOString(),
    dateModified: article.metadata.modifiedDate,
    author: {
      '@type': 'Organization',
      name: 'Medical Press',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'MedicalPress',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/medicalpress-logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    keywords: article.metadata.keywords,
    articleSection: article.category
  };
  
  // Add alternative headlines if available
  if (article.metadata.alternativeTitles && article.metadata.alternativeTitles.length > 0) {
    schema.alternativeHeadline = article.metadata.alternativeTitles.join(' | ');
  }
  
  return (
    <Script id="article-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
};

export default ArticleSchema; 