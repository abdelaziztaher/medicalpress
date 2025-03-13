import fs from 'fs';
import path from 'path';

// Define the article types
export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  timestamp: number;
  date: string;
  time: string;
  url: string;
  entityKeywords?: string[];
  longTailKeywords?: string[];
  metadata: {
    canonical: string;
    modifiedDate: string;
    keywords: string;
    alternativeTitles?: string[];
    seoAnalysis?: {
      lsiKeywords: string[];
      mainEntities: string[];
      longTailKeywords: string[];
      suggestedTopics: string[];
    };
  };
}

export interface ArticleIndex {
  id: string;
  title: string;
  category: string;
  timestamp: number;
}

// Path to the articles directory
const articlesDirectory = path.join(process.cwd(), '../articles');

// Cache objects to reduce disk reads and improve performance
const articleCache: Record<string, Article> = {};
let articlesIndexCache: ArticleIndex[] | null = null;
let categoriesCache: string[] | null = null;

// Get all articles from the index
export function getAllArticles(): ArticleIndex[] {
  // Return cached value if available
  if (articlesIndexCache) {
    return articlesIndexCache;
  }

  try {
    const indexPath = path.join(articlesDirectory, 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const { articles } = JSON.parse(indexContent);
    
    // Update cache
    articlesIndexCache = articles;
    return articles;
  } catch (error) {
    console.error('Error reading articles index:', error);
    return [];
  }
}

// Get article by ID
export function getArticleById(id: string): Article | null {
  // Check cache first
  if (articleCache[id]) {
    return articleCache[id];
  }

  try {
    const articlePath = path.join(articlesDirectory, id, 'article.json');
    const articleContent = fs.readFileSync(articlePath, 'utf8');
    const article = JSON.parse(articleContent);
    
    // Fix the image URL to be relative to the public directory
    const imagePath = `/articles/${id}/image.jpg`;
    
    const completeArticle = {
      ...article,
      imageUrl: imagePath
    };
    
    // Update cache
    articleCache[id] = completeArticle;
    return completeArticle;
  } catch (error) {
    console.error(`Error reading article ${id}:`, error);
    return null;
  }
}

// Get articles by category
export function getArticlesByCategory(category: string): ArticleIndex[] {
  const allArticles = getAllArticles();
  
  // If category is tech-news, return all articles
  if (category === 'tech-news') {
    return allArticles;
  }
  
  // Otherwise filter by the specific category
  return allArticles.filter(article => article.category === category);
}

// Get recent articles
export function getRecentArticles(count: number = 6): ArticleIndex[] {
  const allArticles = getAllArticles();
  return allArticles.slice(0, count);
}

// Get article categories
export function getCategories(): string[] {
  // Return cached value if available
  if (categoriesCache) {
    return categoriesCache;
  }

  const allArticles = getAllArticles();
  const categories = new Set(allArticles.map(article => article.category));
  const categoryArray = Array.from(categories);
  
  // Update cache
  categoriesCache = categoryArray;
  return categoryArray;
}

// Copy article images to public directory
export function copyArticleImages(): void {
  try {
    const allArticles = getAllArticles();
    const publicDir = path.join(process.cwd(), 'public/articles');
    
    // Create the public/articles directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy each article's image
    allArticles.forEach(article => {
      const articleId = article.id;
      const sourceImagePath = path.join(articlesDirectory, articleId, 'image.jpg');
      const targetDir = path.join(publicDir, articleId);
      const targetImagePath = path.join(targetDir, 'image.jpg');
      
      // Create the article directory in public if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Copy the image if it exists
      if (fs.existsSync(sourceImagePath)) {
        fs.copyFileSync(sourceImagePath, targetImagePath);
        console.log(`Copied image for article ${articleId}`);
      } else {
        console.warn(`Image not found for article ${articleId}`);
      }
    });
    
    console.log('All article images copied to public directory');
  } catch (error) {
    console.error('Error copying article images:', error);
  }
} 