export interface TranscriptSegment {
    id: number;
    text: string;
    start: number;
    end: number;
    speaker: string;
    ai_probability: number;
    analysis: "AI" | "HUMAN";
    error: string | null;
  }
  
  export interface AiAnalysisSummary {
    verdict: "AI" | "HUMAN";
    aiProbability: number;
    totalSegments: number;
    aiSegments: number;
    humanSegments: number;
    error: string | null;
  }
  
  export interface AnalysisData {
    id: string;
    youtubeUrl: string;
    videoTitle: string;
    status: string;
    transcript: TranscriptSegment[];
    createdAt: string;
    completedAt: string;
    screenshotUrl: string;
    audioUrl: string;
    audioSize: number;
    audioMimeType: string;
    screenshotCloudinaryId: string;
    aiAnalysisSummary: AiAnalysisSummary;
  }
  
  export interface AnalysisResponse {
    success: boolean;
    message?: string;
    data: {
      id: string;
      videoTitle: string;
      transcriptCount: number;
      status: string;
      completedAt: string;
    };
  }
  
  export interface ResultResponse {
    success: boolean;
    data: AnalysisData;
  }
  