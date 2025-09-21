
# Setup
## Environment Variables

### Server `.env`  
```bash
MONGODB_URI=mongodb+srv://...
ELEVEN_LABS_API_KEY=YOUR_API_KEY
ELEVEN_LABS_API_URL=https://api.elevenlabs.io/v1/audio-to-text
SAPLING_API_KEY=YOUR_API_KEY
SAPLING_API_URL=https://api.sapling.ai/api/v1/aidetect
CLOUDINARY_CLOUD_NAME=YOUR_API_KEY
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_KEY
CLIENT_URL=http://localhost:3000
CLERK_PUBLISHABLE_KEY=YOUR_API_KEY
CLERK_SECRET_KEY=YOUR_API_KEY
SCREENSHOT_API_KEY=YOUR_API_KEY
PORT=8080
```  

## Design Decisions

- **Modular Architecture**: The application is structured into controllers, services, models, and routes for better maintainability and scalability.
- **Asynchronous Processing**: Utilizes asynchronous functions to handle I/O operations efficiently, especially for network requests and file processing.
- **Error Handling**: Implemented robust error handling to manage API failures and invalid inputs gracefully.

## Docker

To build and run the application using Docker, execute the following command:
```
docker-compose up --build
```

## Sample Output

The service generates a JSON output containing the analysis results, including the transcript and AI probability. A sample output structure is as follows:
```json
{
    "success": true,
    "data": {
        "id": "68d0177ca92e1991fe10a27e",
        "youtubeUrl": "https://www.youtube.com/watch?v=1aA1WGON49E",
        "videoTitle": "A one minute TEDx Talk for the digital age | Woody Roseland | TEDxMileHigh",
        "status": "completed",
        "transcript": [
            {
                "id": 0,
                "text": "Wow. What an audience. But if I'm being honest, I don't care what you think of my talk.",
                "start": 0,
                "end": 12,
                "speaker": "speaker",
                "ai_probability": 0.002,
                "analysis": "HUMAN",
                "error": null
            },
            {
                "id": 1,
                "text": "I don't. I care what the internet thinks of my talk.",
                "start": 12,
                "end": 20,
                "speaker": "speaker",
                "ai_probability": 0.988,
                "analysis": "AI",
                "error": null
            },
            {
                "id": 2,
                "text": "(laughs) 'Cause they're the ones who get it seen and get it shared.",
                "start": 20,
                "end": 24,
                "speaker": "speaker",
                "ai_probability": 0.985,
                "analysis": "AI",
                "error": null
            },
            {
                "id": 3,
                "text": "And I think that's where most people get it wrong.",
                "start": 24,
                "end": 28,
                "speaker": "speaker",
                "ai_probability": 0.795,
                "analysis": "AI",
                "error": null
            },
        ],
        "createdAt": "2025-09-21T15:19:24.359Z",
        "completedAt": "2025-09-21T15:19:56.040Z",
        "screenshotUrl": "https://res.cloudinary.com/dwcy4cz5j/image/upload/v1758467972/youtube-analysis/screenshots/screenshot_68d0177ca92e1991fe10a27e.png",
        "audioUrl": "/api/media/audio/68d0177ca92e1991fe10a27e",
        "audioSize": 2584366,
        "audioMimeType": "audio/wav",
        "screenshotCloudinaryId": "youtube-analysis/screenshots/screenshot_68d0177ca92e1991fe10a27e",
        "aiAnalysisSummary": {
            "verdict": "HUMAN",
            "aiProbability": 0.44,
            "totalSegments": 17,
            "aiSegments": 8,
            "humanSegments": 9,
            "error": null
        }
    }
}
```