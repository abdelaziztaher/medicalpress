import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define article types
interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  timestamp: number;
  date: string;
  time: string;
  url: string;
  metadata: {
    canonical: string;
    modifiedDate: string;
    keywords: string;
  };
}

// Path to the articles directory
const articlesDirectory = path.join(process.cwd(), '../articles');

// Get article by ID
function getArticleById(id: string): Article | null {
  try {
    const articlePath = path.join(articlesDirectory, id, 'article.json');
    const articleContent = fs.readFileSync(articlePath, 'utf8');
    const article = JSON.parse(articleContent);
    
    // Fix the image URL to be relative to the public directory
    const imagePath = `/articles/${id}/image.jpg`;
    
    return {
      ...article,
      imageUrl: imagePath
    };
  } catch (error) {
    console.error(`Error reading article ${id}:`, error);
    return null;
  }
}

// GET handler for the API route
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const article = getArticleById(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
} 