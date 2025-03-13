import { NextResponse } from 'next/server';
import { getAllArticles, getArticleById } from '@/lib/articles';

/**
 * Generate a dynamic sitemap.xml for better SEO
 * This includes all articles, categories, and static pages
 */
export async function GET() {
  // Base URL for the site
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://medpress.online';
  
  // Get all articles
  const articles = getAllArticles();
  
  // Start XML content
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Home Page -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/disclaimer</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Category Pages -->
  <url>
    <loc>${baseUrl}/category/specialized-care</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/category/medical-research</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/category/medical-technology</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/category/public-health</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  
  // Add all articles
  for (const article of articles) {
    // Get full article data to access metadata
    const fullArticle = getArticleById(article.id);
    
    if (fullArticle) {
      const articleUrl = `${baseUrl}${fullArticle.url}`;
      const modifiedDate = fullArticle.metadata.modifiedDate || new Date().toISOString();
      
      xml += `
  
  <!-- Article: ${fullArticle.title} -->
  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${modifiedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    
    <!-- News-specific metadata -->
    <news:news>
      <news:publication>
        <news:name>Medical Press</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${fullArticle.date}</news:publication_date>
      <news:title>${fullArticle.title}</news:title>
      <news:keywords>${fullArticle.metadata.keywords}</news:keywords>
    </news:news>`;
      
      // Add image data if available
      if (fullArticle.imageUrl) {
        const imageUrl = fullArticle.imageUrl.startsWith('http') 
          ? fullArticle.imageUrl 
          : `${baseUrl}${fullArticle.imageUrl}`;
          
        xml += `
    
    <!-- Article image -->
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${fullArticle.title}</image:title>
      <image:caption>${fullArticle.title} - Medical Press</image:caption>
    </image:image>`;
      }
      
      xml += `
  </url>`;
    }
  }
  
  // Close XML
  xml += `
</urlset>`;
  
  // Return XML with proper content type
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}

// Set revalidation period to ensure sitemap is updated regularly
export const revalidate = 3600; // Revalidate every hour 