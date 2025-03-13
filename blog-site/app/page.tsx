import { getRecentArticles, getCategories } from '@/lib/articles';
import HeroSection from '@/components/HeroSection';
import ArticleCard from '@/components/ArticleCard';
import CategorySection from '@/components/CategorySection';
import NewsletterSection from '@/components/NewsletterSection';

export default function Home() {
  // Get recent articles and categories
  const recentArticles = getRecentArticles(6);
  const categories = getCategories();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Recent Articles */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection categories={categories} />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
} 