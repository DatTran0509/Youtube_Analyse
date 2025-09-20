import { takeScreenshotAndUpload } from './screenshot.js';
// Add this debug function to test manually
export const debugScreenshot = async (url = "https://www.youtube.com/watch?v=r7dWsJ-mEyI") => {
    const result = await takeScreenshotAndUpload(url, 'debug-test');
    console.log('Debug result:', result);
    return result;
};