const fs = require('fs');
const path = require('path');

// Path to the articles directory
const articlesDirectory = path.join(__dirname, '../../articles');
const publicDir = path.join(__dirname, '../public/articles');

// Function to ensure directory exists
function ensureDir(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created or exists: ${dirPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    return false;
  }
}

// Function to copy article images
function copyArticleImages() {
  try {
    // Read the index file
    const indexPath = path.join(articlesDirectory, 'index.json');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const { articles } = JSON.parse(indexContent);
    
    console.log(`Found ${articles.length} articles in index`);
    
    // Create the public/articles directory if it doesn't exist
    ensureDir(publicDir);
    
    // Copy each article's image
    articles.forEach(article => {
      const articleId = article.id;
      const sourceImagePath = path.join(articlesDirectory, articleId, 'image.jpg');
      const targetDir = path.join(publicDir, articleId);
      const targetImagePath = path.join(targetDir, 'image.jpg');
      
      // Create the article directory in public if it doesn't exist
      ensureDir(targetDir);
      
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

// Run the function
copyArticleImages(); 