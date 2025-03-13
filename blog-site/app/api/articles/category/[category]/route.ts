import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define article type
interface ArticleIndex {
  id: string;
  title: string;
  category: string;
  timestamp: number;
}

// Path to the articles directory
const articlesDirectory = path.join(process.cwd(), '../articles');

// Get all articles from the index
function getAllArticles(): ArticleIndex[] {
  try {
    const indexPath = path.join(articlesDirectory, 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const { articles } = JSON.parse(indexContent);
    return articles;
  } catch (error) {
    console.error('Error reading articles index:', error);
    return [];
  }
}

// Get articles by category
function getArticlesByCategory(category: string): ArticleIndex[] {
  const allArticles = getAllArticles();
  
  // If category is general-medicine, return all articles
  if (category === 'general-medicine') {
    return allArticles;
  }
  
  // Otherwise filter by the specific category
  return allArticles.filter((article: ArticleIndex) => article.category === category);
}

// GET handler for the API route
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    const articles = getArticlesByCategory(category);
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles by category' },
      { status: 500 }
    );
  }
} 