// Fixed Article Generator Script (Medical Edition)
// This script pre-generates articles and images about medical topics 
// and saves them to the articles directory with proper JSON formatting.

require('dotenv').config();
const fsPromises = require('fs').promises;
const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Initialize API Keys
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not found in environment variables');
    process.exit(1);
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configure the model
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

// Update generation config
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
};

/**
 * Helper function to download an image using curl
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} destinationPath - Local path to save the image
 */
async function downloadImage(imageUrl, destinationPath) {
    // حذف الملف إذا كان موجوداً
    try {
        await fsPromises.unlink(destinationPath);
        console.log(`Deleted existing file: ${destinationPath}`);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error("Error deleting file:", err);
        }
    }

    try {
        // ننفّذ أمر curl بشكل متزامن (sync). 
        // -L تتبع التحويلات (redirects)، 
        // -o لتحديد اسم الملف الناتج
        // تستطيع إضافة -k لو اضطررت لتجاوز مشاكل SSL
        execFileSync('curl', [
            '-L',
            '-o', destinationPath,
            imageUrl
        ], { stdio: 'inherit' });

        console.log(`Image downloaded successfully via curl to: ${destinationPath}`);
        return destinationPath;
    } catch (error) {
        throw new Error(`Error downloading file via curl: ${error.message}`);
    }
}

/**
 * Function to get previously generated articles.
 * It reads up to `maxCount` recent articles from the "articles" folder
 * and returns them as an array of article objects.
 *
 * @param {number} maxCount - Maximum number of previous articles to fetch
 * @returns {Array} Array of previously generated articles
 */
async function getPreviousArticles(maxCount = 1000) {
    try {
        const articlesDir = path.join(__dirname, 'articles');
        
        // Check if articles directory exists
        try {
            await fsPromises.access(articlesDir, fs.constants.F_OK);
        } catch (error) {
            console.log('Articles directory does not exist yet');
            return [];
        }
        
        // Get all article directories
        const files = await fsPromises.readdir(articlesDir);
        const articleDirs = files.filter(file => {
            return file !== 'index.json' && file !== 'index.html' && file !== 'README.md';
        });
        
        // Sort by name (timestamp) so newest are first
        articleDirs.sort((a, b) => parseInt(b) - parseInt(a));
        
        // Limit to maxCount
        const limitedDirs = articleDirs.slice(0, maxCount);
        
        // Read each article
        const articles = [];
        for (const dir of limitedDirs) {
            try {
                const articlePath = path.join(articlesDir, dir, 'article.json');
                const fileContent = await fsPromises.readFile(articlePath, 'utf8');
                const articleData = JSON.parse(fileContent);
                articles.push(articleData);
            } catch (error) {
                console.error(`Error reading article ${dir}:`, error);
            }
        }
        
        console.log(`Retrieved ${articles.length} previous articles`);
        return articles;
    } catch (error) {
        console.error('Error getting previous articles:', error);
        return [];
    }
}

/**
 * Function to retrieve the latest medical headlines from the Gemini API,
 * properly tagged with 4 possible categories:
 * [Specialized Care], [Medical Research], [Medical Technology], [Public Health].
 *
 * @param {number} count - Number of headlines to fetch
 * @param {string|null} category - If provided, attempt to filter by this category
 * @returns {Array} List of topics with {category, topic}
 */
