import puppeteer from 'puppeteer';
import { uploadScreenshotToCloudinary } from './cloudinaryService.js';

export const takeScreenshotAndUpload = async (url, analysisId) => {
    let browser;
    
    try {
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
        
        await page.setViewport({ width: 1280, height: 720 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        
        await page.goto(url, { 
            waitUntil: 'domcontentloaded', // Chỉ chờ DOM tải xong
            timeout: 15000 // Giảm thời gian chờ
        });

        // Lấy URL thumbnail từ meta tag
        const thumbnailUrl = await page.evaluate(() => {
            const metaTag = document.querySelector('meta[property="og:image"]');
            return metaTag ? metaTag.content : null;
        });

        let thumbnailBuffer;

        if (thumbnailUrl) {
            // Tải thumbnail nhanh hơn bằng fetch
            const response = await page.evaluate(async (url) => {
                const res = await fetch(url);
                const buffer = await res.arrayBuffer();
                return Array.from(new Uint8Array(buffer));
            }, thumbnailUrl);

            thumbnailBuffer = Buffer.from(response);
        } else {
            // Nếu không tìm thấy meta thumbnail, fallback sang chụp màn hình
            thumbnailBuffer = await page.screenshot({
                type: 'png',
                fullPage: false,
                clip: {
                    x: 0,
                    y: 0,
                    width: 1280,
                    height: 720
                }
            });
        }

        const cloudinaryResult = await uploadScreenshotToCloudinary(thumbnailBuffer, analysisId);
        // console.log('Cloudinary uploaded');
        return {
            screenshotUrl: cloudinaryResult.url,
            screenshotCloudinaryId: cloudinaryResult.publicId
        };
        
    } catch (error) {
        console.error('Error taking screenshot:', error);
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