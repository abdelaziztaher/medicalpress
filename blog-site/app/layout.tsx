import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

// Optimize font loading by displaying text immediately with fallback font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Add display:swap for faster text rendering
  preload: true    // Ensure font is preloaded
});

export async function generateMetadata() {
  // Reduced number of titles to 10 to improve performance
  const titles = [
    'MedicalPress: Cutting-Edge Medical News & Updates',
    'MedicalPress - Your Trusted Source for Health & Medicine',
    'MedicalPress: Breaking Medical Stories You Can Trust',
    'MedicalPress - Exploring the World of Modern Medicine',
    'MedicalPress: Uncovering the Latest Medical Innovations',
    'MedicalPress - In-Depth Analysis of Healthcare Trends',
    'MedicalPress: Where Medical Expertise Meets Innovation',
    'MedicalPress - Empowering Your Health Journey',
    'MedicalPress: The Pulse of Modern Medicine',
    'MedicalPress - Transforming Medical News for You'
  ];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  return {
    title: randomTitle,
    description: 'MedicalPress brings you the latest news, insights, and breakthrough innovations in the world of healthcare and medicine.',
    icons: { icon: '/medicalpress-logo.png' }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6P2NNWSK6R"></script>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6P2NNWSK6R');
            `
          }}
        />
        
        {/* Google Search Console Verification Meta Tag */}
        <meta name="google-site-verification" content="Ov2bT0-zvjm1WhafZkOKON1Yq8ykvOh3Rx10fffhWCk" />
        
        {/* PWA Support */}
        <meta name="application-name" content="MedicalPress" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MedicalPress" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0d9488" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/medicalpress-logo-192x192.png" />
        
        {/* Optimize external font loading with preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap"
        />
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-light dark:bg-gray-900">
            <Header />
            <main className="flex-grow text-gray-900 dark:text-gray-100">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 