async function getLatestNewsTopics(count = 5, category = null) {
    try {
        // Get previous articles for context
        const previousArticles = await getPreviousArticles(1000);

        // Extract titles and content for context
        let previousContext = '';
        
        if (previousArticles.length > 0) {
            // Create a more comprehensive context from previous articles
            previousContext = "Previously covered articles:\n";
            
            // Add titles and first sentence of content for context
            previousArticles.forEach((article, index) => {
                let firstSentence = article.content.split('.')[0];
                if (firstSentence.length > 100) {
                    firstSentence = firstSentence.substring(0, 100) + '...';
                }
                
                previousContext += `${index + 1}. Title: ${article.title}\n`;
                previousContext += `   Category: ${article.category}\n`;
                previousContext += `   Summary: ${firstSentence}\n\n`;
            });
            
            // Limit context size to prevent token limit issues
            if (previousContext.length > 1000) {
                previousContext = previousContext.substring(0, 1000) + '...\n';
            }
        }
        
        const prompt = {
            contents: [{
                role: "user",
                parts: [{
                    text: `Give me ${count} lines, each containing a headline for the latest medical news or a specific piece of medical information.

Important formatting instructions:
1. At the end of each headline, add brackets containing ONE of these four categories: [Specialized Care], [Medical Research], [Medical Technology], or [Public Health].
2. Choose the most appropriate category for each headline.
3. If a headline could fit multiple categories, choose the most relevant one.
4. EVERY headline MUST end with one of these exact category tags: [Specialized Care], [Medical Research], [Medical Technology], or [Public Health].
5. Don't say "here" or anything like that. Give me the headlines immediately, one per line.

Example of correct format:
- New Minimally Invasive Heart Surgery Technique Shows Promise [Specialized Care]
- Innovative AI Tool Speeds Up Genome Sequencing [Medical Research]
- Wearable Sensors Revolutionize Remote Patient Monitoring [Medical Technology]
- Global Health Initiative Reduces Malaria Cases by 30% [Public Health]

${previousContext}`
                }]
            }]
        };

        // Call Gemini directly with fetch (to mimic the original script approach)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prompt)
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const result = await response.json();
        const headlinesText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Split text by newlines to get individual headlines
        const headlines = headlinesText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            // Remove leading numbers followed by a period and space (like "9. " or "10. ")
            .map(headline => headline.replace(/^\d+\.\s+/, ''))
            // Remove leading bullet points if any
            .map(headline => headline.replace(/^[-•*]\s+/, ''));

        // Process each headline to extract the category and clean the title
        const topics = headlines.map(headline => {
            // Look for category in brackets at the end of the headline
            const categoryMatch = headline.match(/\[(Specialized Care|Medical Research|Medical Technology|Public Health)\]$/i);

            // Default category if no match is found
            let cat = "public-health"; 
            let cleanTitle = headline;
            
            if (categoryMatch) {
                // Convert bracketed match to a consistent lower-case identifier
                const foundCat = categoryMatch[1];
                // We'll map them to a simpler ID if needed
                switch (foundCat.toLowerCase()) {
                    case 'specialized care':
                        cat = 'specialized-care';
                        break;
                    case 'medical research':
                        cat = 'medical-research';
                        break;
                    case 'medical technology':
                        cat = 'medical-technology';
                        break;
                    case 'public health':
                        cat = 'public-health';
                        break;
                }
                // Remove the bracketed category from the title
                cleanTitle = headline.replace(/\s*\[(Specialized Care|Medical Research|Medical Technology|Public Health)\]$/i, '').trim();
            }

            return {
                category: cat,
                topic: cleanTitle
            };
        });
        
        console.log(`Retrieved ${topics.length} latest medical news topics with specific categories`);
        return topics;
    } catch (error) {
        console.error('Error getting latest news topics:', error);
        
        // Fallback to default topics if API call fails
        return [
            { 
                category: 'specialized-care', 
                topic: 'Breakthroughs in minimally invasive surgery' 
            },
            {
                category: 'medical-research',
                topic: 'Recent advancements in genetic medicine'
            },
            {
                category: 'medical-technology',
                topic: 'New wearable devices for patient monitoring'
            },
            {
                category: 'public-health',
                topic: 'Global vaccination campaigns and their impact'
            }
        ];
    }
}

/**
 * Get a random medical topic from the AI-based latest news topics.
 * If a `category` is specified, attempt to filter by that category.
 *
 * @param {string|null} category - If provided, only select from that category
 * @returns {Object} {category, topic}
 */
async function getRandomTopic(category = null) {
    try {
        // Validate category if provided
        const validCategories = ['specialized-care', 'medical-research', 'medical-technology', 'public-health'];
        if (category && !validCategories.includes(category.toLowerCase())) {
            console.log(`Invalid category: ${category}, using random category instead`);
            category = null;
        }
        
        // Get more topics than we need to ensure variety
        const allTopics = await getLatestNewsTopics(15);

        let filteredTopics = allTopics;

        // If specific category is requested, filter
        if (category) {
            filteredTopics = allTopics.filter(t => t.category.toLowerCase() === category.toLowerCase());
            if (filteredTopics.length === 0) {
                console.log(`No topics found for category: ${category}, using all available topics`);
                filteredTopics = allTopics;
            }
        }

        // Select random from filtered
        const randomIndex = Math.floor(Math.random() * filteredTopics.length);
        return filteredTopics[randomIndex];

    } catch (error) {
        console.error('Error getting random topic:', error);
        // Fallback
        const fallbackTopics = [
            { 
                category: 'specialized-care', 
                topic: 'New approaches to heart surgery' 
            },
            {
                category: 'medical-research',
                topic: 'Recent clinical trials in oncology'
            },
            {
                category: 'medical-technology',
                topic: 'Innovative medical imaging devices'
            },
            {
                category: 'public-health',
                topic: 'Strategies for improving global vaccine access'
            }
        ];
        if (category) {
            const match = fallbackTopics.find(t => t.category.toLowerCase() === category.toLowerCase());
            return match || fallbackTopics[0];
        } else {
            return fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
        }
    }
}

// A small delay helper and a request queue to avoid hitting rate limits quickly
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let requestQueue = Promise.resolve();

/**
 * Generates the main article text from the topic using Gemini.
 * 
 * @param {string} topic - The medical headline/topic
 * @returns {string} Generated article content
 */
