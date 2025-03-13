import { NextResponse } from 'next/server';

/**
 * Generate a dynamic robots.txt file
 * This allows search engines to crawl the site and find the sitemap
 */
export async function GET() {
  // Base URL for the site
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://medpress.online';
  
  // Create robots.txt content
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/api/sitemap
`;
  
  // Return plain text response
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}

// Set revalidation period
export const revalidate = 86400; // Revalidate every day 