# YouTube Analysis Service

This project is a Node.js service that analyzes YouTube videos by extracting audio, taking screenshots, and providing transcriptions with AI analysis. It utilizes various technologies including Puppeteer, ytdl-core, FFmpeg, ElevenLabs Scribe, and GPTZero.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Design Decisions](#design-decisions)
- [Docker](#docker)
- [Sample Output](#sample-output)
- [End-to-End Capture](#end-to-end-capture)

## Features

- Submit a YouTube URL via a web form or REST API.
- Automatically take a thumbnail screenshot of the video.
- Download the audio track and convert it to WAV format.
- Transcribe audio with word-level timestamps and speaker diarization.
- Analyze sentences for AI probability using GPTZero.
- Retrieve analysis results via a REST API.

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd youtube-analysis-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up MongoDB and ensure it is running.

4. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

5. Start the application:
   ```
   npm start
   ```

## Environment Variables

- `MONGODB_URI`: Connection string for MongoDB.
- `ELEVENLABS_API_KEY`: API key for ElevenLabs Scribe.
- `GPTZERO_API_KEY`: API key for GPTZero.
- `PORT`: Port number for the application (default is 8080).

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
  "id": "unique-analysis-id",
  "screenshot": "path/to/screenshot.png",
  "transcript": [
    {
      "sentence": "This is a sample sentence.",
      "ai_probability": 0.85
    }
  ]
}
```

## End-to-End Capture

A short video demonstrating the end-to-end functionality of the service can be found [here](link-to-video).