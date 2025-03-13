const { execSync } = require('child_process');
const path = require('path');

// Run the copy-images script first
console.log('Copying article images to public directory...');
try {
  execSync('node scripts/copy-images.js', { stdio: 'inherit' });
  console.log('Images copied successfully');
} catch (error) {
  console.error('Error copying images:', error);
  process.exit(1);
}

// Then start the Next.js development server
console.log('Starting Next.js development server...');
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting Next.js server:', error);
  process.exit(1);
} 