async function generateArticle(topic) {
    try {
        // Wait for previous request to complete
        await requestQueue;
        
        const prompt = {
            contents: [{
                role: "user",
                parts: [{
                    text: `You are an expert medical writer crafting an engaging blog post. Topic: "${topic}"

Instructions:
1. Format: No markdown, pure text
2. Structure:
   - Start with an attention-grabbing title (no special characters)
   - Write a compelling introduction (2-3 sentences)
   - Create 3-4 main sections with clear subheadings
   - End with a strong conclusion

Requirements:
- Length: Approximately 800 words
- Style: Professional but accessible to general public
- Focus: Recent medical developments, practical implications, and patient benefits
- Tone: Informative, evidence-based, and engaging
- Include: Real-world examples and medical research findings
- Avoid: Excessive jargon without explanation, overly technical language

Remember to make the content engaging for both healthcare professionals and non-medical readers.`
                }]
            }]
        };

        // Space out requests by 2s to avoid rate limits
        requestQueue = requestQueue.then(() => delay(2000));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prompt)
            }
        );

        if (!response.ok) {
            // If rate limited, wait and retry
            if (response.status === 429) {
                await delay(5000);
                return generateArticle(topic);
            }
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const result = await response.json();
        return result?.candidates?.[0]?.content?.parts?.[0]?.text 
            || 'Error generating content. Please try again later.';
    } catch (error) {
        console.error('Error generating article:', error);
        return 'Error generating content. Please try again later.';
    }
}

/**
 * Generate an accompanying image using DeepAI text2img via Selenium.
 * @param {Object} article - The article object containing the content
 * @param {number} retryCount - Number of retry attempts so far
 * @returns {string|Object} - Returns the article object with `imageUrl` set 
 *                            OR just a URL (if fallback/placeholder).
 */
