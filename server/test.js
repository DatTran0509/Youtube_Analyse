import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const testSpeechToText = async () => {
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    console.log('🔑 Testing ElevenLabs Speech-to-Text with valid models...');
    
    // Find existing audio file to test
    const audioFiles = fs.readdirSync('./uploads').filter(f => f.endsWith('.wav'));
    
    if (audioFiles.length === 0) {
        console.log('❌ No audio files found for testing');
        return;
    }
    
    const audioPath = `./uploads/${audioFiles[0]}`;
    console.log('📁 Testing with:', audioPath);
    console.log('📁 File size:', fs.statSync(audioPath).size, 'bytes');
    
    // Try valid models from error message
    const validModels = ['scribe_v1', 'scribe_v1_experimental'];
    
    for (const model of validModels) {
        try {
            console.log(`📤 Testing model: ${model}`);
            const form = new FormData();
            form.append('file', fs.createReadStream(audioPath));
            form.append('model_id', model);
            
            const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', form, {
                headers: {
                    ...form.getHeaders(),
                    'xi-api-key': apiKey
                },
                timeout: 60000
            });
            
            console.log(`✅ Model ${model} works!`);
            console.log('📊 Response:', JSON.stringify(response.data, null, 2));
            return; // Success, exit
            
        } catch (error) {
            console.log(`❌ Model ${model} failed:`, error.response?.data);
        }
    }
    
    console.log('❌ All valid models failed');
};

testSpeechToText();