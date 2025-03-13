import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the articles directory
const articlesDirectory = path.join(process.cwd(), '../articles');

// Get all articles from the index
function getAllArticles() {
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

// GET handler for the API route
export async function GET() {
  try {
    const articles = getAllArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
} 