async function generateImage(article, retryCount = 0) {
    const maxRetries = 2; 
    if (retryCount >= maxRetries) {
        console.log(`Failed to generate image after ${maxRetries} attempts, using fallback sources`);
        return 'https://via.placeholder.com/800x450?text=Image+Not+Available';
    }

    // Set overall timeout for image generation (5 minutes)
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            resolve('https://www.google.com/imgres?q=error%20image&imgurl=https%3A%2F%2Fuxwing.com%2Fwp-content%2Fthemes%2Fuxwing%2Fdownload%2Fvideo-photography-multimedia%2Ferror-image-photo-icon.svg&imgrefurl=https%3A%2F%2Fuxwing.com%2Ferror-image-photo-icon%2F&docid=hdl904cDTsMwyM&tbnid=MyXuCpTZs1n7rM&vet=12ahUKEwjK8KmCvoOMAxWK3gIHHRwBFzEQM3oECEoQAA..i&w=800&h=722&hcb=2&ved=2ahUKEwjK8KmCvoOMAxWK3gIHHRwBFzEQM3oECEoQAA');
        }, 300000);
    });

    let driver;
    let imgSrc = null;

    try {
        console.log('Starting image generation with DeepAI...');

        // Selenium Chrome options
        const options = new chrome.Options();
        options.addArguments('--ignore-certificate-errors');
        options.addArguments('--ignore-ssl-errors');
        options.addArguments('--disable-web-security');
        options.addArguments('--disable-features=IsolateOrigins');
        options.addArguments('--disable-site-isolation-trials');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--headless'); 
        options.addArguments('--disable-gpu');

        // Create driver with timeouts
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Wrap image generation in a race with the timeout
        const imageGenPromise = (async () => {
            await driver.manage().setTimeouts({
                implicit: 10000,
                pageLoad: 120000,
                script: 60000
            });
            await driver.manage().window().setRect({ width: 1280, height: 800 });

            // Navigate to DeepAI
            console.log('Navigating to DeepAI...');
            await driver.get('https://deepai.org/machine-learning-model/text2img');
            await driver.wait(until.elementLocated(By.css('body')), 10000);
            await delay(2000);

            // Skip login attempt
            console.log('Skipping login attempt to avoid session issues');

            // Enter the prompt into the textarea
            console.log('Entering image prompt...');
            const textarea = await driver.wait(
                until.elementLocated(By.xpath('/html/body/main/div[2]/div/div/div[1]/span/textarea')),
                10000
            );
            await textarea.click();

            // Generate a short prompt from Gemini
            const genaiPrompt = {
                contents: [{
                    role: "user",
                    parts: [{
                        text: `Create a brief, descriptive prompt for an AI image generator that would create a representative medical image for this article. Focus on healthcare, medical equipment, or clinical settings that would complement this medical topic. Keep it under 15 words, appropriate for healthcare content. Don't use quotes. 
                        
Here's the medical article content: ${article.content.substring(0, 500)}`
                    }]
                }]
            };

            const genaiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(genaiPrompt)
                }
            );

            let imagePrompt = `create image for ${article.content.substring(0, 100)}`;
            if (genaiResponse.ok) {
                const result = await genaiResponse.json();
                if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    imagePrompt = result.candidates[0].content.parts[0].text.trim();
                    console.log(`Using Gemini-generated prompt: ${imagePrompt}`);
                }
            }

            await textarea.sendKeys(imagePrompt);

            // Try clicking the generate button(s)
            console.log('Clicking generate button...');
            try {
                const generateButton = await driver.findElement(
                    By.xpath('/html/body/main/div[2]/div/div/div[1]/div[3]/div[3]/button[2]')
                );
                await driver.executeScript("arguments[0].scrollIntoView(true);", generateButton);
                await delay(1000);
                await driver.executeScript("arguments[0].click();", generateButton);

                // Possibly there's a second generate button
                await delay(3000);
                try {
                    const secondGenerateButton = await driver.findElement(
                        By.xpath('/html/body/main/div[2]/div/div/div[1]/span/div[2]/button')
                    );
                    if (await secondGenerateButton.isDisplayed()) {
                        console.log('Clicking second generate button...');
                        await driver.executeScript("arguments[0].scrollIntoView(true);", secondGenerateButton);
                        await delay(500);
                        await driver.executeScript("arguments[0].click();", secondGenerateButton);
                    }
                } catch {
                    console.log('Second generate button not found or not needed.');
                }
            } catch (error) {
                console.log('Error clicking main generate button, trying fallback buttons...');
                // Try fallback
                try {
                    const fallbackButton = await driver.findElement(
                        By.xpath('/html/body/main/div[2]/div/div/div[1]/span/div[2]/button')
                    );
                    console.log('Found fallback generate button...');
                    await driver.executeScript("arguments[0].scrollIntoView(true);", fallbackButton);
                    await delay(500);
                    await driver.executeScript("arguments[0].click();", fallbackButton);
                } catch (error2) {
                    console.log('No fallback generate button found either:', error2.message);
                }
            }

            // Wait for the image to appear
            console.log('Waiting for image generation...');
            await delay(10000);

            // Attempt to find a valid image src
            const maxWait = 120000; // 2 minutes
            const checkInterval = 5000;
            let totalWait = 10000;

            while (totalWait < maxWait && !imgSrc) {
                try {
                    const images = await driver.findElements(By.xpath('/html/body/main/div[2]/div/div/div[2]/div[2]/img'));
                    if (images.length > 0) {
                        const src = await images[0].getAttribute('src');
                        if (src && src.startsWith('https://') && !src.endsWith('.svg') && !src.includes('loading')) {
                            console.log('Image found successfully');
                            imgSrc = src;
                            break;
                        }
                    }
                    
                    // Backup approach via CSS selectors
                    if (!imgSrc) {
                        const backupImages = await driver.findElements(By.css('img.output-image, div.output-image img, div[role="img"] img'));
                        for (const img of backupImages) {
                            if (await img.isDisplayed()) {
                                const src = await img.getAttribute('src');
                                if (src && src.startsWith('https://') && !src.endsWith('.svg') && !src.includes('loading')) {
                                    console.log('Image found using backup selector');
                                    imgSrc = src;
                                    break;
                                }
                            }
                        }
                    }

                    if (imgSrc) break;

                    await delay(checkInterval);
                    totalWait += checkInterval;
                    console.log(`Waited ${totalWait / 1000} seconds for image generation...`);

                } catch (err) {
                    console.log(`Error checking for image: ${err.message}`);
                    await delay(checkInterval);
                    totalWait += checkInterval;
                }
            }

            // If still not found, check a possible download button existence
            if (!imgSrc) {
                try {
                    const downloadButton = await driver.findElements(By.xpath('/html/body/main/div[2]/div/div/div[1]/span/div[2]/button'));
                    if (downloadButton.length > 0 && await downloadButton[0].isDisplayed()) {
                        console.log('Found download button, image might be ready');
                        
                        const images = await driver.findElements(By.xpath('//img[contains(@src, "api.deepai.org") or contains(@src, "images.deepai.org")]'));
                        for (const img of images) {
                            const src = await img.getAttribute('src');
                            if (src && src.startsWith('https://') && !src.endsWith('.svg') && !src.includes('loading')) {
                                console.log('Found image URL from img element');
                                imgSrc = src;
                                break;
                            }
                        }

                        // Check alt attribute if needed
                        if (!imgSrc) {
                            const imagesWithAlt = await driver.findElements(By.css('img[alt*="deepai.org"]'));
                            for (const img of imagesWithAlt) {
                                const alt = await img.getAttribute('alt');
                                if (alt && alt.startsWith('https://') && !alt.endsWith('.svg') && !alt.includes('loading')) {
                                    console.log('Found image URL from alt attribute');
                                    imgSrc = alt;
                                    break;
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.log(`Error checking download button: ${err.message}`);
                }
            }

            // Last resort check
            if (!imgSrc) {
                try {
                    const allImages = await driver.findElements(By.css('img'));
                    for (const img of allImages) {
                        if (await img.isDisplayed()) {
                            const src = await img.getAttribute('src');
                            if (src && src.startsWith('https://') && !src.endsWith('.svg') && !src.includes('loading')) {
                                console.log('Found image URL in last resort check');
                                imgSrc = src;
                                break;
                            }
                            // Check alt attribute
                            const alt = await img.getAttribute('alt');
                            if (alt && alt.startsWith('https://') && !alt.endsWith('.svg') && !alt.includes('loading')) {
                                console.log('Found image URL in alt attribute during last resort check');
                                imgSrc = alt;
                                break;
                            }
                        }
                    }
                } catch (err) {
                    console.log(`Error in last resort image check: ${err.message}`);
                }
            }

            // If the found image is still loading or an SVG, wait more
            if (imgSrc && (imgSrc.endsWith('.svg') || imgSrc.includes('loading'))) {
                console.log('Found a loading image, waiting for final image...');
                await delay(15000);

                try {
                    const finalImages = await driver.findElements(By.css('img[src*="deepai.org"]:not([src$=".svg"])'));
                    for (const img of finalImages) {
                        if (await img.isDisplayed()) {
                            const src = await img.getAttribute('src');
                            if (src && src.startsWith('https://') && !src.endsWith('.svg') && !src.includes('loading')) {
                                console.log(`Found final image URL: ${src.substring(0, 100)}...`);
                                return src;
                            }
                        }
                    }

                    // Check alt attributes again
                    const imagesWithAlt = await driver.findElements(By.css('img[alt*="deepai.org"]'));
                    for (const img of imagesWithAlt) {
                        const alt = await img.getAttribute('alt');
                        if (alt && alt.startsWith('https://') && !alt.endsWith('.svg') && !alt.includes('loading')) {
                            console.log(`Found final image URL in alt attribute: ${alt.substring(0, 100)}...`);
                            return alt;
                        }
                    }
                } catch (err) {
                    console.log(`Error finding final image: ${err.message}`);
                }
            }

            // If valid image found
            if (imgSrc && !imgSrc.endsWith('.svg') && !imgSrc.includes('loading')) {
                console.log(`Valid image URL found: ${imgSrc.substring(0, 100)}...`);

                // Ensure article has an id
                if (!article.id) {
                    article.id = Date.now();
                }

                // Prepare directories
                const articlesDir = path.join(__dirname, 'articles');
                const articleDir = path.join(articlesDir, article.id.toString());
                await fsPromises.mkdir(articleDir, { recursive: true });

                // Determine extension
                const imageExt = path.extname(imgSrc) || '.jpg';
                const localImagePath = path.join(articleDir, 'image' + imageExt);

                // Download locally
                await downloadImage(imgSrc, localImagePath);

                // Update article with local path
                article.imageUrl = localImagePath;
                return article;
            }

            // If we found a partial URL or an issue, fallback
            if (imgSrc) {
                console.log(`Using fallback due to incomplete final image. Attempted URL: ${imgSrc}`);
                return imgSrc.replace('loading.svg', 'thumb.jpg').replace('-loading', '');
            }

            // If we couldn't find anything
            console.log('No image URL found, using placeholder');
            return 'https://via.placeholder.com/800x450?text=Image+Not+Available';
        })();

        // Race
        const result = await Promise.race([imageGenPromise, timeoutPromise]);
        return result;

    } catch (error) {
        console.error('Error generating image, attempt', retryCount + 1, 'failed:', error);
        // If final attempt
        if (retryCount >= maxRetries - 1) {
            console.log('Returning placeholder image after all retries failed');
            return 'https://via.placeholder.com/800x450?text=Image+Not+Available';
        }
        // Retry
        await delay(5000);
        return generateImage(article, retryCount + 1);

    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        if (driver) {
            try {
                await driver.quit();
            } catch (err) {
                console.log('Error quitting driver:', err.message);
            }
        }
    }
}

