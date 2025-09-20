// client/src/services/analysisService.ts
import { useState, useEffect } from 'react';

// Types
export interface AnalysisHistoryItem {
  _id: string;
  youtubeUrl: string;
  videoTitle: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  screenshotUrl?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AnalysisHistoryResponse {
  success: boolean;
  data: {
    analyses: AnalysisHistoryItem[];
    pagination: PaginationInfo;
  };
  error?: string;
}

export interface TranscriptSegment {
  id: number;
  text: string;
  start: number;
  end: number;
  ai_probability: number;
  analysis: 'AI' | 'Human';
}

export interface AIAnalysisSummary {
  verdict: 'AI' | 'Human';
  aiProbability: number;
  aiSegments: number;
  humanSegments: number;
}

export interface AnalysisDetailData {
  id: string;
  youtubeUrl: string;
  videoTitle: string;
  status: string;
  createdAt: string;
  completedAt: string;
  screenshotUrl: string;
  hasAudio: boolean;
  audioUrl: string;
  audioSize: number;
  audioMimeType: string;
  transcript: TranscriptSegment[];
  aiAnalysisSummary: AIAnalysisSummary;
}

// API functions
const API_BASE_URL = '/api';

export const fetchUserAnalyses = async (page = 1, limit = 10): Promise<AnalysisHistoryResponse> => {
  try {
    console.log('=== FETCH USER ANALYSES ===');
    console.log('Page:', page, 'Limit:', limit);
    
    const response = await fetch(`${API_BASE_URL}/user/analyses?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch analyses');
    }

    const data = await response.json();
    console.log('Analyses fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user analyses:', error);
    throw error;
  }
};

export const analyzeVideo = async (url: string) => {
  try {
    console.log('=== ANALYZE VIDEO ===');
    console.log('URL:', url);
    
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Analysis failed');
    }

    const data = await response.json();
    console.log('Analysis started successfully:', data);
    return data;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
};

export const fetchAnalysisResult = async (analysisId: string) => {
  try {
    console.log('=== FETCH ANALYSIS RESULT ===');
    console.log('Analysis ID:', analysisId);
    
    const response = await fetch(`${API_BASE_URL}/result/${analysisId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch result');
    }

    const data = await response.json();
    console.log('Result fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching analysis result:', error);
    throw error;
  }
};

// Custom hooks
export const useAnalysisHistory = () => {
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const loadAnalyses = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetchUserAnalyses(page, limit);
      setAnalyses(response.data.analyses);
      setPagination(response.data.pagination);
    } catch (err) {
      setError((err as Error).message || 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  return {
    analyses,
    loading,
    error,
    pagination,
    fetchUserAnalyses: loadAnalyses
  };
};

export const useVideoAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<AnalysisHistoryResponse | null>(null);

  const startAnalysis = async (url: string) => {
    setAnalyzing(true);
    setError('');
    setResult(null);
    
    try {
      const response = await analyzeVideo(url);
      setResult(response);
      return response;
    } catch (err: unknown) {
      setError((err as Error).message || 'Analysis failed');
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  return {
    analyzing,
    error,
    result,
    startAnalysis
  };
};

export const useAnalysisResult = (analysisId: string | null) => {
  const [result, setResult] = useState<AnalysisDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadResult = async (id?: string) => {
    const targetId = id || analysisId;
    if (!targetId) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetchAnalysisResult(targetId);
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to load result');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysisId) {
      loadResult();
    }
  }, [analysisId]);

  return {
    result,
    loading,
    error,
    refetch: loadResult
  };
};

// Utility functions
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-400';
    case 'processing':
      return 'text-blue-400';
    case 'failed':
      return 'text-red-400';
    default:
      return 'text-purple-400';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'processing':
      return 'Đang xử lý';
    case 'completed':
      return 'Hoàn thành';
    case 'failed':
      return 'Thất bại';
    default:
      return 'Không xác định';
  }
};

export const formatAnalysisDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN');
};

export const formatTimeStamp = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getAnalysisColor = (analysis: string) => {
  return analysis === 'AI' ? 'text-red-400' : 'text-green-400';
};

export const getProbabilityColor = (probability: number) => {
  if (probability > 0.7) return 'text-red-400';
  if (probability > 0.3) return 'text-yellow-400';
  return 'text-green-400';
};

export const getProbabilityBg = (probability: number) => {
  if (probability > 0.7) return 'bg-red-500/20 border-red-500/30';
  if (probability > 0.3) return 'bg-yellow-500/20 border-yellow-500/30';
  return 'bg-green-500/20 border-green-500/30';
};

// Default export for convenience
export default {
  fetchUserAnalyses,
  analyzeVideo,
  fetchAnalysisResult,
  useAnalysisHistory,
  useVideoAnalysis,
  useAnalysisResult,
  getStatusColor,
  getStatusText,
  formatAnalysisDate,
  formatTimeStamp,
  getAnalysisColor,
  getProbabilityColor,
  getProbabilityBg
};