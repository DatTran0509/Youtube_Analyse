import puppeteer from 'puppeteer';
import { uploadScreenshotToCloudinary } from './cloudinaryService.js';

export const takeScreenshotAndUpload = async (url, analysisId) => {
    let browser;
    
    try {
        console.log('📸 Taking screenshot for Cloudinary upload...');
        
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // Set viewport and user agent
        await page.setViewport({ width: 1280, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        
        // Navigate to YouTube video
        await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        // Wait for video thumbnail to load
        await page.waitForSelector('#movie_player', { timeout: 10000 });
        
        // Take screenshot as buffer - FIXED: Remove quality for PNG
        const screenshotBuffer = await page.screenshot({
            type: 'png',
            fullPage: false
        });

        console.log('✅ Screenshot captured:', screenshotBuffer.length, 'bytes');
        
        // Upload to Cloudinary
        const cloudinaryResult = await uploadScreenshotToCloudinary(screenshotBuffer, analysisId);
        
        return {
            screenshotUrl: cloudinaryResult.url,
            screenshotCloudinaryId: cloudinaryResult.publicId
        };
        
    } catch (error) {
        console.error('❌ Screenshot failed:', error.message);
        
        // Return fallback URL
        return {
            screenshotUrl: `/api/media/fallback-screenshot`,
            screenshotCloudinaryId: null
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};