/**
 * Ensures the given directory path exists (creates it if it does not).
 * @param {string} dirPath - The directory path to check/create.
 */
async function ensureDir(dirPath) {
    try {
        await fsPromises.mkdir(dirPath, { recursive: true });
        console.log(`Directory created or exists: ${dirPath}`);
        return true;
    } catch (error) {
        console.error(`Error creating directory ${dirPath}:`, error);
        return false;
    }
}

/**
 * Writes data as a JSON file with pretty formatting.
 * @param {string} filePath - Path to the file
 * @param {Object} data - The data to write
 * @returns {boolean} true if successful, else false
 */
async function writeJsonFile(filePath, data) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fsPromises.writeFile(filePath, jsonString);
        console.log(`Successfully wrote file: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        return false;
    }
}

/**
 * Function to generate alternative titles for an article to improve SEO
 * These will be used by search engines to find the article with different title formats
 * @param {string} originalTitle - The original title of the article
 * @param {string} content - The full content of the article
 * @returns {Promise<string[]>} Array of alternative titles
 */
async function generateAlternativeTitles(originalTitle, content) {
    try {
        // Create a summary of the content to help with title generation
        const contentSummary = content.substring(0, 1500); // Use first 1500 chars for context

        // Craft a prompt that asks for medical-specific alternative titles
        const prompt = `As a medical SEO expert, generate 20 alternative titles for the following medical article. 
        Each title should be between 50-60 characters (ideal for SEO), be compelling, and contain relevant medical keywords.
        Vary the formats to include question titles, how-to titles, listicle titles, and benefit-driven titles.
        Focus on medical terminology and health benefits when relevant.
        
        Original Title: "${originalTitle}"
        
        Content summary: 
        ${contentSummary}
        
        Return ONLY a valid JSON array of strings containing the 20 alternative titles. No explanation or other text.
        Format: ["Title 1", "Title 2", "Title 3", ...]`;

        // Generate alternative titles using Gemini
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });

        let titlesText = result.response.text();
        
        // Clean up response to ensure it's valid JSON
        titlesText = titlesText
            .replace(/```json\s*/g, '') // Remove opening JSON code fence
            .replace(/```\s*$/g, '')    // Remove closing code fence
            .replace(/^```(.+)$/gm, '') // Remove any other markdown code fences
            .trim();
        
        // Parse the JSON response
        const titles = JSON.parse(titlesText);
        
        // Ensure we have an array of strings
        if (Array.isArray(titles) && titles.length > 0) {
            console.log(`✅ Generated ${titles.length} alternative titles for SEO`);
            return titles;
        } else {
            throw new Error("Response was not a valid array of titles");
        }
    } catch (error) {
        console.error("Error generating alternative titles:", error);
        // Return a basic fallback with a few variations if the main method fails
        return [
            originalTitle,
            `Medical Guide: ${originalTitle}`,
            `Health Spotlight: ${originalTitle}`,
            `Medical Research: ${originalTitle}`,
            `Patient's Guide to ${originalTitle}`
        ];
    }
}

