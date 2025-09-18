import { exec } from 'child_process';

export const convertToWav = (inputFile, outputFile) => {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${inputFile}" -ac 1 -ar 16000 -acodec pcm_s16le "${outputFile}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`FFmpeg conversion failed: ${stderr}`));
            } else {
                resolve(outputFile);
            }
        });
    });
};