/**
 * Function to generate keyword analysis for better SEO
 * @param {string} title - The title of the article
 * @param {string} content - The full content of the article
 * @returns {Promise<Object>} Object containing LSI keywords, entities, and long-tail keywords
 */
async function generateKeywordsAnalysis(title, content) {
    try {
        // Create a summary of the content for analysis
        const contentSummary = content.substring(0, 2500); // Use first 2500 chars for analysis

        // Craft a prompt for medical-specific keyword analysis
        const prompt = `As a medical SEO specialist, analyze this medical article and extract the following:

        1. LSI Keywords: 15-20 semantically related medical terms and phrases that search engines would associate with this topic (exclude the main keywords already in the title).
        
        2. Main Entities: Identify 5 key medical conditions, treatments, body systems, or healthcare concepts that are central to this article.
        
        3. Long-tail Keywords: Generate 10 specific, longer search phrases (4+ words) that patients might use when searching for information on this topic.
        
        4. Suggested Topics: List 5 related medical topics that could be linked to from this article for better SEO interlinking.

        Title: "${title}"
        
        Content excerpt: 
        ${contentSummary}
        
        Return ONLY a valid JSON object with these four arrays. No explanation or other text.
        Format: 
        {
            "lsiKeywords": ["keyword1", "keyword2", ...],
            "mainEntities": ["entity1", "entity2", ...],
            "longTailKeywords": ["phrase1", "phrase2", ...],
            "suggestedTopics": ["topic1", "topic2", ...]
        }`;

        // Generate keyword analysis using Gemini
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });

        let analysisText = result.response.text();
        
        // Clean up response to ensure it's valid JSON
        analysisText = analysisText
            .replace(/```json\s*/g, '') // Remove opening JSON code fence
            .replace(/```\s*$/g, '')    // Remove closing code fence
            .replace(/^```(.+)$/gm, '') // Remove any other markdown code fences
            .trim();
        
        // Parse the JSON response
        const analysis = JSON.parse(analysisText);
        
        // Validate the response structure
        if (analysis && analysis.lsiKeywords && analysis.mainEntities && 
            analysis.longTailKeywords && analysis.suggestedTopics) {
            console.log("✅ Generated SEO keyword analysis");
            return analysis;
        } else {
            throw new Error("Response was missing required keyword analysis fields");
        }
    } catch (error) {
        console.error("Error generating keyword analysis:", error);
        // Return a basic fallback if the main method fails
        return {
            lsiKeywords: ["medical", "health", "treatment", "symptoms", "diagnosis"],
            mainEntities: ["patient care", "treatment", "medical condition", "healthcare", "medicine"],
            longTailKeywords: ["how to treat this medical condition", "symptoms of this health issue", "when to see a doctor about this"],
            suggestedTopics: ["Related treatments", "Prevention measures", "Latest research", "Patient experiences", "Medical guidelines"]
        };
    }
}

/**
 * Generates a single article on a random medical topic (or optional forced category),
 * including the image. Saves it to ./articles/<timestamp>/article.json
 *
 * @param {string|null} category - If provided, attempts to generate an article in this category
 * @returns {Object} { success: boolean, articleData?: Object, error?: Error, imageError?: boolean }
 */
async function generateSingleArticle(category = null) {
    try {
        // Choose a random topic (possibly filtered by category)
        const topicData = await getRandomTopic(category);
        const { category: articleCategory, topic } = topicData;

        console.log(`\nGenerating article for topic: ${topic} (${articleCategory})`);

        // Generate the main article text
        const articleContent = await generateArticle(topic);
        console.log('Article generated successfully');

        // Generate alternative titles for SEO
        console.log('Generating alternative titles for SEO...');
        const alternativeTitles = await generateAlternativeTitles(topic, articleContent);
        
        // Generate keyword analysis for SEO
        console.log('Generating keyword analysis for SEO...');
        const keywordAnalysis = await generateKeywordsAnalysis(topic, articleContent);

        const now = Date.now();
        const articleObj = {
            id: now,
            content: articleContent,
            topic,
            category: articleCategory
        };

        // Attempt to generate the image
        try {
            const imageResult = await generateImage(articleObj);
            console.log('Image generated successfully');

            // If generateImage returned an updated article object:
            let imageUrl;
            if (typeof imageResult === 'object') {
                imageUrl = imageResult.imageUrl;
            } else {
                imageUrl = imageResult;
            }

            const articlesDir = path.join(__dirname, 'articles');
            const articleDir = path.join(articlesDir, articleObj.id.toString());

            await ensureDir(articlesDir);
            await ensureDir(articleDir);

            const timestamp = articleObj.id;
            const articleData = {
                id: articleObj.id,
                title: topic,
                category: articleCategory,
                content: articleContent,
                imageUrl: imageUrl, 
                timestamp,
                metadata: {
                    canonical: `/articles/${timestamp}`,
                    modifiedDate: new Date().toISOString(),
                    keywords: topic.toLowerCase().split(' ').join(','),
                    alternativeTitles: alternativeTitles,
                    seoAnalysis: keywordAnalysis
                },
                entityKeywords: keywordAnalysis.mainEntities,
                longTailKeywords: keywordAnalysis.longTailKeywords,
                date: new Date(timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: new Date(timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                url: `/articles/${timestamp}`
            };

            // Write file
            const articlePath = path.join(articleDir, 'article.json');
            const articleWritten = await writeJsonFile(articlePath, articleData);
            if (!articleWritten) {
                throw new Error('Failed to write article file');
            }

            console.log('Article and image saved successfully');
            return { success: true, articleData };

        } catch (imageError) {
            console.error('Error with image generation, saving article with placeholder:', imageError);

            // Save article anyway with placeholder
            const articlesDir = path.join(__dirname, 'articles');
            const articleDir = path.join(articlesDir, articleObj.id.toString());
            await ensureDir(articlesDir);
            await ensureDir(articleDir);

            const timestamp = articleObj.id;
            const articleData = {
                id: articleObj.id,
                title: topic,
                category: articleCategory,
                content: articleContent,
                imageUrl: 'https://via.placeholder.com/800x450?text=Image+Generation+Failed',
                timestamp,
                metadata: {
                    canonical: `/articles/${timestamp}`,
                    modifiedDate: new Date().toISOString(),
                    keywords: topic.toLowerCase().split(' ').join(','),
                    alternativeTitles: alternativeTitles,
                    seoAnalysis: keywordAnalysis
                },
                entityKeywords: keywordAnalysis.mainEntities,
                longTailKeywords: keywordAnalysis.longTailKeywords,
                date: new Date(timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: new Date(timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                url: `/articles/${timestamp}`
            };

            const articlePath = path.join(articleDir, 'article.json');
            const articleWritten = await writeJsonFile(articlePath, articleData);

            if (!articleWritten) {
                throw new Error('Failed to write article file');
            }

            console.log('Article saved with placeholder image');
            return { success: true, articleData, imageError: true };
        }

    } catch (error) {
        console.error('Error generating article:', error);
        return { success: false, error };
    }
}

/**
 * Updates the articles index.json file by scanning the ./articles directory
 * for all article.json files, then sorting them by timestamp (newest first).
 */
async function updateArticlesIndex() {
    try {
        console.log('Updating articles index...');
        const articlesDir = path.join(__dirname, 'articles');
        const indexPath = path.join(articlesDir, 'index.json');

        // Create articles directory if it doesn't exist
        await ensureDir(articlesDir);

        // Get all article directories
        const files = await fsPromises.readdir(articlesDir);
        const articleDirs = files.filter(file => {
            return file !== 'index.json' && file !== 'index.html' && file !== 'README.md';
        });

        console.log(`Found ${articleDirs.length} article directories`);

        // Read each article's metadata
        const articles = [];
        for (const dir of articleDirs) {
            try {
                const articlePath = path.join(articlesDir, dir, 'article.json');
                console.log(`Reading article from: ${articlePath}`);

                const fileContent = await fsPromises.readFile(articlePath, 'utf8');
                const articleData = JSON.parse(fileContent);

                console.log(`Successfully parsed article data for ${dir}`);

                // Clean up the title if needed (remove leading numbering)
                let cleanTitle = articleData.title;
                if (typeof cleanTitle === 'string') {
                    cleanTitle = cleanTitle.replace(/^\d+\.\s+/, '');
                    // If changed, update the file
                    if (cleanTitle !== articleData.title) {
                        articleData.title = cleanTitle;
                        await writeJsonFile(articlePath, articleData);
                        console.log(`Updated article ${dir} with clean title: ${cleanTitle}`);
                    }
                }

                articles.push({
                    id: dir,
                    title: cleanTitle,
                    category: articleData.category,
                    timestamp: articleData.timestamp
                });

            } catch (error) {
                console.error(`Error reading or parsing article ${dir}:`, error);
            }
        }

        // Sort by timestamp desc
        articles.sort((a, b) => b.timestamp - a.timestamp);

        // Write index.json
        const indexData = { articles };
        const indexWritten = await writeJsonFile(indexPath, indexData);
        if (!indexWritten) {
            throw new Error('Failed to write index file');
        }

        console.log('Articles index updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating articles index:', error);
        return false;
    }
}

// Add a new function to copy articles to the public folder
async function copyArticlesToPublic() {
    try {
        const sourceDir = path.join(__dirname, 'articles');
        const destDir = path.join(__dirname, 'blog-site', 'public', 'articles');
        await fsPromises.mkdir(destDir, { recursive: true });

        // Use fsPromises.cp if available (Node 16.7.0+)
        if (fsPromises.cp) {
            await fsPromises.cp(sourceDir, destDir, { recursive: true });
        } else {
            // Fallback: use a simple recursive copy function (not implemented here) or exec robocopy
            const { exec } = require('child_process');
            await new Promise((resolve, reject) => {
                exec(`robocopy "${sourceDir}" "${destDir}" /E /NFL /NDL /NJH /NJS /nc /ns /np >nul`, (error, stdout, stderr) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve();
                });
            });
        }
        console.log(`تم نسخ المقالات إلى ${destDir}`);
    } catch (error) {
        console.error('Error copying articles to public folder:', error);
    }
}

/**
 * A helper function to request multiple random medical articles or to retrieve 
 * the latest news headlines only (via "news" argument).
 */
async function main() {
    try {
        // Check if user wants to only fetch "news" headlines
        if (process.argv[2] === 'news') {
            // Format: node script.js news [count] [category]
            const count = parseInt(process.argv[3]) || 5;
            const category = process.argv[4] || null;
            
            console.log(
                category
                ? `Requesting ${count} latest medical news items for category: ${category}`
                : `Requesting ${count} latest medical news items across all categories`
            );

            const newsTopics = await getLatestNewsTopics(count);

            // If a category is provided, filter
            let filteredTopics = newsTopics;
            if (category) {
                filteredTopics = newsTopics.filter(item =>
                    item.category.toLowerCase() === category.toLowerCase()
                );
                if (filteredTopics.length === 0) {
                    console.log(`No topics found for category: ${category}, showing all categories`);
                    filteredTopics = newsTopics;
                }
            }

            console.log('\nLatest Medical News Headlines:');
            filteredTopics.forEach((item, index) => {
                console.log(`${index + 1}. ${item.topic} [${item.category}]`);
            });

            // Category breakdown
            const categoryCount = {};
            filteredTopics.forEach(item => {
                const cat = item.category;
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            });

            console.log('\nCategory breakdown:');
            for (const [cat, num] of Object.entries(categoryCount)) {
                console.log(`- ${cat}: ${num} headline(s)`);
            }

            return;
        }

        // Otherwise, generate articles
        const count = parseInt(process.argv[2]) || 1;
        const category = process.argv[3] || null; // Optional category

        if (category) {
            console.log(`Generating ${count} article(s) in category: ${category}`);
        } else {
            console.log(`Generating ${count} article(s) with random categories`);
        }

        let successCount = 0;
        let failedCount = 0;

        // Track category stats
        let categoryStats = {
            'specialized-care': 0,
            'medical-research': 0,
            'medical-technology': 0,
            'public-health': 0
        };

        for (let i = 0; i < count; i++) {
            console.log(`\nGenerating article ${i + 1} of ${count}`);
            try {
                const result = await generateSingleArticle(category);
                if (result.success) {
                    successCount++;
                    if (result.articleData && result.articleData.category) {
                        const cat = result.articleData.category.toLowerCase();
                        if (categoryStats[cat] != null) {
                            categoryStats[cat] += 1;
                        } else {
                            categoryStats[cat] = 1;
                        }
                    }
                    if (result.imageError) {
                        console.log(`Article ${i + 1} saved but had image generation issues`);
                    }
                } else {
                    failedCount++;
                    console.log(`Failed to generate article ${i + 1}`);
                }
            } catch (error) {
                failedCount++;
                console.error(`Critical error while generating article ${i + 1}:`, error);
                console.log('Continuing with next article...');
            }
            
            if (i < count - 1) {
                await delay(5000);
            }
        }

        // Update index
        try {
            await updateArticlesIndex();
        } catch (indexError) {
            console.error('Error updating articles index:', indexError);
        }

        // Copy articles to public folder so run-blog.bat only needs to run once
        try {
            await copyArticlesToPublic();
        } catch (copyError) {
            console.error('Error copying articles to public folder:', copyError);
        }

        console.log(`\nCompleted: Generated ${successCount} out of ${count} articles successfully`);
        if (failedCount > 0) {
            console.log(`${failedCount} articles failed to generate completely`);
        }

        // Print category stats
        console.log('\nCategory breakdown:');
        for (const [cat, num] of Object.entries(categoryStats)) {
            if (num > 0) {
                console.log(`- ${cat}: ${num} article(s)`);
            }
        }

    } catch (error) {
        console.error('Error in main function:', error);
    }
}

// Run the main function
main();
